// app.js
const express = require("express");
const path = require("path");
const session = require("express-session");

// Passport LocalStrategy
const passport = require("passport");

require("./config/passport");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "secretKey", resave: false, saveUninitialized: true }));
app.use(passport.session());

// Router
const authRouter = require("./routes/auth");
const messageRouter = require("./routes/message");

app.use("/", authRouter);
app.use("/", messageRouter);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on http://localhost:3000"));
