require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const { OAuth2Client } = require("google-auth-library");
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

// Connect -> MongoDB
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
connectDB();

// Google Auth Setup
fastify.register(require("@fastify/cors"), {
  origin: "*",
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// JWT Secret Key
const SECRET_KEY = process.env.JWT_SECRET;

// Google Authentication Route
fastify.post("/auth/google", async (req, reply) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Check if user exists in MongoDB
    const users = db.collection("users");
    let user = await users.findOne({ googleId: sub });

    if (!user) {
      const result = await users.insertOne({
        name,
        email,
        googleId: sub,
        picture,
      });
      user = await users.findOne({ _id: result.insertedId }); // Fetch inserted user
    }

    // Generatating JWT Token
    const jwtToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    reply.send({ token: jwtToken, user: { name, email, picture } });
  } catch (error) {
    console.error(error);
    reply.status(400).send({ error: "Google Authentication Failed" });
  }
});

fastify.listen({ port: 5000 }, (err, address) => {
  if (err) {
    console.error("Server Start Error:", err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
