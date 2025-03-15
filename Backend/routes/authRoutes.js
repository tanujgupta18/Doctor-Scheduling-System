const fastifyPlugin = require("fastify-plugin");
const { googleAuth } = require("../controllers/authController");

async function authRoutes(fastify, options) {
  fastify.post("/auth/google", googleAuth);
}

module.exports = fastifyPlugin(authRoutes);
