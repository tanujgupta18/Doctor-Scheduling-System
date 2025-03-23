const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

async function findOrCreateUserByGoogle({ sub, email, name, picture }) {
  const db = getDB();
  const users = db.collection("users");

  const role = email.includes("doctor") ? "doctor" : "user";

  const result = await users.findOneAndUpdate(
    { googleId: sub },
    {
      $setOnInsert: {
        name,
        email,
        googleId: sub,
        picture,
        role,
        profile: {
          age: null,
          gender: null,
          medicalHistory: [],
        },
        createdAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  return result.value || result;
}

module.exports = {
  findOrCreateUserByGoogle,
};
