const {
  createDoctorProfile,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorUsers,
  validateAvailability,
} = require("../models/doctorModel");

const { getDB } = require("../config/db");
const { generateAvailableSlots } = require("../utils/slotGenerator");

// Creating a new doctor profile
async function createDoctor(req, reply) {
  try {
    const doctorData = req.body;

    validateAvailability(doctorData.availability);

    // Create the doctor profile in the database
    const result = await createDoctorProfile(doctorData);
    reply.send({
      success: true,
      message: "Doctor profile created",
      doctorId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
}

// Updating an existing doctor profile
async function updateDoctor(req, reply) {
  const doctorId = req.params.id;
  const updatedData = req.body;

  // console.log("Update request received for doctor ID:", doctorId);
  // console.log("Data to update:", updatedData);

  try {
    if (updatedData.availability) {
      validateAvailability(updatedData.availability);
    }

    const result = await updateDoctorProfile(doctorId, updatedData);
    console.log("🛠 Mongo update result:", result);

    if (result.modifiedCount === 0) {
      console.warn("No document matched or modified!");
      return reply
        .status(404)
        .send({ error: "Doctor not found or no changes made" });
    }

    reply.send({ success: true, message: "Doctor profile updated" });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
}

// Fetch a doctor's profile
async function fetchDoctorProfile(req, reply) {
  const doctorId = req.params.id;

  try {
    const doctor = await getDoctorProfile(doctorId);
    if (!doctor) {
      return reply.status(404).send({ error: "Doctor not found" });
    }
    reply.send({ success: true, doctor });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
}

// Fetching users assigned to a doctor
async function fetchDoctorUsers(req, reply) {
  const doctorId = req.params.id;

  try {
    const users = await getDoctorUsers(doctorId);
    reply.send({ success: true, users });
  } catch (error) {
    console.error("Error fetching users for doctor:", error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
}

// Get available slots for a doctor
async function getDoctorAvailableSlots(req, reply) {
  try {
    const doctorId = req.params.id;
    const db = getDB();

    const doctor = await getDoctorProfile(doctorId);
    if (!doctor) return reply.code(404).send({ error: "Doctor not found" });

    const appointments = await db
      .collection("appointments")
      .find({ doctorId: doctor._id, status: { $ne: "Cancelled" } })
      .toArray();

    const slots = generateAvailableSlots(doctor, appointments);
    reply.send({ success: true, slots });
  } catch (err) {
    console.error("Slot generation failed:", err);
    reply.code(500).send({ error: "Failed to generate slots" });
  }
}

module.exports = {
  createDoctor,
  updateDoctor,
  fetchDoctorProfile,
  fetchDoctorUsers,
  getDoctorAvailableSlots,
};
