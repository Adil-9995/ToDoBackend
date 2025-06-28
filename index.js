// If you don’t want .env support, delete the next line and skip installing dotenv

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors"); // ✅ Required to fix the ReferenceError
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGOURL = process.env.MONGOURL || "mongodb://localhost:27017/todo";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// ────────────── Middleware ──────────────
app.use(express.json());
app.use(
  cors({
    origin: "*", // or specify your frontend domain instead of "*"
  })
);

// ────────────── MongoDB Connection ──────────────
mongoose
  .connect(MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// ────────────── Schemas ──────────────
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  })
);

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    text: { type: String, required: true },
    status: { type: String, enum: ["todo", "doing", "done"], default: "todo" },
    priority: { type: String, enum: ["low", "med", "high"], default: "med" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  })
);

// ────────────── Auth Middleware ──────────────
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.userId = jwt.verify(token, JWT_SECRET).userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ────────────── Routes ──────────────

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed });
  res.status(201).json({ message: "User registered" });
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// List tasks
app.get("/task", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// Create task
app.post("/task", auth, async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.userId });
  res.status(201).json(task);
});

// Delete task
app.delete("/task/:id", auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Task deleted" });
});

// Update status / priority
app.patch("/task/:id", auth, async (req, res) => {
  const { status, priority } = req.body;
  const update = {};
  if (status) update.status = status;
  if (priority) update.priority = priority;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    update,
    { new: true }
  );

  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

// ────────────── Start Server ──────────────
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
