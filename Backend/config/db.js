const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("doctorDB");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
}

const getDB = () => db;

module.exports = { connectDB, getDB };
