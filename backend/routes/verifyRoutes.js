const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const { protect } = require("../middleware/authMiddleware");
const {
  verifyEmail,
  verifyEmailCode,
  verifyPhone,
} = require("../controllers/verifyController");
const { check } = require("express-validator");

router.post(
  "/email",
  protect,
  check("email")
    .notEmpty()
    .withMessage("ელ.ფოსტა აუცილებელია")
    .isEmail()
    .withMessage("ელ.ფოსტა არასწორი ფორმატითაა მითითებული")
    .custom(async (value) => {
      const emailExists = await pool.query(
        "select email from physical_customers where email = $1 union select email from legal_customers where email = $1",
        [value]
      );

      if (emailExists?.rows?.[0]) {
        return Promise.reject("ელ.ფოსტა დაკავებულია");
      }
    }),
  verifyEmail
);

router.post(
  "/sms",
  check("phone_number")
    .notEmpty()
    .withMessage("ტელეფონის ნომერი აუცილებელია")
    .isMobilePhone()
    .withMessage("ტელეფონის ნომერი არასწორი ფორმატითაა მითითებული")
    .custom(async (value) => {
      const phoneExists = await pool.query('Select * from physical_customers where phone_number = $1 union select email from legal_customers where phone_number = $1', [value]);

      if (phoneExists?.rows?.[0]) {
        return Promise.reject("ტელეფონის ნომერი დაკავებულია");
      }
    }),
  verifyPhone
);

router.post(
  "/check-email",
  protect,
  check("code")
    .notEmpty()
    .withMessage("სავერიფიკაციო კოდი აუცილებელია")
    .custom(async (value) => {
      const savedCode = await pool.query(
        "Select * from verification_codes where code = $1",
        [value]
      );

      if (!savedCode?.rows?.[0]) {
        return Promise.reject("მითითებული კოდი არასწორია");
      }
    }),
  check("email")
    .notEmpty()
    .withMessage("ელ.ფოსტა აუცილებელია")
    .isEmail()
    .withMessage("ელ.ფოსტა არასწორი ფორმატითაა მითითებული"),
  verifyEmailCode
);

module.exports = router;
