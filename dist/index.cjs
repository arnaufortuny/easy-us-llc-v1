"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc3) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc3 = __getOwnPropDesc(from, key)) || desc3.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// shared/models/auth.ts
var import_drizzle_orm, import_pg_core, sessions, users;
var init_auth = __esm({
  "shared/models/auth.ts"() {
    "use strict";
    import_drizzle_orm = require("drizzle-orm");
    import_pg_core = require("drizzle-orm/pg-core");
    sessions = (0, import_pg_core.pgTable)(
      "sessions",
      {
        sid: (0, import_pg_core.varchar)("sid").primaryKey(),
        sess: (0, import_pg_core.jsonb)("sess").notNull(),
        expire: (0, import_pg_core.timestamp)("expire").notNull()
      },
      (table) => [(0, import_pg_core.index)("IDX_session_expire").on(table.expire)]
    );
    users = (0, import_pg_core.pgTable)("users", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      email: (0, import_pg_core.varchar)("email").unique(),
      firstName: (0, import_pg_core.varchar)("first_name"),
      lastName: (0, import_pg_core.varchar)("last_name"),
      profileImageUrl: (0, import_pg_core.varchar)("profile_image_url"),
      phone: (0, import_pg_core.varchar)("phone"),
      businessActivity: (0, import_pg_core.text)("business_activity"),
      emailVerified: (0, import_pg_core.boolean)("email_verified").notNull().default(false),
      isAdmin: (0, import_pg_core.boolean)("is_admin").notNull().default(false),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
    });
  }
});

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  applicationDocuments: () => applicationDocuments,
  applicationDocumentsRelations: () => applicationDocumentsRelations,
  contactOtps: () => contactOtps,
  insertApplicationDocumentSchema: () => insertApplicationDocumentSchema,
  insertContactOtpSchema: () => insertContactOtpSchema,
  insertLlcApplicationSchema: () => insertLlcApplicationSchema,
  insertMaintenanceApplicationSchema: () => insertMaintenanceApplicationSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertProductSchema: () => insertProductSchema,
  llcApplications: () => llcApplications2,
  llcApplicationsRelations: () => llcApplicationsRelations,
  maintenanceApplications: () => maintenanceApplications,
  maintenanceApplicationsRelations: () => maintenanceApplicationsRelations,
  messages: () => messages,
  newsletterSubscribers: () => newsletterSubscribers,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  products: () => products,
  sessions: () => sessions,
  users: () => users
});
var import_pg_core2, import_drizzle_zod, import_drizzle_orm2, products, orders, llcApplications2, applicationDocuments, newsletterSubscribers, messages, contactOtps, ordersRelations, llcApplicationsRelations, applicationDocumentsRelations, insertProductSchema, insertOrderSchema, insertLlcApplicationSchema, insertApplicationDocumentSchema, maintenanceApplications, insertMaintenanceApplicationSchema, insertContactOtpSchema, maintenanceApplicationsRelations;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    init_auth();
    import_pg_core2 = require("drizzle-orm/pg-core");
    import_drizzle_zod = require("drizzle-zod");
    init_auth();
    import_drizzle_orm2 = require("drizzle-orm");
    products = (0, import_pg_core2.pgTable)("products", {
      id: (0, import_pg_core2.serial)("id").primaryKey(),
      name: (0, import_pg_core2.text)("name").notNull(),
      description: (0, import_pg_core2.text)("description").notNull(),
      price: (0, import_pg_core2.integer)("price").notNull(),
      // in cents
      features: (0, import_pg_core2.jsonb)("features").$type().notNull()
    });
    orders = (0, import_pg_core2.pgTable)("orders", {
      id: (0, import_pg_core2.serial)("id").primaryKey(),
      userId: (0, import_pg_core2.varchar)("user_id").notNull().references(() => users.id),
      productId: (0, import_pg_core2.integer)("product_id").notNull().references(() => products.id),
      status: (0, import_pg_core2.text)("status").notNull().default("pending"),
      // pending, paid, cancelled
      stripeSessionId: (0, import_pg_core2.text)("stripe_session_id"),
      amount: (0, import_pg_core2.integer)("amount").notNull(),
      createdAt: (0, import_pg_core2.timestamp)("created_at").defaultNow()
    });
    llcApplications2 = (0, import_pg_core2.pgTable)("llc_applications", {
      id: (0, import_pg_core2.serial)("id").primaryKey(),
      orderId: (0, import_pg_core2.integer)("order_id").notNull().references(() => orders.id),
      requestCode: (0, import_pg_core2.text)("request_code").unique(),
      ownerFullName: (0, import_pg_core2.text)("owner_full_name"),
      ownerEmail: (0, import_pg_core2.text)("owner_email"),
      ownerPhone: (0, import_pg_core2.text)("owner_phone"),
      ownerBirthDate: (0, import_pg_core2.text)("owner_birth_date"),
      ownerAddress: (0, import_pg_core2.text)("owner_address"),
      ownerStreetType: (0, import_pg_core2.text)("owner_street_type"),
      // Calle, Avenida, Paseo
      ownerCity: (0, import_pg_core2.text)("owner_city"),
      ownerCountry: (0, import_pg_core2.text)("owner_country"),
      ownerProvince: (0, import_pg_core2.text)("owner_province"),
      ownerPostalCode: (0, import_pg_core2.text)("owner_postal_code"),
      ownerIdNumber: (0, import_pg_core2.text)("owner_id_number"),
      // DNI/Passport number
      ownerIdType: (0, import_pg_core2.text)("owner_id_type"),
      // DNI or Passport
      idLater: (0, import_pg_core2.boolean)("id_later").notNull().default(false),
      dataProcessingConsent: (0, import_pg_core2.boolean)("data_processing_consent").notNull().default(false),
      termsConsent: (0, import_pg_core2.boolean)("terms_consent").notNull().default(false),
      ageConfirmation: (0, import_pg_core2.boolean)("age_confirmation").notNull().default(false),
      companyName: (0, import_pg_core2.text)("company_name"),
      companyNameOption2: (0, import_pg_core2.text)("company_name_option_2"),
      designator: (0, import_pg_core2.text)("designator"),
      // LLC, L.L.C., Ltd.
      companyDescription: (0, import_pg_core2.text)("company_description"),
      businessCategory: (0, import_pg_core2.text)("business_category"),
      businessActivity: (0, import_pg_core2.text)("business_activity"),
      businessCategoryOther: (0, import_pg_core2.text)("business_category_other"),
      ownerNamesAlternates: (0, import_pg_core2.text)("owner_names_alternates"),
      // Plan B, C, D names
      ownerCount: (0, import_pg_core2.integer)("owner_count").default(1),
      ownerCountryResidency: (0, import_pg_core2.text)("owner_country_residency"),
      idDocumentUrl: (0, import_pg_core2.text)("id_document_url"),
      isSellingOnline: (0, import_pg_core2.text)("is_selling_online"),
      // Yes, No, Not sure
      needsBankAccount: (0, import_pg_core2.text)("needs_bank_account"),
      // Mercury, Relay, No, Yes
      willUseStripe: (0, import_pg_core2.text)("will_use_stripe"),
      // Stripe, PayPal, Both, Other, Not yet
      wantsBoiReport: (0, import_pg_core2.text)("wants_boi_report"),
      // Yes, No, Info
      wantsMaintenancePack: (0, import_pg_core2.text)("wants_maintenance_pack"),
      // Yes, No, Info
      paymentStatus: (0, import_pg_core2.text)("payment_status").notNull().default("unpaid"),
      // unpaid, paid
      notes: (0, import_pg_core2.text)("notes"),
      state: (0, import_pg_core2.text)("state"),
      status: (0, import_pg_core2.text)("status").notNull().default("draft"),
      // draft, submitted, filed, rejected
      submittedAt: (0, import_pg_core2.timestamp)("submitted_at"),
      lastUpdated: (0, import_pg_core2.timestamp)("last_updated").defaultNow(),
      emailOtp: (0, import_pg_core2.text)("email_otp"),
      emailOtpExpires: (0, import_pg_core2.timestamp)("email_otp_expires"),
      emailVerified: (0, import_pg_core2.boolean)("email_verified").notNull().default(false)
    });
    applicationDocuments = (0, import_pg_core2.pgTable)("application_documents", {
      id: (0, import_pg_core2.serial)("id").primaryKey(),
      applicationId: (0, import_pg_core2.integer)("application_id").notNull().references(() => llcApplications2.id),
      fileName: (0, import_pg_core2.text)("file_name").notNull(),
      fileType: (0, import_pg_core2.text)("file_type").notNull(),
      fileUrl: (0, import_pg_core2.text)("file_url").notNull(),
      documentType: (0, import_pg_core2.text)("document_type").notNull(),
      // passport, id, other
      uploadedAt: (0, import_pg_core2.timestamp)("uploaded_at").defaultNow()
    });
    newsletterSubscribers = (0, import_pg_core2.pgTable)("newsletter_subscribers", {
      id: (0, import_pg_core2.serial)("id").primaryKey(),
      email: (0, import_pg_core2.text)("email").notNull().unique(),
      subscribedAt: (0, import_pg_core2.timestamp)("subscribed_at").defaultNow()
    });
    messages = (0, import_pg_core2.pgTable)("messages", {
      id: (0, import_pg_core2.serial)("id").primaryKey(),
      userId: (0, import_pg_core2.varchar)("user_id").references(() => users.id),
      name: (0, import_pg_core2.text)("name"),
      email: (0, import_pg_core2.text)("email").notNull(),
      subject: (0, import_pg_core2.text)("subject"),
      content: (0, import_pg_core2.text)("content").notNull(),
      status: (0, import_pg_core2.text)("status").notNull().default("unread"),
      // unread, read, archived
      type: (0, import_pg_core2.text)("type").notNull().default("contact"),
      // contact, support, system
      requestCode: (0, import_pg_core2.text)("request_code"),
      createdAt: (0, import_pg_core2.timestamp)("created_at").defaultNow()
    });
    contactOtps = (0, import_pg_core2.pgTable)("contact_otps", {
      id: (0, import_pg_core2.serial)("id").primaryKey(),
      email: (0, import_pg_core2.text)("email").notNull(),
      otp: (0, import_pg_core2.text)("otp").notNull(),
      expiresAt: (0, import_pg_core2.timestamp)("expires_at").notNull(),
      verified: (0, import_pg_core2.boolean)("verified").notNull().default(false)
    });
    ordersRelations = (0, import_drizzle_orm2.relations)(orders, ({ one, many }) => ({
      user: one(users, { fields: [orders.userId], references: [users.id] }),
      product: one(products, { fields: [orders.productId], references: [products.id] }),
      application: one(llcApplications2, { fields: [orders.id], references: [llcApplications2.orderId] })
    }));
    llcApplicationsRelations = (0, import_drizzle_orm2.relations)(llcApplications2, ({ one, many }) => ({
      order: one(orders, { fields: [llcApplications2.orderId], references: [orders.id] }),
      documents: many(applicationDocuments)
    }));
    applicationDocumentsRelations = (0, import_drizzle_orm2.relations)(applicationDocuments, ({ one }) => ({
      application: one(llcApplications2, { fields: [applicationDocuments.applicationId], references: [llcApplications2.id] })
    }));
    insertProductSchema = (0, import_drizzle_zod.createInsertSchema)(products).omit({ id: true });
    insertOrderSchema = (0, import_drizzle_zod.createInsertSchema)(orders).omit({ id: true, createdAt: true });
    insertLlcApplicationSchema = (0, import_drizzle_zod.createInsertSchema)(llcApplications2).omit({ id: true, lastUpdated: true });
    insertApplicationDocumentSchema = (0, import_drizzle_zod.createInsertSchema)(applicationDocuments).omit({ id: true, uploadedAt: true });
    maintenanceApplications = (0, import_pg_core2.pgTable)("maintenance_applications", {
      id: (0, import_pg_core2.serial)("id").primaryKey(),
      orderId: (0, import_pg_core2.integer)("order_id").notNull().references(() => orders.id),
      requestCode: (0, import_pg_core2.text)("request_code").unique(),
      ownerFullName: (0, import_pg_core2.text)("owner_full_name"),
      ownerEmail: (0, import_pg_core2.text)("owner_email"),
      ownerPhone: (0, import_pg_core2.text)("owner_phone"),
      companyName: (0, import_pg_core2.text)("company_name"),
      ein: (0, import_pg_core2.text)("ein"),
      state: (0, import_pg_core2.text)("state"),
      creationSource: (0, import_pg_core2.text)("creation_source"),
      creationYear: (0, import_pg_core2.text)("creation_year"),
      bankAccount: (0, import_pg_core2.text)("bank_account"),
      paymentGateway: (0, import_pg_core2.text)("payment_gateway"),
      businessActivity: (0, import_pg_core2.text)("business_activity"),
      expectedServices: (0, import_pg_core2.text)("expected_services"),
      status: (0, import_pg_core2.text)("status").notNull().default("draft"),
      submittedAt: (0, import_pg_core2.timestamp)("submitted_at"),
      lastUpdated: (0, import_pg_core2.timestamp)("last_updated").defaultNow(),
      emailOtp: (0, import_pg_core2.text)("email_otp"),
      emailOtpExpires: (0, import_pg_core2.timestamp)("email_otp_expires"),
      emailVerified: (0, import_pg_core2.boolean)("email_verified").notNull().default(false),
      notes: (0, import_pg_core2.text)("notes"),
      wantsDissolve: (0, import_pg_core2.text)("wants_dissolve"),
      authorizedManagement: (0, import_pg_core2.boolean)("authorized_management").notNull().default(false),
      termsConsent: (0, import_pg_core2.boolean)("terms_consent").notNull().default(false),
      dataProcessingConsent: (0, import_pg_core2.boolean)("data_processing_consent").notNull().default(false)
    });
    insertMaintenanceApplicationSchema = (0, import_drizzle_zod.createInsertSchema)(maintenanceApplications).omit({ id: true, lastUpdated: true });
    insertContactOtpSchema = (0, import_drizzle_zod.createInsertSchema)(contactOtps).omit({ id: true });
    maintenanceApplicationsRelations = (0, import_drizzle_orm2.relations)(maintenanceApplications, ({ one }) => ({
      order: one(orders, { fields: [maintenanceApplications.orderId], references: [orders.id] })
    }));
  }
});

