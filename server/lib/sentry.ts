import * as Sentry from "@sentry/node";
import type { Request, Response, NextFunction } from "express";
import { createLogger } from "./logger";

const log = createLogger('sentry');

let isInitialized = false;

export function initServerSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (process.env.NODE_ENV === "production" && dsn) {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      release: process.env.APP_VERSION || "1.0.0",
      tracesSampleRate: 0.1,
      profilesSampleRate: 0.1,
      ignoreErrors: [
        "ECONNRESET",
        "ECONNREFUSED",
        "ETIMEDOUT",
        "socket hang up",
        "Rate limit exceeded",
      ],
      beforeSend(event) {
        if (event.request?.headers) {
          delete event.request.headers['cookie'];
          delete event.request.headers['authorization'];
        }
        return event;
      },
    });
    isInitialized = true;
    log.info("Server monitoring initialized");
  } else if (process.env.NODE_ENV === "production") {
    log.warn("SENTRY_DSN not set - error monitoring disabled");
  }
}

export function sentryRequestHandler() {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (isInitialized) {
      Sentry.setContext("request", {
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      if (req.session?.userId) {
        Sentry.setUser({ id: req.session.userId });
      }
      Sentry.setTag("route", req.route?.path || req.path);
    }
    next();
  };
}

export function sentryErrorHandler() {
  return (err: Error, req: Request, _res: Response, next: NextFunction) => {
    if (isInitialized) {
      Sentry.withScope((scope) => {
        scope.setExtra("url", req.url);
        scope.setExtra("method", req.method);
        scope.setExtra("params", req.params);
        scope.setExtra("query", req.query);
        if (req.session?.userId) {
          scope.setUser({ id: req.session.userId });
        }
        scope.setTag("route", req.route?.path || req.path);
        scope.setTag("method", req.method);
        Sentry.captureException(err);
      });
    }
    next(err);
  };
}

export function captureServerError(error: Error, context?: Record<string, unknown>) {
  log.error(error.message, error, context);
  if (isInitialized) {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      Sentry.captureException(error);
    });
  }
}

export { Sentry };
