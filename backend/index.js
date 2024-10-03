const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

// Endpoint to authenticate user
app.post("/authenticate", async (req, res) => {
  const { username } = req.body;

  // Check if the username is provided
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // Create or authenticate user with ChatEngine
    const r = await axios.put(
      "https://api.chatengine.io/users/",
      {
        username: username,
        secret: username, // Use username as the secret for simplicity
        first_name: username,
      },
      {
        headers: {
          "private-key": "a7c018e0-7e3b-495f-87b8-d2e3ae080d74", // Your private key
        },
      }
    );

    // Send back the response from ChatEngine
    return res.status(r.status).json(r.data);
  } catch (e) {
    // Log error for debugging
    console.error("Error authenticating user:", e.response ? e.response.data : e.message);
    
    // Send error response to the client
    return res.status(e.response ? e.response.status : 500).json(e.response ? e.response.data : { error: 'Internal Server Error' });
  }
});

// Listening on the default port set by Vercel
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
