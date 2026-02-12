import express, { type Express } from "express";
import fs from "fs";
import path from "path";

function findDistPublic(): string {
  const candidates = [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "..", "dist", "public"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, "index.html"))) {
      return candidate;
    }
  }

  throw new Error(
    `Could not find the build directory. Searched:\n${candidates.join("\n")}\nMake sure to build the client first.`,
  );
}

export function serveStatic(app: Express) {
  const distPath = findDistPublic();

  app.use(express.static(distPath, {
    maxAge: '1y',
    immutable: true,
    index: false,
    etag: true,
    lastModified: true
  }));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"), {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  });
}
