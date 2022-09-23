const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCustomers,
  setPhysicalCustomers,
  getCustomerForm,
  deletePhysicalCustomer,
  setLegalCustomer
} = require("../controllers/customerController");
const { check,matchedData } = require("express-validator");
const pool = require("../database/db");

router.get("/", protect, getCustomers);

router.get("/form", protect, getCustomerForm);

// Set Physical Customer
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
    const physicalEmailExists = await pool.query(
      "SELECT * FROM physical_customers WHERE email = $1",
      [value]
    );

    const legalEmailExists = await pool.query(
      "SELECT * FROM legal_customers WHERE email = $1",
      [value]
    );

    if (physicalEmailExists?.rows?.[0] || legalEmailExists?.rows?.[0]) {
      return Promise.reject("მითითებული ელ.ფოსტით კლიენტი უკვე არსებობს");
    }
  }),
  check("password").notEmpty().withMessage("კლიენტის პაროლი აუცილებელია"),
  setPhysicalCustomers
);

// Set Legal Customer

router.post(
  "/legal",
  protect,
  check("country").notEmpty().withMessage("ქვეყანა აუცილებელია"),
  check("identification_number").notEmpty().withMessage("საიდენტიფიკაციო ნომერი აუცილებელია"),
  check("organization_type").notEmpty().withMessage("ორგანიზაციის ტიპი აუცილებელია"),
  check("organization_name").notEmpty().withMessage("ორგანიზაციის დასახელება აუცილებელია"),
  check("bank_account_number").notEmpty().withMessage("საბანკო ანგარიშის ნომერი აუცილებელია"),
  check('legal_address').notEmpty().withMessage("იურიდიული მისამართი აუცილებელია"),
  check("email").notEmpty().withMessage("ელ.ფოსტა აუცილებელია").isEmail().withMessage('ელ.ფოსტა არასწორი ფორმატითაა მითითებული').custom(async (value) => {
    const physicalEmailExists = await pool.query(
      "SELECT * FROM physical_customers WHERE email = $1",
      [value]
    );

    const legalEmailExists = await pool.query(
      "SELECT * FROM legal_customers WHERE email = $1",
      [value]
    );

    if (physicalEmailExists?.rows?.[0] || legalEmailExists?.rows?.[0]) {
      return Promise.reject("მითითებული ელ.ფოსტით კლიენტი უკვე არსებობს");
    }
  }),
  check('phone_number').notEmpty().withMessage('ტელეფონის ნომერი აუცილებელია'),
  check("password").notEmpty().withMessage("კლიენტის პაროლი აუცილებელია"),
  setLegalCustomer
);

router.delete('/physical/:id', protect, deletePhysicalCustomer)

module.exports = router;
