const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { findOrCreateUserByGoogle } = require("../models/authModel");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SECRET_KEY = process.env.JWT_SECRET;

const googleAuth = async (req, reply) => {
  try {
    const { token } = req.body;
    if (!token) {
      return reply.status(400).send({ error: "Missing token" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    const user = await findOrCreateUserByGoogle({ sub, email, name, picture });

    // Create JWT token with cleaner payload
    const jwtToken = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    reply.send({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google Auth Failed:", error.message);
    reply.status(400).send({ error: "Authentication Failed" });
  }
};

module.exports = { googleAuth };
