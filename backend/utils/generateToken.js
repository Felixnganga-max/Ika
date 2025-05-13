import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = async (req, res, next) => {
  const CONSUMER_KEY = process.env.CONSUMER_KEY;
  const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
  const URL =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    return res.status(400).json({ message: "Missing MPESA credentials" });
  }

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString(
    "base64"
  );

  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    req.token = response.data.access_token;
    console.log("✅ Access Token:", req.token); // Debugging
    next();
  } catch (error) {
    console.error(
      "❌ Failed to generate token:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      message: "Failed to generate access token",
      error: error.response?.data || error.message,
    });
  }
};
