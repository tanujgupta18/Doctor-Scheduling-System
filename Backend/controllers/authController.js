const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SECRET_KEY = process.env.JWT_SECRET;

const googleAuth = async (req, reply) => {
  try {
    const { token } = req.body;
    if (!token) {
      // console.error("No token received in request body.");
      return reply.status(400).send({ error: "Missing token" });
    }

    // console.log("Backend received Google Token:", token);

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (verificationError) {
      // console.error("Google Token Verification Failed:", verificationError);
      return reply.status(400).send({ error: "Invalid Google token" });
    }

    // console.log("Token verified by Google");

    const payload = ticket.getPayload();
    // console.log("Google Payload:", payload);

    const { sub, email, name, picture } = payload;

    const db = getDB();
    const users = db.collection("users");

    const user = await users.findOneAndUpdate(
      { googleId: sub },
      {
        $setOnInsert: {
          name,
          email,
          googleId: sub,
          picture,
          role: email.includes("doctor") ? "doctor" : "user",
          profile: {},
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    // console.log("User logged in:", user);

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    reply.send({ success: true, user, token: jwtToken });
  } catch (error) {
    // console.error("Google Authentication Failed:", error);
    reply.status(400).send({ error: "Authentication Failed" });
  }
};

module.exports = { googleAuth };
