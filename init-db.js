// init-db.js
const db = require("./db");

async function init() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_member BOOLEAN DEFAULT FALSE,
        is_admin BOOLEAN DEFAULT FALSE
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        author_id INTEGER REFERENCES users(id)
      );
    `);

    console.log("✅ Tables created successfully.");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  } finally {
    process.exit();
  }
}

init();
