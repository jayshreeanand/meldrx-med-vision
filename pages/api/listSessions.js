import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
      if (!HEYGEN_API_KEY) {
        throw new Error("API key is missing from .env");
      }

      // Make a request to the HeyGen API to list active sessions
      const response = await axios.get('https://api.heygen.com/v1/streaming.list', {
        headers: {
          "x-api-key": HEYGEN_API_KEY,
          "Content-Type": "application/json"
        }
      });

      // Return the list of sessions
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 