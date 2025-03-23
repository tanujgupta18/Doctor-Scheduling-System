const {
  createUser,
  getAllUsers,
  updateUser,
  getUserById,
  getMedicalHistory,
  addMedicalHistory,
  deleteMedicalHistory,
} = require("../models/userModel");

const { ObjectId } = require("mongodb");

// Helper function to validate user data
const validateUserData = (data) => {
  if (!data.name || typeof data.name !== "string") return "Invalid user name";
  if (data.email && !/\S+@\S+\.\S+/.test(data.email))
    return "Invalid email format";
  if (data.age && (isNaN(data.age) || data.age < 0)) return "Invalid age";
  if (data.gender && !["Male", "Female", "Other"].includes(data.gender))
    return "Invalid gender";
  return null;
};

// Add a new user
async function addUser(req, reply) {
  try {
    const result = await createUser(req.body);
    reply.code(201).send({
      success: true,
      message: "User added",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    reply.code(500).send({ success: false, error: error.message });
  }
}

// Get all users
async function fetchUsers(req, reply) {
  try {
    const users = await getAllUsers();
    if (users.length === 0) {
      return reply
        .code(404)
        .send({ success: false, message: "No users found" });
    }
    reply.send({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    reply.code(500).send({ success: false, error: "Failed to fetch users" });
  }
}

// Update user profile
async function editUser(req, reply) {
  console.log("Received update request for user:", req.params.id);
  console.log("Update Data:", req.body);

  try {
    const updateData = { ...req.body };

    if (!updateData.email) {
      delete updateData.email;
    }

    const profileUpdate = {};
    if (req.body.age) profileUpdate.age = req.body.age;
    if (req.body.gender) profileUpdate.gender = req.body.gender;

    const result = await updateUser(req.params.id, profileUpdate);
    console.log("Database Update Result:", result);

    if (result.modifiedCount === 0) {
      console.log("No document modified.");
      return reply.code(404).send({
        success: false,
        message: "User not found or no changes detected",
      });
    }

    reply.send({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    reply.code(500).send({ success: false, message: "Server error" });
  }
}

// Get user by ID
async function fetchUserById(req, reply) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return reply
        .code(400)
        .send({ success: false, error: "Invalid user ID format" });
    }

    const user = await getUserById(id);
    if (!user) {
      return reply
        .code(404)
        .send({ success: false, message: "User not found" });
    }
    reply.send({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    reply.code(500).send({ success: false, error: "Failed to fetch user" });
  }
}

//  Medical History Functions

// Get a user's medical history
async function fetchMedicalHistory(req, reply) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return reply
        .code(400)
        .send({ success: false, message: "Invalid user ID format" });
    }

    const medicalHistory = await getMedicalHistory(id);
    reply.send({ success: true, medicalHistory });
  } catch (error) {
    console.error("Error fetching medical history:", error);
    reply.code(500).send({ success: false, message: "Server error" });
  }
}

// Add a new medical history entry
async function addMedicalHistoryEntry(req, reply) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return reply
        .code(400)
        .send({ success: false, message: "Invalid user ID format" });
    }

    const { condition, description, date } = req.body;
    if (!condition || !description || !date) {
      return reply.code(400).send({
        success: false,
        message: "Condition, description, and date are required",
      });
    }

    const historyEntry = {
      _id: new ObjectId(),
      condition,
      description,
      date,
    };

    const result = await addMedicalHistory(id, historyEntry);

    if (result.modifiedCount === 0) {
      return reply
        .code(500)
        .send({ success: false, message: "Failed to update medical history" });
    }

    reply.send({
      success: true,
      message: "Medical history added successfully",
    });
  } catch (error) {
    console.error("Error adding medical history:", error);
    reply.code(500).send({ success: false, message: "Server error" });
  }
}

// Delete a medical history entry
async function removeMedicalHistoryEntry(req, reply) {
  try {
    const { id, historyId } = req.params;
    if (!ObjectId.isValid(id) || !ObjectId.isValid(historyId)) {
      return reply
        .code(400)
        .send({ success: false, message: "Invalid ID format" });
    }

    const result = await deleteMedicalHistory(id, historyId);

    if (result.modifiedCount === 0) {
      return reply
        .code(404)
        .send({ success: false, message: "History entry not found" });
    }

    reply.send({ success: true, message: "Medical history entry deleted" });
  } catch (error) {
    console.error("Error deleting medical history:", error);
    reply.code(500).send({ success: false, message: "Server error" });
  }
}

// Export Updated Controllers
module.exports = {
  addUser,
  fetchUsers,
  editUser,
  fetchUserById,
  fetchMedicalHistory,
  addMedicalHistoryEntry,
  removeMedicalHistoryEntry,
};
