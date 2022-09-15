const express = require("express");
const router = express.Router();

const {registerUser, getUser, getUsers, updateUser, deleteUser , loginUser} = require('../controllers/userController')

router.get("/", getUsers);

router.get("/:id", getUser);

router.post(
  "/",
  registerUser
);

router.put(
  "/:id",
  updateUser
);

router.delete(
  "/:id", deleteUser
);

router.post(
    "/login", loginUser
  );

module.exports = router;