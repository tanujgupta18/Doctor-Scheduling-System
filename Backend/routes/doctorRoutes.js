const fastifyPlugin = require("fastify-plugin");
const {
  createDoctor,
  updateDoctor,
  fetchDoctorProfile,
} = require("../controllers/doctorController");

async function doctorRoutes(fastify, options) {
  fastify.register(
    async function (doctorGroup) {
      doctorGroup.post("/", createDoctor);
      doctorGroup.put("/:id", updateDoctor);
      doctorGroup.get("/:id", fetchDoctorProfile);
    },
    { prefix: "/api/doctors" }
  );
}

module.exports = fastifyPlugin(doctorRoutes);