// vite.config.ts
var import_vite, import_plugin_react, import_path2, import_meta, vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    import_vite = require("vite");
    import_plugin_react = __toESM(require("@vitejs/plugin-react"), 1);
    import_path2 = __toESM(require("path"), 1);
    import_meta = {};
    vite_config_default = (0, import_vite.defineConfig)({
      plugins: [
        (0, import_plugin_react.default)()
      ],
      resolve: {
        alias: {
          "@": import_path2.default.resolve(import_meta.dirname, "client", "src"),
          "@shared": import_path2.default.resolve(import_meta.dirname, "shared"),
          "@assets": import_path2.default.resolve(import_meta.dirname, "client", "src", "assets")
        }
      },
      root: import_path2.default.resolve(import_meta.dirname, "client"),
      build: {
        outDir: import_path2.default.resolve(import_meta.dirname, "dist/public"),
        emptyOutDir: true,
        reportCompressedSize: false,
        chunkSizeWarningLimit: 1e3,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ["react", "react-dom", "framer-motion"],
              ui: ["lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-select"]
            }
          }
        }
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        },
        allowedHosts: true
      }
    });
  }
});

// node_modules/nanoid/url-alphabet/index.js
var urlAlphabet;
var init_url_alphabet = __esm({
  "node_modules/nanoid/url-alphabet/index.js"() {
    urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
  }
});

