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
    "SELECT * from legal_customers ORDER BY created_at"
  );
  const organizationTypes = await pool.query(
    "SELECT * from organization_types"
  );

  res.status(200).json({
    status: "success",
    data: {
      physical_customers: physicalCustomers?.rows,
      legal_customers: legalCustomers?.rows,
      organization_types: organizationTypes?.rows
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

// @desc    Set Legal Customer
// @route   POST /api/customers/legal
// @access  Private
const setLegalCustomer = async (req, res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const {
    country,
    identification_number,
    organization_type,
    organization_name,
    bank_account_number,
    legal_address,
    phone_number,
    email,
    password,
  } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let newCustomer;

  newCustomer = await pool.query(
    "INSERT INTO legal_customers (country, identification_number, organization_type_id, organization_name, bank_account_number, legal_address, phone_number, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [
      country,
      identification_number,
      organization_type,
      organization_name,
      bank_account_number,
      legal_address,
      phone_number,
      email,
      hashedPassword,
    ]
  );
  
  res.status(200).json({
    status: "success",
    data: newCustomer,
  });
};

// @desc    Get CustomerForm
// @route   Get /api/customers/form
// @access  Private
const getCustomerForm = async (req, res) => {
  let countries = await pool.query(
    "Select id,name_ka,country_phone_code from countries"
  );

  let organizationTypes = await pool.query(
    "SELECT id,name_ka from organization_types"
  );

  let genders = {
    1: "მამრობითი",
    2: "მდედრობითი",
  };

  let verifications = {
    1: "ელ.ფოსტით",
    2: "ტელ. ნომრით",
  };

  res.status(200).json({
    status: "success",
    data: {
      countries: countries?.rows,
      genders: genders,
      verifications: verifications,
      organization_types: organizationTypes?.rows,
    },
  });
};

// @desc    Delete Physical Customer
// @route   Delete /api/customers/physical
// @access  Private
const deletePhysicalCustomer = async (req, res) => {
  const deletePhysicalCustomer = await pool.query(
    `DELETE FROM physical_customers WHERE id = ${req.params.id}`
  );

  if (deletePhysicalCustomer) {
    res.status(200).json({
      status: "success",
    });
  }
};

// @desc    Delete Physical Customer
// @route   Delete /api/customers/physical
// @access  Private
const deleteLegalCustomer = async (req, res) => {
  const deleteLegalCustomer = await pool.query(
    `DELETE FROM legal_customers WHERE id = ${req.params.id}`
  );

  if (deleteLegalCustomer) {
    res.status(200).json({
      status: "success",
    });
  }
};

module.exports = {
  getCustomers,
  setPhysicalCustomers,
  getCustomerForm,
  deletePhysicalCustomer,
  setLegalCustomer,
  deleteLegalCustomer
};
