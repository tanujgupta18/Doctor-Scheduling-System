const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { findOrCreateUserByGoogle } = require("../models/authModel");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SECRET_KEY = process.env.JWT_SECRET;

const googleAuth = async (req, reply) => {
  try {
    const { token, role } = req.body;

    console.log("Incoming Google login with role:", role);

    if (!token || !role) {
      console.error("Missing token or role");
      return reply.status(400).send({ error: "Missing token or role" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    console.log("Google payload:", { sub, email, name });

    const user = await findOrCreateUserByGoogle({
      sub,
      email,
      name,
      picture,
      role,
    });

    if (!user) {
      console.error("User not created or found.");
      return reply.status(500).send({ error: "User creation failed" });
    }

    console.log("User found or created:", {
      _id: user._id,
      name: user.name,
      role: user.role,
    });

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
    console.error("Google Auth Failed:", error);
    reply.status(400).send({ error: "Authentication Failed" });
  }
};

module.exports = { googleAuth };