// node_modules/nanoid/index.js
var import_crypto, POOL_SIZE_MULTIPLIER, pool2, poolOffset, fillPool, nanoid;
var init_nanoid = __esm({
  "node_modules/nanoid/index.js"() {
    import_crypto = __toESM(require("crypto"), 1);
    init_url_alphabet();
    POOL_SIZE_MULTIPLIER = 128;
    fillPool = (bytes) => {
      if (!pool2 || pool2.length < bytes) {
        pool2 = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
        import_crypto.default.randomFillSync(pool2);
        poolOffset = 0;
      } else if (poolOffset + bytes > pool2.length) {
        import_crypto.default.randomFillSync(pool2);
        poolOffset = 0;
      }
      poolOffset += bytes;
    };
    nanoid = (size = 21) => {
      fillPool(size |= 0);
      let id = "";
      for (let i = poolOffset - size; i < poolOffset; i++) {
        id += urlAlphabet[pool2[i] & 63];
      }
      return id;
    };
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  setupVite: () => setupVite
});
async function setupVite(server, app2) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true
  };
  const vite = await (0, import_vite2.createServer)({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = import_path3.default.resolve(
        import_meta2.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await import_fs2.default.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
var import_vite2, import_fs2, import_path3, import_meta2, viteLogger;
var init_vite = __esm({
  "server/vite.ts"() {
    "use strict";
    import_vite2 = require("vite");
    init_vite_config();
    import_fs2 = __toESM(require("fs"), 1);
    import_path3 = __toESM(require("path"), 1);
    init_nanoid();
    import_meta2 = {};
    viteLogger = (0, import_vite2.createLogger)();
  }
});

// server/index.ts
var index_exports = {};
__export(index_exports, {
  log: () => log
});
module.exports = __toCommonJS(index_exports);
var import_express2 = __toESM(require("express"), 1);

// server/replit_integrations/auth/replitAuth.ts
var client = __toESM(require("openid-client"), 1);
var import_passport = require("openid-client/passport");
var import_passport2 = __toESM(require("passport"), 1);
var import_express_session = __toESM(require("express-session"), 1);
var import_memoizee = __toESM(require("memoizee"), 1);
var import_connect_pg_simple = __toESM(require("connect-pg-simple"), 1);

// server/replit_integrations/auth/storage.ts
init_auth();

// server/db.ts
var import_node_postgres = require("drizzle-orm/node-postgres");
var import_pg = __toESM(require("pg"), 1);
init_schema();
var { Pool } = import_pg.default;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });

// server/replit_integrations/auth/storage.ts
var import_drizzle_orm3 = require("drizzle-orm");
var AuthStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where((0, import_drizzle_orm3.eq)(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
};
var authStorage = new AuthStorage();

// server/replit_integrations/auth/replitAuth.ts
var getOidcConfig = (0, import_memoizee.default)(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = (0, import_connect_pg_simple.default)(import_express_session.default);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return (0, import_express_session.default)({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function updateUserDetails(userId, updates) {
  const user = await authStorage.getUser(userId);
  if (!user) return;
  await authStorage.upsertUser({
    ...user,
    ...updates,
    updatedAt: /* @__PURE__ */ new Date()
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(import_passport2.default.initialize());
  app2.use(import_passport2.default.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  const registeredStrategies = /* @__PURE__ */ new Set();
  const ensureStrategy = (domain) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new import_passport.Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`
        },
        verify
      );
      import_passport2.default.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };
  import_passport2.default.serializeUser((user, cb) => cb(null, user));
  import_passport2.default.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    import_passport2.default.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    import_passport2.default.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/replit_integrations/auth/routes.ts
function registerAuthRoutes(app2) {
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}

// server/storage.ts
init_schema();
var import_drizzle_orm4 = require("drizzle-orm");
var DatabaseStorage = class {
  // Products
  async getProducts() {
    return await db.select().from(products).orderBy(products.price);
  }
  async getProduct(id) {
    const [product] = await db.select().from(products).where((0, import_drizzle_orm4.eq)(products.id, id));
    return product;
  }
  async createProduct(product) {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  // Orders
  async createOrder(order) {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }
  async getOrders(userId) {
    const results = await db.query.orders.findMany({
      where: (0, import_drizzle_orm4.eq)(orders.userId, userId),
      with: {
        product: true,
        application: true
      },
      orderBy: (0, import_drizzle_orm4.desc)(orders.createdAt)
    });
    return results;
  }
  async getOrder(id) {
    const [order] = await db.select().from(orders).where((0, import_drizzle_orm4.eq)(orders.id, id));
    return order;
  }
  // LLC Applications
  async createLlcApplication(app2) {
    const [newApp] = await db.insert(llcApplications2).values(app2).returning();
    return newApp;
  }
  async getLlcApplication(id) {
    const [app2] = await db.select().from(llcApplications2).where((0, import_drizzle_orm4.eq)(llcApplications2.id, id));
    return app2;
  }
  async getLlcApplicationByOrderId(orderId) {
    const [app2] = await db.select().from(llcApplications2).where((0, import_drizzle_orm4.eq)(llcApplications2.orderId, orderId));
    return app2;
  }
  async getLlcApplicationByRequestCode(code) {
    const result = await db.query.llcApplications.findFirst({
      where: (0, import_drizzle_orm4.eq)(llcApplications2.requestCode, code),
      with: {
        documents: true
      }
    });
    return result;
  }
  async updateLlcApplication(id, updates) {
    const [updated] = await db.update(llcApplications2).set({ ...updates, lastUpdated: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm4.eq)(llcApplications2.id, id)).returning();
    return updated;
  }
  async setLlcApplicationOtp(id, otp, expires) {
    await db.update(llcApplications2).set({ emailOtp: otp, emailOtpExpires: expires }).where((0, import_drizzle_orm4.eq)(llcApplications2.id, id));
  }
  async verifyLlcApplicationOtp(id, otp) {
    const [app2] = await db.select().from(llcApplications2).where((0, import_drizzle_orm4.eq)(llcApplications2.id, id));
    if (!app2 || !app2.emailOtp || !app2.emailOtpExpires) return false;
    if (app2.emailOtp === otp && /* @__PURE__ */ new Date() < app2.emailOtpExpires) {
      await db.update(llcApplications2).set({ emailVerified: true, emailOtp: null, emailOtpExpires: null }).where((0, import_drizzle_orm4.eq)(llcApplications2.id, id));
      return true;
    }
    return false;
  }
  // Documents
  async createDocument(doc) {
    const [newDoc] = await db.insert(applicationDocuments).values(doc).returning();
    return newDoc;
  }
  async getDocumentsByApplicationId(applicationId) {
    return await db.select().from(applicationDocuments).where((0, import_drizzle_orm4.eq)(applicationDocuments.applicationId, applicationId));
  }
  async deleteDocument(id) {
    await db.delete(applicationDocuments).where((0, import_drizzle_orm4.eq)(applicationDocuments.id, id));
  }
  // Newsletter
  async subscribeToNewsletter(email) {
    const subscribed = await this.isSubscribedToNewsletter(email);
    if (!subscribed) {
      await db.insert(newsletterSubscribers).values({ email });
    }
  }
  async isSubscribedToNewsletter(email) {
    const [subscriber] = await db.select().from(newsletterSubscribers).where((0, import_drizzle_orm4.eq)(newsletterSubscribers.email, email));
    return !!subscriber;
  }
  // Admin methods
  async getAllOrders() {
    return await db.query.orders.findMany({
      with: {
        product: true,
        application: true,
        user: true
      },
      orderBy: (0, import_drizzle_orm4.desc)(orders.createdAt)
    });
  }
  async updateOrderStatus(orderId, status) {
    const [updated] = await db.update(orders).set({ status }).where((0, import_drizzle_orm4.eq)(orders.id, orderId)).returning();
    return updated;
  }
};
var storage = new DatabaseStorage();

// shared/routes.ts
var import_zod = require("zod");
init_schema();
var errorSchemas = {
  validation: import_zod.z.object({
    message: import_zod.z.string(),
    field: import_zod.z.string().optional()
  }),
  notFound: import_zod.z.object({
    message: import_zod.z.string()
  }),
  internal: import_zod.z.object({
    message: import_zod.z.string()
  }),
  unauthorized: import_zod.z.object({
    message: import_zod.z.string()
  })
};
var api = {
  products: {
    list: {
      method: "GET",
      path: "/api/products",
      responses: {
        200: import_zod.z.array(import_zod.z.custom())
      }
    },
    get: {
      method: "GET",
      path: "/api/products/:id",
      responses: {
        200: import_zod.z.custom(),
        404: errorSchemas.notFound
      }
    }
  },
  orders: {
    list: {
      method: "GET",
      path: "/api/orders",
      responses: {
        200: import_zod.z.array(import_zod.z.custom()),
        401: errorSchemas.unauthorized
      }
    },
    create: {
      method: "POST",
      path: "/api/orders",
      input: import_zod.z.object({
        productId: import_zod.z.number()
      }),
      responses: {
        201: import_zod.z.custom(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized
      }
    }
  },
  llc: {
    get: {
      method: "GET",
      path: "/api/llc/:id",
      responses: {
        200: import_zod.z.custom(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized
      }
    },
    update: {
      method: "PUT",
      path: "/api/llc/:id",
      input: insertLlcApplicationSchema.partial(),
      responses: {
        200: import_zod.z.custom(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound
      }
    },
    getByCode: {
      method: "GET",
      path: "/api/llc/code/:code",
      responses: {
        200: import_zod.z.custom(),
        404: errorSchemas.notFound
      }
    }
  },
  documents: {
    create: {
      method: "POST",
      path: "/api/documents",
      input: insertApplicationDocumentSchema,
      responses: {
        201: import_zod.z.custom(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound
      }
    },
    delete: {
      method: "DELETE",
      path: "/api/documents/:id",
      responses: {
        200: import_zod.z.object({ success: import_zod.z.boolean() }),
        404: errorSchemas.notFound
      }
    }
  }
};

// server/routes.ts
var import_zod2 = require("zod");

// server/lib/email.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
function getEmailHeader(title = "Easy US LLC") {
  const domain = "easyusllc.com";
  const protocol = "https";
  const logoUrl = `${protocol}://${domain}/logo-email.png?v=4`;
  return `
    <div style="background-color: #ffffff; padding: 40px 20px; text-align: center; border-bottom: 2px solid #6EDC8A;">
      <div style="margin-bottom: 20px; display: block; width: 100%; text-align: center;">
        <a href="https://${domain}" target="_blank" style="text-decoration: none; display: inline-block;">
          <img src="${logoUrl}" alt="Easy US LLC" width="100" height="100" style="display: inline-block; margin: 0 auto; width: 100px; height: 100px; object-fit: contain; border: 0;" />
        </a>
      </div>
      <h1 style="color: #0E1215; margin: 0; font-family: 'Inter', Arial, sans-serif; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; font-size: 24px; line-height: 1;">
        ${title}
      </h1>
    </div>
  `;
}
function getEmailFooter() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return `
    <div style="background-color: #0E1215; padding: 40px 20px; text-align: center; color: #F7F7F5; font-family: 'Inter', Arial, sans-serif;">
      <p style="margin: 0 0 15px 0; font-weight: 800; color: #6EDC8A; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Expertos en formaci\xF3n de LLC</p>
      <p style="margin: 0; font-size: 13px; color: #F7F7F5; font-weight: 500;">New Mexico, USA | <a href="mailto:info@easyusllc.com" style="color: #6EDC8A; text-decoration: none; font-weight: 700;">info@easyusllc.com</a></p>
      <div style="margin-top: 20px;">
        <a href="https://wa.me/34614916910" style="color: #F7F7F5; text-decoration: none; font-weight: 800; font-size: 11px; text-transform: uppercase; margin: 0 15px; border-bottom: 1px solid #6EDC8A;">WhatsApp</a>
        <a href="https://easyusllc.com" style="color: #F7F7F5; text-decoration: none; font-weight: 800; font-size: 11px; text-transform: uppercase; margin: 0 15px; border-bottom: 1px solid #6EDC8A;">Web Oficial</a>
      </div>
      <p style="margin-top: 30px; font-size: 10px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">\xA9 ${year} Easy US LLC. Todos los derechos reservados.</p>
    </div>
  `;
}
function getAutoReplyTemplate(ticketId, name = "Cliente") {
  return `
    <div style="background-color: #f9f9f9; padding: 20px 0;">
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden; color: #1a1a1a; background-color: #ffffff; border: 1px solid #e5e5e5;">
        ${getEmailHeader()}
        <div style="padding: 40px;">
          <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: #000;">Hemos recibido tu consulta</h2>
          <p style="line-height: 1.6; font-size: 15px; color: #444; margin-bottom: 25px;">Hola <strong>${name}</strong>, gracias por contactar con Easy US LLC. Tu consulta ha sido registrada correctamente con el identificador que ver\xE1s a continuaci\xF3n.</p>
          
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #6EDC8A; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Referencia de Seguimiento</p>
            <p style="margin: 0; font-size: 24px; font-weight: 900; color: #0E1215;">#${ticketId}</p>
          </div>

          <p style="line-height: 1.6; font-size: 15px; color: #444; margin-bottom: 20px;">Nuestro equipo de expertos revisar\xE1 tu mensaje y te responder\xE1 de forma personalizada en un plazo de <strong>24 a 48 horas h\xE1biles</strong>.</p>
          
          <p style="line-height: 1.6; font-size: 14px; color: #6B7280;">Si necesitas a\xF1adir informaci\xF3n adicional, simplemente responde a este correo manteniendo el asunto intacto.</p>
        </div>
        ${getEmailFooter()}
      </div>
    </div>
  `;
}
function getOtpEmailTemplate(otp) {
  return `
    <div style="background-color: #F7F7F5; padding: 20px 0;">
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden; color: #0E1215; background-color: #ffffff; border: 1px solid #E6E9EC;">
        ${getEmailHeader()}
        <div style="padding: 40px;">
          <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: #0E1215;">Verificaci\xF3n de Identidad</h2>
          <p style="line-height: 1.6; font-size: 15px; color: #0E1215; margin-bottom: 25px;">Verifica tu email con el siguiente c\xF3digo de seguridad:</p>
          
          <div style="background: #F7F7F5; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px solid #6EDC8A;">
            <p style="margin: 0; font-size: 32px; font-weight: 900; color: #0E1215; letter-spacing: 8px;">${otp}</p>
          </div>

          <p style="line-height: 1.6; font-size: 12px; color: #6B7280; margin-top: 20px;">Este c\xF3digo caducar\xE1 en 10 minutos.</p>
        </div>
        ${getEmailFooter()}
      </div>
    </div>
  `;
}
function getWelcomeEmailTemplate(name) {
  return `
    <div style="background-color: #f9f9f9; padding: 20px 0;">
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden; color: #1a1a1a; background-color: #ffffff; border: 1px solid #e5e5e5;">
        ${getEmailHeader()}
        <div style="padding: 40px;">
          <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: #000;">Bienvenido a Easy US LLC, ${name}</h2>
          <p style="line-height: 1.6; font-size: 15px; color: #444; margin-bottom: 20px;">Es un placer acompa\xF1arte en la expansi\xF3n de tu negocio hacia los Estados Unidos. Nuestra misi\xF3n es simplificar cada paso administrativo para que t\xFA puedas centrarte en crecer.</p>
          
          <div style="background: #fcfcfc; border-left: 3px solid #000; padding: 20px; margin: 25px 0;">
            <p style="margin: 0; font-size: 15px; font-weight: 700; color: #000;">\xBFQu\xE9 esperar ahora?</p>
            <ul style="margin: 15px 0 0 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.6;">
              <li style="margin-bottom: 8px;">Asignaci\xF3n de un agente especializado a tu expediente.</li>
              <li style="margin-bottom: 8px;">Revisi\xF3n de disponibilidad de nombres en el estado seleccionado.</li>
              <li style="margin-bottom: 8px;">Preparaci\xF3n de documentos constitutivos oficiales.</li>
            </ul>
          </div>

          <p style="line-height: 1.6; font-size: 14px; color: #666;">Recibir\xE1s actualizaciones peri\xF3dicas sobre el estado de tu formaci\xF3n. Si tienes cualquier consulta, nuestro equipo est\xE1 a tu disposici\xF3n v\xEDa WhatsApp o email.</p>
        </div>
        ${getEmailFooter()}
      </div>
    </div>
  `;
}
function getConfirmationEmailTemplate(name, requestCode, details) {
  const now = /* @__PURE__ */ new Date();
  const dateStr = now.toLocaleDateString("es-ES", { timeZone: "Europe/Madrid" });
  const timeStr = now.toLocaleTimeString("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit" });
  return `
    <div style="background-color: #f9f9f9; padding: 20px 0;">
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden; color: #1a1a1a; background-color: #ffffff; border: 1px solid #e5e5e5;">
        ${getEmailHeader()}
        <div style="padding: 40px;">
          <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: #000;">\xA1Gracias por tu solicitud, ${name}!</h2>
          <p style="line-height: 1.6; font-size: 15px; color: #444; margin-bottom: 25px;">Hemos recibido correctamente los datos para el registro de tu nueva LLC. Nuestro equipo de especialistas comenzar\xE1 con la revisi\xF3n t\xE9cnica de inmediato.</p>
          
          <div style="background: #fcfcfc; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #6EDC8A;">
            <p style="margin: 0 0 15px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6B7280; letter-spacing: 1px;">Referencia de Solicitud</p>
            <p style="margin: 0; font-size: 24px; font-weight: 900; color: #0E1215;">${requestCode}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; font-size: 13px; font-weight: 800; text-transform: uppercase; color: #000; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px;">Resumen del Registro</h3>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Fecha y hora:</td>
                <td style="padding: 8px 0; font-weight: 700; text-align: right;">${dateStr} | ${timeStr}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Nombre Propuesto:</td>
                <td style="padding: 8px 0; font-weight: 700; text-align: right;">${details?.companyName || "Pendiente"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Estado de Pago:</td>
                <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #0d9488;">Confirmado / Procesando</td>
              </tr>
            </table>
          </div>

          <div style="background: #FFF9E6; padding: 20px; border-radius: 8px; border: 1px solid #FFE4B3; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.6;"><strong>Pr\xF3ximos Pasos:</strong> En las pr\xF3ximas 24-48h recibir\xE1s un email con los documentos constitutivos para tu firma electr\xF3nica. Por favor, mantente atento a tu bandeja de entrada.</p>
          </div>

          <p style="line-height: 1.6; font-size: 14px; color: #666;">Si necesitas realizar cualquier cambio en los datos suministrados, por favor contacta con nosotros respondiendo a este correo.</p>
        </div>
        ${getEmailFooter()}
      </div>
    </div>
  `;
}
function getNewsletterWelcomeTemplate() {
  return `
    <div style="background-color: #f9f9f9; padding: 20px 0;">
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden; color: #1a1a1a; background-color: #ffffff; border: 1px solid #e5e5e5;">
        ${getEmailHeader()}
        <div style="padding: 40px;">
          <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: #000;">Suscripci\xF3n Confirmada</h2>
          <p style="line-height: 1.6; font-size: 15px; color: #444; margin-bottom: 25px;">Ya formas parte de la comunidad de Easy US LLC. A partir de ahora, recibir\xE1s informaci\xF3n estrat\xE9gica para optimizar tu negocio en EE.UU.</p>
          
          <div style="background: #fcfcfc; padding: 25px; border-radius: 8px; border: 1px solid #eee;">
            <p style="margin: 0 0 15px 0; font-weight: 800; font-size: 12px; text-transform: uppercase; color: #000;">Lo que vas a recibir:</p>
            <div style="margin-bottom: 15px;">
              <p style="margin: 0; font-weight: 700; font-size: 14px; color: #000;">Gu\xEDas de Cumplimiento</p>
              <p style="margin: 3px 0 0 0; font-size: 13px; color: #666;">Informaci\xF3n clave sobre BOI Reports y declaraciones anuales.</p>
            </div>
            <div style="margin-bottom: 15px;">
              <p style="margin: 0; font-weight: 700; font-size: 14px; color: #000;">Tips de Banca USA</p>
              <p style="margin: 3px 0 0 0; font-size: 13px; color: #666;">Novedades sobre Mercury, Relay y gesti\xF3n de fondos en USD.</p>
            </div>
            <div>
              <p style="margin: 0; font-weight: 700; font-size: 14px; color: #000;">Estrategia Fiscal</p>
              <p style="margin: 3px 0 0 0; font-size: 13px; color: #666;">C\xF3mo operar sin IVA y minimizar el impacto tributario legalmente.</p>
            </div>
          </div>

          <p style="line-height: 1.6; font-size: 14px; color: #666; margin-top: 25px; text-align: center;">Bienvenido al ecosistema global de emprendimiento.</p>
        </div>
        ${getEmailFooter()}
      </div>
    </div>
  `;
}
var transporter = import_nodemailer.default.createTransport({
  host: process.env.SMTP_HOST || "smtp.ionos.es",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100
});
async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("Email credentials missing. Email not sent.");
    return;
  }
  try {
    const info = await transporter.sendMail({
      from: `"Easy US LLC" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// server/routes.ts
init_schema();
var import_drizzle_orm5 = require("drizzle-orm");
async function registerRoutes(httpServer2, app2) {
  await setupAuth(app2);
  registerAuthRoutes(app2);
  const logActivity = (title, data) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[LOG] ${title}:`, data);
    }
    sendEmail({
      to: "afortuny07@gmail.com",
      subject: `[LOG] ${title}`,
      html: `
          <div style="background-color: #f9f9f9; padding: 20px 0;">
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden; color: #1a1a1a; background-color: #ffffff; border: 1px solid #e5e5e5;">
              ${getEmailHeader()}
              <div style="padding: 40px;">
                <h2 style="font-size: 18px; font-weight: 800; margin-bottom: 20px; color: #000;">${title}</h2>
                <div style="background: #f4f4f4; border-left: 4px solid #6EDC8A; padding: 20px; margin: 20px 0;">
                  ${Object.entries(data).map(([k, v]) => `<p style="margin: 0 0 10px 0; font-size: 14px;"><strong>${k}:</strong> ${v}</p>`).join("")}
                </div>
                <p style="font-size: 12px; color: #999;">Fecha: ${(/* @__PURE__ */ new Date()).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}</p>
              </div>
              ${getEmailFooter()}
            </div>
          </div>
        `
    }).catch((e) => console.error("Log error:", e));
  };
  app2.post("/api/activity/track", async (req, res) => {
    const { action, details } = req.body;
    if (action === "CLICK_ELEGIR_ESTADO") {
      logActivity("Selecci\xF3n de Estado", { "Detalles": details, "IP": req.ip });
    }
    res.json({ success: true });
  });
  app2.patch("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      const { firstName, lastName, phone, businessActivity } = req.body;
      const userId = req.user.claims.sub;
      await updateUserDetails(userId, { firstName, lastName, phone, businessActivity });
      res.json({ success: true });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  });
  app2.get(api.products.list.path, async (req, res) => {
    const products3 = await storage.getProducts();
    res.json(products3);
  });
  app2.delete("/api/user/account", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      await db.delete(users).where((0, import_drizzle_orm5.eq)(users.id, userId));
      res.json({ success: true, message: "Cuenta eliminada correctamente" });
    } catch (error) {
      console.error("Delete account error:", error);
      res.status(500).json({ message: "Error deleting account" });
    }
  });
  app2.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });
  app2.get(api.orders.list.path, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const orders3 = await storage.getOrders(req.user.id);
    res.json(orders3);
  });
  app2.post(api.orders.create.path, async (req, res) => {
    try {
      const { productId } = api.orders.create.input.parse(req.body);
      let userId;
      if (req.user?.id) {
        userId = req.user.id;
      } else {
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await db.insert(users).values({
          id: guestId,
          email: null,
          firstName: "Guest",
          lastName: "User"
        });
        userId = guestId;
      }
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(400).json({ message: "Invalid product" });
      }
      let finalPrice = product.price;
      if (product.name.includes("New Mexico")) finalPrice = 63900;
      else if (product.name.includes("Wyoming")) finalPrice = 79900;
      else if (product.name.includes("Delaware")) finalPrice = 99900;
      const order = await storage.createOrder({
        userId,
        productId,
        amount: finalPrice,
        status: "pending",
        stripeSessionId: "mock_session_" + Date.now()
      });
      const application = await storage.createLlcApplication({
        orderId: order.id,
        status: "draft",
        state: product.name.split(" ")[0]
        // Extract state name correctly
      });
      let statePrefix = "NM";
      if (product.name.includes("Wyoming")) statePrefix = "WY";
      else if (product.name.includes("Delaware")) statePrefix = "DE";
      else if (product.name.includes("Mantenimiento") || product.name.includes("Maintenance")) statePrefix = "MN";
      const timestamp3 = Date.now().toString();
      const randomPart = Math.random().toString(36).substring(7).toUpperCase();
      const requestCode = `${statePrefix}-${timestamp3.substring(timestamp3.length - 4)}-${randomPart.substring(0, 3)}-${Math.floor(Math.random() * 9)}`;
      const updatedApplication = await storage.updateLlcApplication(application.id, { requestCode });
      logActivity("Nuevo Pedido Recibido", {
        "Referencia": requestCode,
        "Producto": product.name,
        "Importe": `${(finalPrice / 100).toFixed(2)}\u20AC`,
        "Usuario": userId,
        "IP": req.ip
      });
      res.status(201).json({ ...order, application: updatedApplication });
      if (req.user?.email) {
        sendEmail({
          to: req.user.email,
          subject: "\xA1Bienvenido a Easy US LLC! - Pr\xF3ximos pasos",
          html: getWelcomeEmailTemplate(req.user.firstName || "Cliente")
        }).catch((err) => console.error("Error sending welcome email:", err));
      }
    } catch (err) {
      if (err instanceof import_zod2.z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error creating order:", err);
      return res.status(500).json({ message: "Error creating order" });
    }
  });
  app2.get("/api/messages", isAuthenticated, async (req, res) => {
    try {
      const userMessages = await db.select().from(messages).where((0, import_drizzle_orm5.eq)(messages.userId, req.user.claims.sub)).orderBy((0, import_drizzle_orm5.desc)(messages.createdAt));
      res.json(userMessages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });
  app2.post("/api/messages", async (req, res) => {
    try {
      const { name, email, subject, content, requestCode } = req.body;
      const userId = req.isAuthenticated() ? req.user.claims.sub : null;
      const [message] = await db.insert(messages).values({
        userId,
        name,
        email,
        subject,
        content,
        requestCode,
        type: "contact"
      }).returning();
      sendEmail({
        to: email,
        subject: `Recibimos tu mensaje: ${subject || "Contacto"}`,
        html: getAutoReplyTemplate(name || "Cliente")
      }).catch(console.error);
      logActivity("Nuevo Mensaje de Contacto", {
        "Nombre": name,
        "Email": email,
        "Asunto": subject,
        "Mensaje": content,
        "Referencia": requestCode || "N/A"
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Error sending message" });
    }
  });
  app2.patch("/api/llc/:id/data", isAuthenticated, async (req, res) => {
    try {
      const appId = Number(req.params.id);
      const updates = req.body;
      const [updated] = await db.update(llcApplications).set({ ...updates, lastUpdated: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm5.eq)(llcApplications.id, appId)).returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating request" });
    }
  });
  app2.get(api.llc.get.path, async (req, res) => {
    const appId = Number(req.params.id);
    const application = await storage.getLlcApplication(appId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  });
  app2.put(api.llc.update.path, async (req, res) => {
    try {
      const appId = Number(req.params.id);
      const updates = api.llc.update.input.parse(req.body);
      const application = await storage.getLlcApplication(appId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const updatedApp = await storage.updateLlcApplication(appId, updates);
      if (updates.status === "submitted" && updatedApp.ownerEmail) {
        const orderIdentifier = updatedApp.requestCode || `#${updatedApp.id}`;
        logActivity("Nueva Solicitud LLC", {
          "Referencia": orderIdentifier,
          "Estado Pago": "CONFIRMADO / COMPLETADO",
          "Propietario": updatedApp.ownerFullName,
          "DNI/Pasaporte": updatedApp.ownerIdNumber || "No proporcionado",
          "Email": updatedApp.ownerEmail,
          "Tel\xE9fono": updatedApp.ownerPhone,
          "Empresa": updatedApp.companyName,
          "Estado Registro": updatedApp.state,
          "Categor\xEDa": updatedApp.businessCategory === "Otra (especificar)" ? updatedApp.businessCategoryOther : updatedApp.businessCategory,
          "Notas": updatedApp.notes || "Ninguna"
        });
        sendEmail({
          to: updatedApp.ownerEmail,
          subject: `Confirmaci\xF3n de Solicitud ${orderIdentifier} - Easy US LLC`,
          html: getConfirmationEmailTemplate(updatedApp.ownerFullName || "Cliente", orderIdentifier, { companyName: updatedApp.companyName })
        }).catch((err) => console.error("Error sending confirmation email:", err));
      }
      res.json(updatedApp);
    } catch (err) {
      if (err instanceof import_zod2.z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });
  app2.get(api.llc.getByCode.path, async (req, res) => {
    const code = req.params.code;
    const application = await storage.getLlcApplicationByRequestCode(code);
    if (!application) {
      return res.status(404).json({ message: "Solicitud no encontrada. Verifica el c\xF3digo ingresado." });
    }
    res.json(application);
  });
  app2.post(api.documents.create.path, async (req, res) => {
    try {
      const docData = api.documents.create.input.parse(req.body);
      const application = await storage.getLlcApplication(docData.applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      const document = await storage.createDocument(docData);
      res.status(201).json(document);
    } catch (err) {
      if (err instanceof import_zod2.z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });
  app2.delete(api.documents.delete.path, async (req, res) => {
    const docId = Number(req.params.id);
    await storage.deleteDocument(docId);
    res.json({ success: true });
  });
  app2.post("/api/llc/:id/send-otp", async (req, res) => {
    try {
      const appId = Number(req.params.id);
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });
      const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1e3);
      await storage.setLlcApplicationOtp(appId, otp, expires);
      await sendEmail({
        to: email,
        subject: "C\xF3digo de verificaci\xF3n - Easy US LLC",
        html: getOtpEmailTemplate(otp)
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending LLC OTP:", error);
      res.status(500).json({ message: "Error al enviar el c\xF3digo de verificaci\xF3n" });
    }
  });
  app2.post("/api/llc/:id/verify-otp", async (req, res) => {
    const appId = Number(req.params.id);
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: "OTP is required" });
    const success = await storage.verifyLlcApplicationOtp(appId, otp);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ message: "C\xF3digo inv\xE1lido o caducado" });
    }
  });
  app2.post("/api/maintenance/orders", async (req, res) => {
    try {
      const { productId, state } = req.body;
      let userId;
      if (req.user?.id) {
        userId = req.user.id;
      } else {
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await db.insert(users).values({
          id: guestId,
          email: null,
          firstName: "Guest",
          lastName: "User"
        });
        userId = guestId;
      }
      const product = await storage.getProduct(productId);
      if (!product) return res.status(400).json({ message: "Invalid product" });
      const order = await storage.createOrder({
        userId,
        productId,
        amount: product.price,
        status: "pending",
        stripeSessionId: "mock_session_maint_" + Date.now()
      });
      const [application] = await db.insert(maintenanceApplications).values({
        orderId: order.id,
        status: "draft",
        state: state || product.name.split(" ")[0]
      }).returning();
      const timestamp3 = Date.now().toString();
      const randomPart = Math.random().toString(36).substring(7).toUpperCase();
      const requestCode = `MN-${timestamp3.substring(timestamp3.length - 4)}-${randomPart.substring(0, 3)}-${Math.floor(Math.random() * 9)}`;
      await db.update(maintenanceApplications).set({ requestCode }).where((0, import_drizzle_orm5.eq)(maintenanceApplications.id, application.id));
      res.status(201).json({ ...order, application: { ...application, requestCode } });
    } catch (err) {
      console.error("Error creating maintenance order:", err);
      res.status(500).json({ message: "Error creating maintenance order" });
    }
  });
  app2.put("/api/maintenance/:id", async (req, res) => {
    try {
      const appId = Number(req.params.id);
      const updates = req.body;
      const [updated] = await db.update(maintenanceApplications).set({ ...updates, lastUpdated: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm5.eq)(maintenanceApplications.id, appId)).returning();
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Error updating maintenance application" });
    }
  });
  app2.post("/api/maintenance/:id/send-otp", async (req, res) => {
    try {
      const appId = Number(req.params.id);
      const { email } = req.body;
      const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1e3);
      await db.update(maintenanceApplications).set({ emailOtp: otp, emailOtpExpires: expires }).where((0, import_drizzle_orm5.eq)(maintenanceApplications.id, appId));
      await sendEmail({ to: email, subject: "C\xF3digo de verificaci\xF3n", html: getOtpEmailTemplate(otp) });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  });
  app2.post("/api/maintenance/:id/verify-otp", async (req, res) => {
    const appId = Number(req.params.id);
    const { otp } = req.body;
    const [app3] = await db.select().from(maintenanceApplications).where((0, import_drizzle_orm5.eq)(maintenanceApplications.id, appId));
    if (app3 && app3.emailOtp === otp && /* @__PURE__ */ new Date() < (app3.emailOtpExpires || /* @__PURE__ */ new Date(0))) {
      await db.update(maintenanceApplications).set({ emailVerified: true }).where((0, import_drizzle_orm5.eq)(maintenanceApplications.id, appId));
      res.json({ success: true });
    } else {
      res.status(400).json({ message: "C\xF3digo inv\xE1lido" });
    }
  });
  app2.get("/api/newsletter/status", isAuthenticated, async (req, res) => {
    const isSubscribed = await storage.isSubscribedToNewsletter(req.user.email);
    res.json({ isSubscribed });
  });
  app2.post("/api/newsletter/unsubscribe", isAuthenticated, async (req, res) => {
    await db.delete(newsletterSubscribers).where((0, import_drizzle_orm5.eq)(newsletterSubscribers.email, req.user.email));
    res.json({ success: true });
  });
  app2.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = import_zod2.z.object({ email: import_zod2.z.string().email().optional() }).parse(req.body);
      const targetEmail = email || (req.isAuthenticated() ? req.user.email : null);
      if (!targetEmail) {
        return res.status(400).json({ message: "Se requiere un email" });
      }
      const isSubscribed = await storage.isSubscribedToNewsletter(targetEmail);
      if (isSubscribed) {
        return res.json({ success: true, message: "Ya est\xE1s suscrito" });
      }
      await storage.subscribeToNewsletter(targetEmail);
      await sendEmail({
        to: targetEmail,
        subject: "\xA1Bienvenido a la Newsletter de Easy US LLC!",
        html: getNewsletterWelcomeTemplate()
      }).catch((err) => console.error("Error sending newsletter welcome email:", err));
      res.json({ success: true });
    } catch (err) {
      if (err instanceof import_zod2.z.ZodError) {
        return res.status(400).json({ message: "Email inv\xE1lido" });
      }
      res.status(500).json({ message: "Error al suscribirse" });
    }
  });
  const isAdmin = async (req, res, next) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
  app2.get("/api/admin/messages", isAdmin, async (req, res) => {
    const messages2 = await db.select().from(messages).orderBy((0, import_drizzle_orm5.desc)(messages.createdAt));
    res.json(messages2);
  });
  app2.patch("/api/admin/messages/:id/status", isAdmin, async (req, res) => {
    const { status } = req.body;
    const [message] = await db.update(messages).set({ status }).where((0, import_drizzle_orm5.eq)(messages.id, Number(req.params.id))).returning();
    res.json(message);
  });
  app2.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users2 = await db.select().from(users);
      res.json(users2);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  });
  app2.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      await db.delete(users).where((0, import_drizzle_orm5.eq)(users.id, userId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error al eliminar usuario" });
    }
  });
  app2.patch("/api/admin/users/:id/password", isAdmin, async (req, res) => {
    const userId = req.params.id;
    res.json({ success: true, message: "Instrucciones de reinicio enviadas" });
  });
  app2.patch("/api/admin/orders/:id/status", isAdmin, async (req, res) => {
    const { status } = req.body;
    const order = await storage.updateOrderStatus(Number(req.params.id), status);
    const application = await storage.getLlcApplicationByOrderId(order.id);
    if (application && application.ownerEmail) {
      sendEmail({
        to: application.ownerEmail,
        subject: `Actualizaci\xF3n de pedido ${application.requestCode || `#${order.id}`} - Easy US LLC`,
        html: `
          <div style="background-color: #f9f9f9; padding: 20px 0;">
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden; color: #1a1a1a; background-color: #ffffff; border: 1px solid #e5e5e5;">
              ${getEmailHeader("Actualizaci\xF3n de Estado")}
              <div style="padding: 40px;">
                <h2 style="font-size: 18px; font-weight: 800; margin-bottom: 20px; color: #000;">Tu pedido ha cambiado de estado</h2>
                <p style="line-height: 1.6; font-size: 15px; color: #444;">Tu solicitud <strong>${application.requestCode || `#${order.id}`}</strong> ahora se encuentra en estado: <strong style="text-transform: uppercase;">${status}</strong>.</p>
                <div style="margin-top: 30px; text-align: center;">
                  <a href="https://easyusllc.com/dashboard" style="background-color: #6EDC8A; color: #000; padding: 12px 25px; text-decoration: none; border-radius: 100px; font-weight: 900; font-size: 13px; text-transform: uppercase;">Ir a mi panel \u2192</a>
                </div>
              </div>
              ${getEmailFooter()}
            </div>
          </div>
        `
      }).catch((e) => console.error("Update email error:", e));
    }
    res.json(order);
  });
  app2.get("/api/admin/invoice/:id", isAdmin, async (req, res) => {
    const orderId = Number(req.params.id);
    const order = await storage.getOrder(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.setHeader("Content-Type", "text/html");
    res.send(generateInvoiceHtml(order));
  });
  app2.get("/api/orders/:id/invoice", isAuthenticated, async (req, res) => {
    const orderId = Number(req.params.id);
    const order = await storage.getOrder(orderId);
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
    if (order.userId !== req.user.claims.sub && !req.user.isAdmin) {
      return res.status(403).json({ message: "No tienes permiso para ver esta factura" });
    }
    res.setHeader("Content-Type", "text/html");
    res.send(generateInvoiceHtml(order));
  });
  app2.get("/api/orders/:id/receipt", isAuthenticated, async (req, res) => {
    const orderId = Number(req.params.id);
    const order = await storage.getOrder(orderId);
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
    if (order.userId !== req.user.claims.sub && !req.user.isAdmin) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    res.setHeader("Content-Type", "text/html");
    res.send(generateReceiptHtml(order));
  });
  function generateInvoiceHtml(order) {
    return `
      <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
            .header { border-bottom: 4px solid #6EDC8A; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
            .invoice-title { font-size: 32px; font-weight: 900; text-transform: uppercase; tracking-tighter; margin: 0; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-bottom: 60px; }
            .section-title { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #6EDC8A; margin-bottom: 10px; tracking-widest; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .table th { text-align: left; border-bottom: 2px solid #f0f0f0; padding: 15px 10px; font-size: 11px; text-transform: uppercase; font-weight: 900; }
            .table td { padding: 20px 10px; border-bottom: 1px solid #f9f9f9; font-size: 14px; font-weight: 500; }
            .total-box { background: #f9f9f9; padding: 30px; border-radius: 20px; text-align: right; margin-left: auto; width: fit-content; min-width: 250px; }
            .total-label { font-size: 12px; font-weight: 900; text-transform: uppercase; color: #666; }
            .total-amount { font-size: 28px; font-weight: 900; color: #000; }
            .footer { margin-top: 80px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="invoice-title">Factura Oficial</h1>
              <p style="margin: 5px 0 0 0; font-weight: 700;">Ref: INV-${order.id}-${new Date(order.createdAt).getFullYear()}</p>
            </div>
            <div style="text-align: right">
              <p style="margin: 0; font-weight: 800;">Easy US LLC</p>
              <p style="margin: 0; font-size: 13px; color: #666;">Fecha: ${new Date(order.createdAt).toLocaleDateString("es-ES")}</p>
            </div>
          </div>
          <div class="details">
            <div>
              <div class="section-title">Emisor</div>
              <p style="margin: 0;"><strong>Fortuny Consulting LLC</strong></p>
              <p style="margin: 0; font-size: 14px;">EIN: 98-1906730</p>
              <p style="margin: 0; font-size: 14px;">USA / Espa\xF1a</p>
            </div>
            <div>
              <div class="section-title">Cliente</div>
              <p style="margin: 0;"><strong>ID Usuario: #${order.userId}</strong></p>
              <p style="margin: 0; font-size: 14px;">Servicios de Constituci\xF3n / Mantenimiento</p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr><th>Descripci\xF3n del Servicio</th><th style="text-align: right">Precio Unitario</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Constituci\xF3n de Empresa LLC / Mantenimiento Anual</td>
                <td style="text-align: right">${(order.amount / 100).toFixed(2)}\u20AC</td>
              </tr>
            </tbody>
          </table>
          <div class="total-box">
            <div class="total-label">Total Facturado (EUR)</div>
            <div class="total-amount">${(order.amount / 100).toFixed(2)}\u20AC</div>
          </div>
          <div class="footer">
            Easy US LLC \u2022 Gracias por confiar en nosotros para expandir tu negocio a USA.
          </div>
        </body>
      </html>
    `;
  }
  function generateReceiptHtml(order) {
    return `
      <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; background: #fcfcfc; }
            .card { background: white; max-width: 600px; margin: auto; padding: 50px; border-radius: 40px; shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #eee; }
            .logo { width: 60px; margin-bottom: 30px; }
            .status { display: inline-block; background: #6EDC8A; color: #000; padding: 6px 15px; border-radius: 100px; font-size: 10px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px; }
            h1 { font-size: 28px; font-weight: 900; margin: 0 0 10px 0; tracking: -0.03em; }
            .msg { color: #666; margin-bottom: 40px; }
            .info-row { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f5f5f5; font-size: 14px; }
            .label { font-weight: 800; color: #999; text-transform: uppercase; font-size: 11px; }
            .val { font-weight: 700; color: #000; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="status">Recibo de Solicitud</div>
            <h1>Confirmaci\xF3n de Pedido</h1>
            <p class="msg">Hemos recibido correctamente tu solicitud. Tu proceso de constituci\xF3n est\xE1 en marcha.</p>
            
            <div class="info-row">
              <span class="label">Referencia del Pedido</span>
              <span class="val">#${order.id}</span>
            </div>
            <div class="info-row">
              <span class="label">Fecha</span>
              <span class="val">${new Date(order.createdAt).toLocaleDateString("es-ES")}</span>
            </div>
            <div class="info-row">
              <span class="label">Estado del Pago</span>
              <span class="val">${order.status === "paid" ? "PAGADO" : "PENDIENTE"}</span>
            </div>
            <div class="info-row" style="border-bottom: 0;">
              <span class="label">Total Importe</span>
              <span class="val" style="font-size: 20px; color: #6EDC8A;">${(order.amount / 100).toFixed(2)}\u20AC</span>
            </div>
            
            <div class="footer">
              Conserva este recibo para tus registros.<br/>
              Easy US LLC \u2022 Fortuny Consulting LLC
            </div>
          </div>
        </body>
      </html>
    `;
  }
  app2.post("/api/contact/send-otp", async (req, res) => {
    try {
      const { email } = import_zod2.z.object({ email: import_zod2.z.string().email() }).parse(req.body);
      const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
      await db.insert(contactOtps).values({
        email,
        otp,
        expiresAt
      });
      await sendEmail({
        to: email,
        subject: "C\xF3digo de verificaci\xF3n - Easy US LLC",
        html: getOtpEmailTemplate(otp)
      });
      res.json({ success: true });
    } catch (err) {
      console.error("Error sending contact OTP:", err);
      res.status(400).json({ message: "Error al enviar el c\xF3digo de verificaci\xF3n. Por favor, int\xE9ntalo de nuevo en unos minutos." });
    }
  });
  app2.post("/api/contact/verify-otp", async (req, res) => {
    try {
      const { email, otp } = import_zod2.z.object({ email: import_zod2.z.string().email(), otp: import_zod2.z.string() }).parse(req.body);
      const [record] = await db.select().from(contactOtps).where(
        (0, import_drizzle_orm5.and)(
          (0, import_drizzle_orm5.eq)(contactOtps.email, email),
          (0, import_drizzle_orm5.eq)(contactOtps.otp, otp),
          (0, import_drizzle_orm5.gt)(contactOtps.expiresAt, /* @__PURE__ */ new Date())
        )
      ).limit(1);
      if (!record) {
        return res.status(400).json({ message: "C\xF3digo inv\xE1lido o caducado" });
      }
      await db.update(contactOtps).set({ verified: true }).where((0, import_drizzle_orm5.eq)(contactOtps.id, record.id));
      res.json({ success: true });
    } catch (err) {
      console.error("Error verifying contact OTP:", err);
      res.status(400).json({ message: "Error al verificar el c\xF3digo" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const contactData = import_zod2.z.object({
        nombre: import_zod2.z.string(),
        apellido: import_zod2.z.string(),
        email: import_zod2.z.string().email(),
        telefono: import_zod2.z.string().optional(),
        subject: import_zod2.z.string(),
        mensaje: import_zod2.z.string(),
        otp: import_zod2.z.string()
      }).parse(req.body);
      const [otpRecord] = await db.select().from(contactOtps).where(
        (0, import_drizzle_orm5.and)(
          (0, import_drizzle_orm5.eq)(contactOtps.email, contactData.email),
          (0, import_drizzle_orm5.eq)(contactOtps.otp, contactData.otp),
          (0, import_drizzle_orm5.eq)(contactOtps.verified, true)
        )
      ).limit(1);
      if (!otpRecord) {
        return res.status(400).json({ message: "Email no verificado" });
      }
      const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const ticketId = Math.floor(1e7 + Math.random() * 9e7).toString();
      logActivity("Acci\xF3n Contacto", {
        "ID Ticket": `#${ticketId}`,
        "Nombre": `${contactData.nombre} ${contactData.apellido}`,
        "Email": contactData.email,
        "Tel\xE9fono": contactData.telefono || "No proporcionado",
        "Asunto": contactData.subject,
        "Mensaje": contactData.mensaje,
        "IP": clientIp
      });
      await sendEmail({
        to: contactData.email,
        subject: `Confirmaci\xF3n de mensaje - Easy US LLC #${ticketId}`,
        html: getAutoReplyTemplate(ticketId, contactData.nombre)
      });
      res.json({ success: true, ticketId });
    } catch (err) {
      console.error("Error processing contact form:", err);
      res.status(400).json({ message: "Error al procesar el mensaje" });
    }
  });
  app2.post("/api/maintenance/orders", async (req, res) => {
    try {
      const { productId, state } = req.body;
      let userId;
      if (req.user?.id) {
        userId = req.user.id;
      } else {
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await db.insert(users).values({
          id: guestId,
          email: null,
          firstName: "Guest",
          lastName: "User"
        });
        userId = guestId;
      }
      const product = await storage.getProduct(productId);
      if (!product) return res.status(400).json({ message: "Invalid product" });
      let finalPrice = product.price;
      if (state?.includes("New Mexico")) finalPrice = 34900;
      else if (state?.includes("Wyoming")) finalPrice = 49900;
      else if (state?.includes("Delaware")) finalPrice = 59900;
      const order = await storage.createOrder({
        userId,
        productId,
        amount: finalPrice,
        status: "pending",
        stripeSessionId: "mock_maintenance_" + Date.now()
      });
      const maintenanceResults = await db.insert(maintenanceApplications).values({
        orderId: order.id,
        status: "draft",
        state: state || "New Mexico"
      }).returning();
      const application = maintenanceResults[0];
      res.status(201).json({ ...order, application });
    } catch (err) {
      console.error("Error creating maintenance order:", err);
      res.status(500).json({ message: "Error" });
    }
  });
  app2.post("/api/maintenance/:id/send-otp", async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1e3);
    await db.update(maintenanceApplications).set({ emailOtp: otp, emailOtpExpires: expires }).where((0, import_drizzle_orm5.eq)(maintenanceApplications.id, Number(req.params.id)));
    await sendEmail({
      to: email,
      subject: "C\xF3digo de verificaci\xF3n - Easy US LLC",
      html: getOtpEmailTemplate(otp)
    });
    res.json({ success: true });
  });
  app2.post("/api/maintenance/:id/verify-otp", async (req, res) => {
    const appId = Number(req.params.id);
    const { otp } = req.body;
    const [app3] = await db.select().from(maintenanceApplications).where((0, import_drizzle_orm5.and)(
      (0, import_drizzle_orm5.eq)(maintenanceApplications.id, appId),
      (0, import_drizzle_orm5.eq)(maintenanceApplications.emailOtp, otp),
      (0, import_drizzle_orm5.gt)(maintenanceApplications.emailOtpExpires, /* @__PURE__ */ new Date())
    ));
    if (app3) {
      await db.update((init_schema(), __toCommonJS(schema_exports)).maintenanceApplications).set({ emailVerified: true }).where((0, import_drizzle_orm5.eq)((init_schema(), __toCommonJS(schema_exports)).maintenanceApplications.id, appId));
      res.json({ success: true });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  });
  app2.put("/api/maintenance/:id", async (req, res) => {
    const appId = Number(req.params.id);
    const updates = req.body;
    const [updatedApp] = await db.update(maintenanceApplications).set({ ...updates, lastUpdated: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm5.eq)(maintenanceApplications.id, appId)).returning();
    if (updates.status === "submitted") {
      logActivity("Nueva Solicitud Mantenimiento", {
        "Propietario": updatedApp.ownerFullName,
        "LLC": updatedApp.companyName,
        "EIN": updatedApp.ein,
        "Estado": updatedApp.state,
        "Email": updatedApp.ownerEmail,
        "Disolver": updatedApp.wantsDissolve || "No",
        "Servicios": updatedApp.expectedServices
      });
    }
    res.json(updatedApp);
  });
  await seedDatabase();
  app2.post("/api/admin/test-emails", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    try {
      const ticketId = "12345678";
      const otp = "888999";
      const name = "Cliente de Prueba";
      const requestCode = "NM-9999-ABC-0";
      const activityHtml = `
        <div style="background-color: #f9f9f9; padding: 20px 0;">
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden; color: #1a1a1a; background-color: #ffffff; border: 1px solid #e5e5e5;">
            ${getEmailHeader()}
            <div style="padding: 40px;">
              <h2 style="font-size: 18px; font-weight: 800; margin-bottom: 20px; color: #000;">Log de Actividad: Selecci\xF3n de Estado</h2>
              <div style="background: #f4f4f4; border-left: 4px solid #000; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>Acci\xF3n:</strong> Clic en bot\xF3n elegir</p>
                <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>Estado:</strong> New Mexico Pack</p>
          <p style="margin: 0; font-size: 14px;"><strong>Precio:</strong> 639\u20AC</p>
        </div>
        <p style="font-size: 12px; color: #999;">IP Origen: 127.0.0.1 | Fecha: ${(/* @__PURE__ */ new Date()).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}</p>
      </div>
      ${getEmailFooter()}
    </div>
  </div>
`;
      app2.post("/api/activity/track", async (req2, res2) => {
        const { action, details } = req2.body;
        if (action === "CLICK_ELEGIR_ESTADO") {
          let price = "639\u20AC";
          if (details.includes("Wyoming")) price = "799\u20AC";
          if (details.includes("Delaware")) price = "999\u20AC";
          logActivity("Selecci\xF3n de Estado", {
            "Pack": details,
            "Precio Base": price,
            "IP": req2.ip
          });
        }
        res2.json({ success: true });
      });
      const orderHtml = `
  <div style="background-color: #f9f9f9; padding: 20px 0;">
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; overflow: hidden; color: #1a1a1a; background-color: #ffffff; border: 1px solid #e5e5e5;">
      ${getEmailHeader()}
      <div style="padding: 40px;">
        <h2 style="font-size: 18px; font-weight: 800; margin-bottom: 20px; color: #000;">Detalles de la Notificaci\xF3n</h2>
        <div style="margin-bottom: 25px;">
          <h3 style="font-size: 11px; text-transform: uppercase; color: #999; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; font-weight: 800;">Estado de la Transacci\xF3n</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Estado Pago:</strong> <span style="color: #0d9488; font-weight: 700;">CONFIRMADO (MOCK)</span></p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Fecha/Hora:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Aceptaci\xF3n T\xE9rminos:</strong> S\xCD (Marcado en formulario)</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="font-size: 11px; text-transform: uppercase; color: #999; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; font-weight: 800;">Informaci\xF3n del Propietario</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Nombre:</strong> ${name}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>DNI / Pasaporte:</strong> 12345678X (Test)</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Direcci\xF3n:</strong> Calle Falsa 123, 28001 Madrid, Espa\xF1a</p>
        </div>

        <div>
          <h3 style="font-size: 11px; text-transform: uppercase; color: #999; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; font-weight: 800;">Detalles de la Empresa</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Nombre LLC:</strong> Mi Nueva Empresa LLC</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Estado:</strong> New Mexico</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Actividad:</strong> Consultor\xEDa de Software y Marketing Digital</p>
          <p style="margin: 0; font-size: 14px;"><strong>Notas:</strong> Necesito el EIN urgente para abrir cuenta en Mercury.</p>
        </div>
      </div>
      ${getEmailFooter()}
    </div>
  </div>
`;
      await Promise.all([
        sendEmail({ to: email, subject: "TEST: OTP Verificaci\xF3n de Identidad", html: getOtpEmailTemplate(otp) }),
        sendEmail({ to: email, subject: "TEST: Log de Actividad (Admin)", html: activityHtml }),
        sendEmail({ to: email, subject: "TEST: Nueva Solicitud LLC (Admin)", html: orderHtml }),
        sendEmail({ to: email, subject: "TEST: Confirmaci\xF3n de Pedido (Cliente)", html: getConfirmationEmailTemplate(name, requestCode, { companyName: "Mi Nueva Empresa LLC" }) }),
        sendEmail({ to: email, subject: "TEST: Bienvenido a Easy US LLC", html: getWelcomeEmailTemplate(name) }),
        sendEmail({ to: email, subject: "TEST: Newsletter Bienvenida", html: getNewsletterWelcomeTemplate() }),
        sendEmail({ to: email, subject: "TEST: Confirmaci\xF3n de Mensaje (Auto-reply)", html: getAutoReplyTemplate(ticketId, name) }),
        sendEmail({ to: email, subject: "TEST: OTP Mensaje de Contacto", html: getOtpEmailTemplate(otp) })
      ]);
      res.json({ success: true, message: "Emails de prueba administrativos mejorados enviados" });
    } catch (error) {
      console.error("Error sending test emails:", error);
      res.status(500).json({ message: "Error al enviar emails de prueba" });
    }
  });
  return httpServer2;
}
async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    await storage.createProduct({
      name: "New Mexico LLC",
      description: "Constituci\xF3n r\xE1pida en el estado m\xE1s eficiente. Ideal para bajo coste de mantenimiento.",
      price: 63900,
      features: [
        "Tasas del estado pagadas",
        "Registered Agent (12 meses)",
        "Articles of Organization oficiales",
        "Operating Agreement profesional",
        "EIN del IRS",
        "BOI Report presentado",
        "Declaraciones fiscales a\xF1o 1",
        "Soporte completo 12 meses"
      ]
    });
    await storage.createProduct({
      name: "Wyoming LLC",
      description: "Constituci\xF3n premium en el estado m\xE1s prestigioso de USA. M\xE1xima privacidad y protecci\xF3n.",
      price: 79900,
      features: [
        "Tasas del estado pagadas",
        "Registered Agent (12 meses)",
        "EIN del IRS garantizado",
        "Articles of Organization oficiales",
        "Operating Agreement profesional",
        "BOI Report presentado",
        "Annual Report a\xF1o 1",
        "Declaraciones fiscales a\xF1o 1",
        "Soporte completo 12 meses"
      ]
    });
    await storage.createProduct({
      name: "Delaware LLC",
      description: "El est\xE1ndar para startups y empresas tecnol\xF3gicas. Reconocimiento legal global.",
      price: 99900,
      features: [
        "Tasas del estado pagadas",
        "Registered Agent (12 meses)",
        "Articles of Organization oficiales",
        "Operating Agreement profesional",
        "EIN del IRS",
        "BOI Report presentado",
        "Declaraciones fiscales a\xF1o 1",
        "Soporte completo 12 meses"
      ]
    });
  }
}

// server/static.ts
var import_express = __toESM(require("express"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
function serveStatic(app2) {
  const distPath = import_path.default.resolve(__dirname, "public");
  if (!import_fs.default.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(import_express.default.static(distPath, {
    maxAge: "1y",
    immutable: true,
    index: false,
    etag: true,
    lastModified: true
  }));
  app2.use("*", (_req, res) => {
    res.sendFile(import_path.default.resolve(distPath, "index.html"), {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  });
}

// server/index.ts
var import_http = require("http");
var import_compression = __toESM(require("compression"), 1);
var app = (0, import_express2.default)();
var httpServer = (0, import_http.createServer)(app);
app.use((0, import_compression.default)());
app.use(import_express2.default.json());
app.use(import_express2.default.urlencoded({ extended: false }));
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  if (req.method === "GET") {
    const isAsset = req.path.startsWith("/assets/") || req.path.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|css|js|woff2|woff)$/);
    if (isAsset) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  }
  next();
});
(async () => {
  await registerRoutes(httpServer, app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite: setupVite2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
    await setupVite2(httpServer, app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  log
});
//# sourceMappingURL=index.cjs.map
