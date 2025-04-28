const fastifyPlugin = require("fastify-plugin");
const {
  createDoctor,
  updateDoctor,
  fetchDoctorProfile,
  fetchDoctorUsers,
  getDoctorAvailableSlots,
} = require("../controllers/doctorController");

async function doctorRoutes(fastify, options) {
  fastify.register(
    async function (doctorGroup) {
      doctorGroup.post("/", createDoctor);
      doctorGroup.put("/:id", updateDoctor);
      doctorGroup.get("/:id", fetchDoctorProfile);
      doctorGroup.get("/:id/users", fetchDoctorUsers);
      doctorGroup.get("/:id/slots", getDoctorAvailableSlots);
    },
    { prefix: "/api/doctors" }
  );
}

module.exports = fastifyPlugin(doctorRoutes);
