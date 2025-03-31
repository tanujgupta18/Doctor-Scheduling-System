const { getDB } = require("../config/db");

async function findOrCreateUserByGoogle({ sub, email, name, picture, role }) {
  try {
    const db = getDB();

    if (role !== "doctor" && role !== "user") {
      throw new Error("Invalid role provided");
    }

    const collection = db.collection(role === "doctor" ? "doctors" : "users");

    let insertDoc;

    if (role === "doctor") {
      // Doctor required fields: name, specialization, availability
      insertDoc = {
        name: name || "Unnamed Doctor",
        email: email || "",
        googleId: sub,
        picture: picture || "",
        role: "doctor",
        specialization: "",
        availability: [],
        createdAt: new Date(),
      };
    } else {
      // User required fields: name, email, profile
      insertDoc = {
        name: name || "Unnamed User",
        email: email || "",
        googleId: sub,
        picture: picture || "",
        role: "user",
        profile: {
          age: null,
          gender: null,
          medicalHistory: [],
        },
        createdAt: new Date(),
      };
    }

    await collection.updateOne(
      { googleId: sub },
      { $setOnInsert: insertDoc },
      { upsert: true }
    );

    // Fetch the user after insert
    const user = await collection.findOne({ googleId: sub });

    if (!user) {
      throw new Error("User creation failed after upsert.");
    }

    return user;
  } catch (err) {
    console.error("findOrCreateUserByGoogle ERROR:", err);
    throw err;
  }
}

module.exports = {
  findOrCreateUserByGoogle,
};
