const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

//   Helper function to validate user data before update
const validateUserData = (data) => {
  if (!data.name || typeof data.name !== "string") return "Invalid user name";

  if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
    return "Invalid email format";
  }

  if (data.age && (isNaN(data.age) || data.age < 0)) return "Invalid age";
  if (data.gender && !["Male", "Female", "Other"].includes(data.gender))
    return "Invalid gender";

  return null;
};

//   Create a new user
async function createUser(userData) {
  try {
    const db = getDB();

    //   Validate user data
    const validationError = validateUserData(userData);
    if (validationError) throw new Error(validationError);

    //   Check if user already exists
    const existingUser = await db
      .collection("users")
      .findOne({ email: userData.email });
    if (existingUser) throw new Error("User with this email already exists");

    const newUser = {
      ...userData,
      medicalHistory: userData.medicalHistory || [],
    };

    //   Insert new user
    const result = await db.collection("users").insertOne(newUser);
    // console.log("User created successfully:", result.insertedId);
    return result;
  } catch (error) {
    // console.error("Error creating user:", error.message);
    throw error;
  }
}

//   Fetch all users
async function getAllUsers() {
  try {
    const db = getDB();
    return db
      .collection("users")
      .find({}, { projection: { name: 1, email: 1, age: 1, gender: 1 } })
      .toArray();
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
}

//   Fetch user by ID
async function getUserById(id) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(id)) throw new Error("Invalid user ID format");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    if (!user) throw new Error("User not found");

    // console.log("User fetched successfully:", user);
    return user;
  } catch (error) {
    // console.error("Error fetching user:", error.message);
    throw error;
  }
}

//   Update User
async function updateUser(id, userData) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(id)) throw new Error("Invalid user ID format");

    const validationError = validateUserData(userData);
    if (validationError) throw new Error(validationError);

    const { _id, ...updateData } = userData;

    if (!updateData.email) {
      const existingUser = await db
        .collection("users")
        .findOne({ _id: new ObjectId(id) });
      if (existingUser) updateData.email = existingUser.email;
    }

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      // console.error("No user found with ID:", id);
      throw new Error("User not found");
    }

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    // console.error("Error updating user:", error);
    return { success: false, message: error.message };
  }
}

// Medical History Functions

//   Get user's medical history
async function getMedicalHistory(id) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(id)) throw new Error("Invalid user ID format");

    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { medicalHistory: 1 } }
      );

    if (!user || !user.medicalHistory) return [];

    return user.medicalHistory.map((entry) => ({
      ...entry,
      date: entry.date ? new Date(entry.date) : new Date("2000-01-01"),
    }));
  } catch (error) {
    console.error("Error fetching medical history:", error.message);
    throw error;
  }
}

//   Add a new medical history record
async function addMedicalHistory(id, historyEntry) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(id)) throw new Error("Invalid user ID format");

    //   Validate history entry
    if (!historyEntry.condition || typeof historyEntry.condition !== "string") {
      throw new Error("Medical condition is required and must be a string");
    }
    if (
      !historyEntry.description ||
      typeof historyEntry.description !== "string"
    ) {
      throw new Error("Description is required and must be a string");
    }
    if (historyEntry.date && isNaN(Date.parse(historyEntry.date))) {
      throw new Error("Invalid date format");
    }

    //   Assign a unique ID to this medical history entry
    historyEntry._id = new ObjectId();

    //   Use provided date or default to current date
    historyEntry.date = historyEntry.date
      ? new Date(historyEntry.date)
      : new Date();

    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(id) },
        { $push: { medicalHistory: historyEntry } }
      );

    return result;
  } catch (error) {
    console.error("Error adding medical history:", error.message);
    throw error;
  }
}

//   Delete a medical history entry
async function deleteMedicalHistory(id, historyId) {
  try {
    const db = getDB();
    if (!ObjectId.isValid(id) || !ObjectId.isValid(historyId)) {
      throw new Error("Invalid user ID or history ID format");
    }

    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(id) },
        { $pull: { medicalHistory: { _id: new ObjectId(historyId) } } }
      );

    if (result.modifiedCount === 0) {
      throw new Error("No matching medical history entry found to delete");
    }

    return result;
  } catch (error) {
    console.error("Error deleting medical history:", error.message);
    throw error;
  }
}

//   Export All Functions
module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  getUserById,
  getMedicalHistory,
  addMedicalHistory,
  deleteMedicalHistory,
};
