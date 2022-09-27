const express = require("express");
const router = express.Router();
const { protect, protectUser } = require("../middleware/authMiddleware");
const {
  getCustomers,
  registerPhysicalCustomers,
  getCustomerForm,
  deletePhysicalCustomer,
  registerLegalCustomer,
  deleteLegalCustomer,
  getPhysicalCustomer,
  getCurrentCustomer,
  loginCustomer,
} = require("../controllers/customerController");
const { check } = require("express-validator");
const pool = require("../database/db");

router.get("/", protect, getCustomers);
router.get("/me", protectUser, getCurrentCustomer);

router.post(
  "/login",
  check("email")
    .notEmpty()
    .withMessage("ელ.ფოსტა აუცილებელია")
    .custom(async (value) => {
      const clientExists = await pool.query(
        "select email from physical_customers where email = $1 union select email from legal_customers where email = $1",
        [value]
      );

      if (!clientExists?.rows?.[0]) {
        return Promise.reject("მითითებული ელ.ფოსტა არ არის დარეგისტრირებული");
      }
    }),
  check("password").notEmpty().withMessage("პაროლი აუცილებელია"),
  loginCustomer
);

router.get("/form", protect, getCustomerForm);

// Set Physical Customer
router.post(
  "/physical",
  protect,
  check("first_name").notEmpty().withMessage("კლიენტის სახელი აუცილებელია"),
  check("last_name").notEmpty().withMessage("კლიენტის გვარი აუცილებელია"),
  check("gender").notEmpty().withMessage("კლიენტის სქესი აუცილებელია"),
  check("verification").notEmpty().withMessage('ვერიფიკაციის გავლა სავალდებულოა'),
  check("citizenship")
    .notEmpty()
    .withMessage("კლიენტის მოქალაქეობა აუცილებელია"),
  check("country_phone_code")
    .notEmpty()
    .withMessage("კლიენტის ქვეყნის სატელეფონო კოდი აუცილებელია"),
  check("phone_number")
    .notEmpty()
    .withMessage("კლიენტის ტელეფონის ნომერი აუცილებელია")
    .isMobilePhone()
    .withMessage("ტელეფონის ნომერი არასწორი ფორმატითაა ჩაწერილი")
    .custom(async (value) => {
      const phoneNumberExists = await pool.query(
        "select email from physical_customers where phone_number = $1 union select email from legal_customers where phone_number = $1",
        [value]
      );

      if (phoneNumberExists?.rows?.[0]) {
        return Promise.reject(
          "მითითებული ტელეფონის ნომერი უკვე დარეგისტრირებულია"
        );
      }
    }),
  check("email")
    .notEmpty()
    .withMessage("კლიენტის ელ.ფოსტა აუცილებელია")
    .isEmail()
    .withMessage("ელ.ფოსტა არასწორი ფორმატითაა მითითებული")
    .custom(async (value) => {
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
  check("personal_number").custom(async (value, { req, location, path }) => {
    if (req?.body.citizenship && !value) {
      const country = await pool.query(
        "SELECT * from countries where id = $1",
        [req?.body.citizenship]
      );

      return country?.rows?.[0]?.name_ka === "საქართველო"
        ? Promise.reject("საქართველოს მოქალაქისთვის პირადი ნომერი აუცილებელია")
        : "";
    } else if (value) {
      const personalNumberExists = await pool.query(
        "select personal_number from physical_customers where personal_number = $1",
        [value]
      );

      return personalNumberExists?.rows?.[0]
        ? Promise.reject("პირადი ნომერი დაკავებულია")
        : "";
    }
  }),
  check("passport_number").custom(async (value, { req, location, path }) => {
    if (req?.body.citizenship && !value) {
      const country = await pool.query(
        "SELECT * from countries where id = $1",
        [req?.body.citizenship]
      );

      return country?.rows?.[0]?.name_ka !== "საქართველო"
        ? Promise.reject("პასპორტის ნომერი აუცილებელია")
        : "";
    } else if (value) {
      const passportNumberExists = await pool.query(
        "select passport_number from physical_customers where passport_number = $1",
        [value]
      );

      return passportNumberExists?.rows?.[0]
        ? Promise.reject("პასპორტის ნომერი დაკავებულია")
        : "";
    }
  }),
  check('recaptcha').notEmpty().withMessage('გთხოვთ გაიაროთ შემოწმება'),
  registerPhysicalCustomers
);

// Set Legal Customer

router.post(
  "/legal",
  protect,
  check("country").notEmpty().withMessage("ქვეყანა აუცილებელია"),
  check("identification_number")
    .notEmpty()
    .withMessage("საიდენტიფიკაციო ნომერი აუცილებელია")
    .custom(async (value, { req }) => {
      if (req.body?.country) {
        const identificationNumberExists = await pool.query(
          "SELECT * FROM legal_customers WHERE identification_number = $1 AND country = $2",
          [value, req.body?.country]
        );
        if (identificationNumberExists?.rows?.[0]) {
          return Promise.reject("საიდენტიფიკაციო ნომერი დაკავებულია");
        }
      }
    }),
  check("organization_type")
    .notEmpty()
    .withMessage("ორგანიზაციის ტიპი აუცილებელია"),
  check("organization_name")
    .notEmpty()
    .withMessage("ორგანიზაციის დასახელება აუცილებელია")
    // .custom(async (value) => {
    //   const organizationNameExists = await pool.query(
    //     "SELECT * FROM legal_customers WHERE organization_name = $1",
    //     [value]
    //   );
    //   if (organizationNameExists?.rows?.[0]) {
    //     return Promise.reject("ორგანიზაციის დასახელება დაკავებულია");
    //   }
    // })
    ,
  check("bank_account_number")
    .notEmpty()
    .withMessage("საბანკო ანგარიშის ნომერი აუცილებელია"),
  check("legal_address")
    .notEmpty()
    .withMessage("იურიდიული მისამართი აუცილებელია"),
  check("email")
    .notEmpty()
    .withMessage("ელ.ფოსტა აუცილებელია")
    .isEmail()
    .withMessage("ელ.ფოსტა არასწორი ფორმატითაა მითითებული")
    .custom(async (value) => {
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
    check("verification").equals(true).withMessage('ვერიფიცირების გავლა სავალდებულოა'),
  check("phone_number")
    .notEmpty()
    .withMessage("ტელეფონის ნომერი აუცილებელია")
    .custom(async (value) => {
      const phoneNumberExists = await pool.query(
        "select email from physical_customers where phone_number = $1 union select email from legal_customers where phone_number = $1",
        [value]
      );

      if (phoneNumberExists?.rows?.[0]) {
        return Promise.reject(
          "მითითებული ტელეფონის ნომერი უკვე დარეგისტრირებულია"
        );
      }
    }),
  check("password").notEmpty().withMessage("კლიენტის პაროლი აუცილებელია"),
  check('recaptcha').notEmpty().withMessage('გთხოვთ გაიაროთ შემოწმება'),
  registerLegalCustomer
);

router.get("/physical/:id", protect, getPhysicalCustomer);

router.delete("/physical/:id", protect, deletePhysicalCustomer);
router.delete("/legal/:id", protect, deleteLegalCustomer);

module.exports = router;
