require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const { connectDB } = require("./config/db");

// Security & Performance Plugins
fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
fastify.register(require("@fastify/helmet"));
fastify.register(require("@fastify/rate-limit"), {
  max: 100,
  timeWindow: "1 minute",
});

connectDB();

// Register Routes
fastify.register(require("./routes/authRoutes"));

fastify.listen({ port: 5000 }, (err, address) => {
  if (err) {
    console.error("Server Start Error:", err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
