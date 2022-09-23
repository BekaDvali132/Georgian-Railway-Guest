const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCustomers,
  setPhysicalCustomers,
  getCustomerForm
} = require("../controllers/customerController");
const { check,matchedData } = require("express-validator");
const pool = require("../database/db");

router.get("/", protect, getCustomers);
router.get("/form", protect, getCustomerForm);
router.post(
  "/physical",
  protect,
  check("first_name").notEmpty().withMessage("კლიენტის სახელი აუცილებელია"),
  check("last_name").notEmpty().withMessage("კლიენტის გვარი აუცილებელია"),
  check("gender").notEmpty().withMessage("კლიენტის სქესი აუცილებელია"),
  check("citizenship").notEmpty().withMessage("კლიენტის მოქალაქეობა აუცილებელია"),
  // check("personal_number").notEmpty().withMessage("კლიენტის პირადი ნომერი აუცილებელია"),
  check("country_phone_code").notEmpty().withMessage("კლიენტის ქვეყნის სატელეფონო კოდი აუცილებელია"),
  check('phone_number').notEmpty().withMessage("კლიენტის ტელეფონის ნომერი აუცილებელია").isMobilePhone().withMessage('ტელეფონის ნომერი არასწორი ფორმატითაა ჩაწერილი'),
  check("email").notEmpty().withMessage("კლიენტის ელ.ფოსტა აუცილებელია").isEmail().withMessage('ელ.ფოსტა არასწორი ფორმატითაა მითითებული').custom(async (value) => {
    const emailExists = await pool.query(
      "SELECT * FROM physical_customers WHERE email = $1",
      [value]
    );
    if (emailExists?.rows?.[0]) {
      return Promise.reject("მითითებული ელ.ფოსტით კლიენტი უკვე არსებობს");
    }
  }),
  check("password").notEmpty().withMessage("კლიენტის პაროლი აუცილებელია"),
  setPhysicalCustomers
);

module.exports = router;
