const axios = require('axios');

export default async function handler(req, res) {
  try {
    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
    if (!HEYGEN_API_KEY) {
      throw new Error("API key is missing from .env");
    }

    const { session_id } = req.body;
    if (!session_id) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const response = await axios.post("https://api.heygen.com/v1/streaming.stop", {
      session_id
    }, {
      headers: {
        "x-api-key": HEYGEN_API_KEY,
        "Content-Type": "application/json"
      }
    });

    if (response.data.status === "success") {
      return res.status(200).json({ message: 'Session closed successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to close session' });
    }
  } catch (error) {
    console.error("Error closing session:", error.message);
    return res.status(500).json({ error: "Failed to close session", details: error.message });
  }
} 