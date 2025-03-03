require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL ✅"))
  .catch((err) => console.error("PostgreSQL Connection Error ❌", err));

// Middleware
app.use(express.json());
app.use(cors());

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, timestamp: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST route to submit a questionnaire response
app.post("/submit-response", async (req, res) => {
  try {
    const { name, email, answers } = req.body;

    if (!name || !email || !answers || typeof answers !== "object") {
      return res.status(400).json({ success: false, message: "Name, email, and answers are required." });
    }

    const result = await pool.query(
      "INSERT INTO responses (name, email, answers) VALUES ($1, $2, $3) RETURNING *",
      [name, email, answers]
    );

    res.status(201).json({ success: true, response: result.rows[0] });
  } catch (err) {
    console.error("Error inserting response:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET route to fetch all questionnaire responses
app.get("/responses", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, answers, submitted_at FROM responses ORDER BY submitted_at DESC");
    res.json({ success: true, responses: result.rows });
  } catch (err) {
    console.error("Error fetching responses:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
