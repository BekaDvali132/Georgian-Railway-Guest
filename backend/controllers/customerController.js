const pool = require("../database/db");
const { errorsObjectFormatter } = require("../middleware/errorsFormatter");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @desc    Get Customers
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res) => {
  const physicalCustomers = await pool.query(
    "SELECT * from physical_customers ORDER BY created_at"
  );
  const legalCustomers = await pool.query(
    "SELECT * from physical_customers ORDER BY created_at"
  );

  res.status(200).json({
    status: "success",
    data: {
      physical_customers: physicalCustomers?.rows
    },
  });
};

// @desc    Set Customers
// @route   POST /api/customers
// @access  Private
const setPhysicalCustomers = async (req, res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const error = {};

  const {
    first_name,
    last_name,
    personal_number,
    passport_number,
    citizenship,
    phone_number,
    gender,
    country_phone_code,
    email,
    password,
  } = req.body;

  const country = await pool.query(`Select * from countries where id = $1`, [
    citizenship,
  ]);

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let newCustomer;

  if (country.rows?.[0]?.name_ka === "საქართველო") {
    !personal_number &&
      (error.personal_number =
        "საქართველოს მოქალაქისთვის პირადი ნომერი აუცილებელია");
    if (error.personal_number) {
      return res.status(200).json({
        errors: error,
      });
    } else {
      const personExists = await pool.query(
        "Select * from physical_customers where personal_number = $1",
        [personal_number]
      );

      if (personExists.rows?.[0]) {
        return res.status(200).json({
          errors: {
            personal_number: "კლიენტი ამ პირადი ნომრით უკვე არსებობს",
          },
        });
      }
      newCustomer = await pool.query(
        "INSERT INTO physical_customers (first_name, last_name, gender, citizenship, personal_number, country_phone_code, phone_number, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          first_name,
          last_name,
          gender,
          citizenship,
          personal_number,
          country_phone_code,
          phone_number,
          email,
          hashedPassword,
        ]
      );
    }
  } else {

    !passport_number &&
      (error.passport_number =
        "საქართველოს მოქალაქისთვის პირადი ნომერი აუცილებელია");

    if (error.personal_number) {
      return res.status(200).json({
        errors: error,
      });
    } else {
      const personExists = await pool.query(
        "Select * from physical_customers where passport_number = $1",
        [passport_number]
      );

      if (personExists.rows?.[0]) {
        return res.status(200).json({
          errors: {
            passport_number: "კლიენტი ამ პასპორტის ნომრით უკვე არსებობს",
          },
        });
      }

      newCustomer = await pool.query(
        "INSERT INTO physical_customers (first_name, last_name, gender, citizenship, passport_number, country_phone_code, phone_number, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          first_name,
          last_name,
          gender,
          citizenship,
          passport_number,
          country_phone_code,
          phone_number,
          email,
          hashedPassword,
        ]
      );
    }
  }

  res.status(200).json({
    status: "success",
    data: newCustomer,
  });
};

module.exports = { getCustomers, setPhysicalCustomers };
