const fastifyPlugin = require("fastify-plugin");
const { googleAuth } = require("../controllers/authController");

async function authRoutes(fastify, options) {
  try {
    // Set base prefix for all auth routes
    fastify.register(
      async function (authGroup) {
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
  } catch (error) {
    console.error("Error in authRoutes plugin:", error);
    throw error;
  }
}

module.exports = fastifyPlugin(authRoutes);
