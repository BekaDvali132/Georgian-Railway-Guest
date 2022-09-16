const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const {protect} = require('../middleware/authMiddleware');

const {
  registerUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  loginUser,
  getMe
} = require("../controllers/userController");

const { check } = require("express-validator");

router.get("/", getUsers);

router.get("/me", protect, getMe);

router.get("/:id", getUser);

router.post(
  "/",
  check("username")
    .notEmpty()
    .withMessage("მიუთითეთ მომხმარებლის დასახელება")
    .custom(async (value) => {
      const userNameExists = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [value]
      );
      if (userNameExists?.rows?.[0]) {
        return Promise.reject("მითითებულ დასახელება დაკავებულია");
      }
    }),
  check("email")
    .notEmpty()
    .withMessage("მიუთითეთ მომხმარებლის მეილი")
    .isEmail()
    .withMessage("მეილი არასწორი ფორმატითაა")
    .custom(async (value) => {
      const emailExists = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [value]
      );
      if (emailExists?.rows?.[0]) {
        return Promise.reject("მითითებულ მეილი დაკავებულია");
      }
    }),
  check("password").notEmpty().withMessage("მიუთითეთ მომხმარებლის პაროლი"),
  check("role").notEmpty().withMessage("მიუთითეთ მომხმარებლის როლი"),
  registerUser
);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

router.post(
  "/login",
  check("username").notEmpty().withMessage("მიუთითეთ მომხმარებლის დასახელება").custom(async (value) => {
    const userNameExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [value]
    );
    if (!userNameExists?.rows?.[0]) {
      return Promise.reject("მითითებულ დასახელებით მომხმარებელი არ არსებობს");
    }
  }),
  check("password").notEmpty().withMessage("მიუთითეთ მომხმარებლის პაროლი"),
  loginUser
);

module.exports = router;
