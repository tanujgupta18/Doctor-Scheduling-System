const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MongoDB URI is missing");
  process.exit(1);
}

const client = new MongoClient(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("doctorDB");
    console.log("Connected to MongoDB");

    client.on("close", () => {
      console.warn("MongoDB connection closed");
      connectDB();
    });

    process.on("SIGINT", async () => {
      console.log("Closing connection");
      await client.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
}

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized.");
  }
  return db;
};

module.exports = { connectDB, getDB };
