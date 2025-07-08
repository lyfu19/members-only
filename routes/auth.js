// routes/auth.js
const express = require("express");

const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const db = require("../db");

router.get("/sign-up", (req, res) => {
  res.render("sign-up", { errors: null, formData: {} });
});

router.post(
  "/sign-up",
  [
    body("first_name").trim().notEmpty().withMessage("First name is required"),
    body("last_name").trim().notEmpty().withMessage("Last name is required"),
    body("username").trim().isEmail().withMessage("Username must be a valid email"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("confirm_password")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("sign-up", { errors: errors.array(), formData: req.body });
    }

    const { first_name, last_name, username, password } = req.body;

    try {
      const existing = await db.query("SELECT * FROM users WHERE username = $1", [username]);
      if (existing.rows.length > 0) {
        return res.render("sign-up", {
          errors: [{ msg: "This email is already registered." }],
          formData: req.body,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        `INSERT INTO users (first_name, last_name, username, password)
      VALUES ($1, $2, $3, $4)`,
        [first_name, last_name, username, hashedPassword],
      );

      res.redirect("/");
    } catch (error) {
      console.error("Error inserting user:", error);
      res.status(500).send("Something went wrong.");
    }
  },
);

router.get("/log-in", (req, res) => {
  res.render("log-in", { error: null });
});

router.post("/log-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("log-in", { error: info.message });
    }

    // 登录成功：写 session
    req.logIn(user, (error) => {
      if (err) {
        return next(error);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/join", (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }

  res.render("join", { error: null });
});

router.post("/join", async (req, res) => {
  const { secret_code } = req.body;

  if (!req.user) {
    return res.redirect("/log-in");
  }

  if (secret_code === process.env.MEMBER_SECRET) {
    try {
      await db.query("UPDATE users SET is_member = true WHERE id = $1", [req.user.id]);
      req.user.is_member = true;
      return res.redirect("/");
    } catch (error) {
      console.error("Failed to update membership:", error);
      return res.status(500).send("Error updating membership.");
    }
  }

  // Incorrect secret code
  res.render("join", { error: "Incorrect secret code." });
});

router.get("/admin", (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }
  res.render("admin", { error: null });
});

router.post("/admin", async (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }

  const { admin_code } = req.body;
  if (admin_code === process.env.ADMIN_SECRET) {
    try {
      await db.query("UPDATE users SET is_admin = true WHERE id = $1", [req.user.id]);
      req.user.is_admin = true;
      return res.redirect("/");
    } catch (error) {
      console.error("Failed to promote to admin:", error);
      return res.status(500).send("Error setting admin.");
    }
  }

  res.render("admin", { error: "Incorrect admin code." });
});

module.exports = router;
