const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// Create Doctor Profile
async function createDoctorProfile(doctorData) {
  const db = getDB();
  const doctorCollection = db.collection("doctors");

  const result = await doctorCollection.insertOne(doctorData);
  return result;
}

// Fetch Doctor Profile
async function getDoctorProfile(doctorId) {
  const db = getDB();
  const doctorCollection = db.collection("doctors");

  const doctor = await doctorCollection.findOne({
    _id: new ObjectId(doctorId),
  });
  return doctor;
}

// Update Doctor Profile
async function updateDoctorProfile(doctorId, updatedData) {
  const db = getDB();
  const doctorCollection = db.collection("doctors");

  delete updatedData._id;

  const result = await doctorCollection.updateOne(
    { _id: new ObjectId(doctorId) },
    { $set: updatedData }
  );
  return result;
}

// Fetch Users Assigned to a Doctor
async function getDoctorUsers(doctorId) {
  const db = getDB();
  const userCollection = db.collection("users");

  const users = await userCollection
    .find({ doctorId: new ObjectId(doctorId) })
    .toArray();
  return users;
}

// Helper to Validate Doctor Availability
function validateAvailability(availability) {
  for (let item of availability) {
    if (item.type === "weekday" && !item.days.length) {
      throw new Error("Weekdays cannot be empty.");
    }
    if (item.type === "daterange" && (!item.from || !item.to)) {
      throw new Error("Date range 'from' and 'to' must be provided.");
    }
    if (!item.slots || item.slots.length === 0) {
      throw new Error("Slots cannot be empty.");
    }
  }
}

module.exports = {
  createDoctorProfile,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorUsers,
  validateAvailability,
};
