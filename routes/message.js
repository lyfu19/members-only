const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT messages.*, users.first_name, users.last_name
       FROM messages
       JOIN users ON messages.author_id = users.id
       ORDER BY timestamp DESC`,
    );

    const messages = result.rows;

    res.render("index", { user: req.user, messages });
  } catch (error) {
    console.error("Error loading messages:", error);
    res.status(500).send("Error loading messages.");
  }
});

// Show form to create a new message
router.get("/new-message", (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }
  res.render("new-message", { user: req.user, errors: null, formData: {} });
});

router.post(
  "/new-message",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("text").trim().notEmpty().withMessage("Message content is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { title, text } = req.body;

    if (!req.user) {
      return res.redirect("/log-in");
    }

    if (!errors.isEmpty()) {
      return res.render("new-message", {
        user: req.user,
        errors: errors.array(),
        formData: { title, text },
      });
    }

    try {
      await db.query(`INSERT INTO messages (title, text, author_id) VALUES ($1, $2, $3)`, [
        title,
        text,
        req.user.id,
      ]);
      res.redirect("/");
    } catch (error) {
      console.error("Error inserting message:", error);
      res.status(500).send("Something went wrong.");
    }
  },
);

router.post("/delete-message/:id", async (req, res) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).send("Forbidden");
  }

  const { id } = req.params;

  try {
    await db.query("DELETE FROM messages WHERE id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.error("Failed to delete message:", error);
    res.status(500).send("Error deleting message.");
  }
});

module.exports = router;
