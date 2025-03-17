const fastifyPlugin = require("fastify-plugin");
const {
  addUser,
  fetchUsers,
  editUser,
  fetchUserById,
  fetchMedicalHistory,
  addMedicalHistoryEntry,
  removeMedicalHistoryEntry,
} = require("../controllers/userController");

async function userRoutes(fastify, options) {
  try {
    // Register user routes under "/api/users" prefix
    fastify.register(
      async function (userGroup) {
        // Create a user
        userGroup.post(
          "/",
          {
            schema: {
              body: {
                type: "object",
                required: ["name", "email"],
                properties: {
                  name: { type: "string", minLength: 1 },
                  email: { type: "string", format: "email" },
                  age: { type: "number", minimum: 0 },
                  gender: { type: "string", enum: ["Male", "Female", "Other"] },
                },
              },
            },
          },
          addUser
        );

        // Get all users
        userGroup.get("/", fetchUsers);

        // Update user profile
        userGroup.put(
          "/:id",
          {
            schema: {
              params: {
                type: "object",
                properties: {
                  id: { type: "string", minLength: 24, maxLength: 24 }, // MongoDB ObjectId validation
                },
              },
              body: {
                type: "object",
                properties: {
                  name: { type: "string", minLength: 1 },
                  age: { type: "number", minimum: 0 },
                  gender: { type: "string", enum: ["Male", "Female", "Other"] },
                },
              },
            },
          },
          editUser
        );

        //  Get user by ID
        userGroup.get(
          "/:id",
          {
            schema: {
              params: {
                type: "object",
                properties: {
                  id: { type: "string", minLength: 24, maxLength: 24 },
                },
              },
            },
          },
          fetchUserById
        );

        // Medical History Routes

        //  Get user's medical history
        userGroup.get(
          "/:id/medical-history",
          {
            schema: {
              params: {
                type: "object",
                properties: {
                  id: { type: "string", minLength: 24, maxLength: 24 },
                },
              },
            },
          },
          fetchMedicalHistory
        );

        //  Add new medical history entry
        userGroup.post(
          "/:id/medical-history",
          {
            schema: {
              params: {
                type: "object",
                properties: {
                  id: { type: "string", minLength: 24, maxLength: 24 },
                },
              },
              body: {
                type: "object",
                required: ["condition", "description"],
                properties: {
                  condition: { type: "string", minLength: 3 },
                  description: { type: "string", minLength: 5 },
                },
              },
            },
          },
          addMedicalHistoryEntry
        );

        //  Delete a medical history entry
        userGroup.delete(
          "/:id/medical-history/:historyId",
          {
            schema: {
              params: {
                type: "object",
                properties: {
                  id: { type: "string", minLength: 24, maxLength: 24 },
                  historyId: { type: "string", minLength: 24, maxLength: 24 },
                },
              },
            },
          },
          removeMedicalHistoryEntry
        );

        userGroup.delete("/:id", async (req, reply) => {
          reply.code(501).send({ success: false, message: "Not implemented" });
        });
      },
      { prefix: "/api/users" }
    );
  } catch (error) {
    console.error("Error in userRoutes plugin:", error);
    throw error;
  }
}

module.exports = fastifyPlugin(userRoutes);
