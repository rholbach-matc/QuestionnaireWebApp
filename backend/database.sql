CREATE TABLE IF NOT EXISTS responses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    answers JSONB NOT NULL, -- Stores all answers as a JSON object
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);