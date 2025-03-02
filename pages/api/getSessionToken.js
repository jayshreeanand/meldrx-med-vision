const fetch = require('node-fetch');

export default async function handler(req, res) {
  try {
    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
    if (!HEYGEN_API_KEY) {
      throw new Error("API key is missing from .env");
    }

    const response = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: {
        "x-api-key": HEYGEN_API_KEY,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from HeyGen API:', errorText);
      return res.status(response.status).json({ error: 'Failed to fetch session token', details: errorText });
    }

    const data = await response.json();
    console.log(data);
    return res.status(200).json({ token: data.data.token });
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return res.status(500).json({ error: "Failed to retrieve access token", details: error.message });
  }
} 