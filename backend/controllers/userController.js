const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { errorsObjectFormatter } = require("../middleware/errorsFormatter");
const { validationResult } = require("express-validator");
const pool = require("../database/db");

// @desc    Register User
// @route   POST /api/users
// @access  Private
const registerUser = async (req, res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  const { username, email, password, role } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await pool.query(
    "INSERT INTO users (role, email, username, password) VALUES ($1,$2,$3,$4)",
    [role, email, username, hashedPassword]
  );

  if (user) {
    res.status(201).json({
      status: "success",
      data: {
        username: user?.rows?.[0]?.username,
        email: user?.rows?.[0]?.email,
        role: user?.rows?.[0]?.role,
        token: generateToken(user?.rows?.[0]?.id),
      },
    });
  }

  res.json({ message: "register User" });
};

// @desc    Get User
// @route   GET /api/users/:id
// @access  Private
const getUser = (req, res) => {
  res.json({ message: "register User" });
};

// @desc    Get Users
// @route   GET /api/users
// @access  Private
const getUsers = (req, res) => {
  res.json({ message: "register User" });
};

// @desc    Update User
// @route   PUT /api/users/:id
// @access  Private
const updateUser = (req, res) => {
  res.json({ message: "register User" });
};

// @desc    Delete User
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = (req, res) => {
  res.json({ message: "register User" });
};

// @desc    Authenticate User
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const { username, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE username=$1", [
    username,
  ]);

  if (await bcrypt.compare(password, user?.rows?.[0]?.password)) {
    res.status(200).json({
      status: "success",
      data: {
        username: user?.rows?.[0]?.username,
        email: user?.rows?.[0]?.email,
        role: user?.rows?.[0]?.role,
        token: generateToken(user?.rows?.[0]?.id),
      },
    });
  } else {
    res.status(400).json({
      errors: {
        password: "პაროლი არასწორია",
      },
    });
  }
};

const getMe = (req,res) => {
  res.status(200).json({
    status:'success',
    user: req?.user
  })
}

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  registerUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  loginUser,
  getMe
};
