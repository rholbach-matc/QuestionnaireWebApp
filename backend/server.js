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
    const { name, email, question, answer } = req.body;

    if (!name || !email || !question) {
      return res.status(400).json({ success: false, message: "Name, email, and question are required." });
    }

    const result = await pool.query(
      "INSERT INTO responses (name, email, question, answer) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, question, answer || null] // Defaults to NULL if empty
    );

    res.status(201).json({ success: true, response: result.rows[0] });
  } catch (err) {
    console.error("Error inserting response:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
