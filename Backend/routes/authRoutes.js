const fastifyPlugin = require("fastify-plugin");
const { googleAuth } = require("../controllers/authController");

async function authRoutes(fastify, options) {
  fastify.register(
    async (authGroup) => {
      authGroup.post(
        "/google",
        {
          schema: {
            body: {
              type: "object",
              required: ["token"],
              properties: {
                token: { type: "string" },
              },
            },
          },
        },
        googleAuth
      );

      authGroup.post("/login", async (req, reply) => {
        reply.code(501).send({ success: false, message: "Not implemented" });
      });
    },
    { prefix: "/api/auth" }
  );
}

module.exports = fastifyPlugin(authRoutes);
