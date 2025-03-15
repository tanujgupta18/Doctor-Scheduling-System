const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { getDB } = require("../config/db");

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

    const db = getDB();
    const users = db.collection("users");

    let user = await users.findOne({ googleId: sub });

    if (!user) {
      const result = await users.insertOne({
        name,
        email,
        googleId: sub,
        picture,
        profile: {},
      });
      user = await users.findOne({ _id: result.insertedId });
    }

    const jwtToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    reply.send({ token: jwtToken, user: { name, email, picture } });
  } catch (error) {
    console.error(error);
    reply.status(400).send({ error: "Google Authentication Failed" });
  }
};

module.exports = { googleAuth };
