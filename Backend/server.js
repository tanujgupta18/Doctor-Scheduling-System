require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

// Register Cookie Plugin
fastify.register(require("@fastify/cookie"), {
  secret: process.env.COOKIE_SECRET || "mysecret",
  parseOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

// Security & Performance Plugins
fastify.register(require("@fastify/cors"), {
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

fastify.register(require("@fastify/helmet"), {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
});

fastify.register(require("@fastify/rate-limit"), {
  max: 100,
  timeWindow: "1 minute",
});

const shutdown = async () => {
  console.log("Shutting down server...");
  await fastify.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

(async () => {
  try {
    // Wait for database connection before starting the server
    await connectDB();

    // Register Routes
    fastify.register(require("./routes/authRoutes"));
    fastify.register(require("./routes/userRoutes"), { prefix: "/api" });

    // Start Server
    fastify.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        console.error("Server Start Error:", err);
        process.exit(1);
      }
      console.log(`Server running at ${address}`);
    });
  } catch (error) {
    console.error("Fatal Error:", error);
    process.exit(1);
  }
})();
