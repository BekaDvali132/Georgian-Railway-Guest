const pool = require("../database/db");
const { errorsObjectFormatter } = require("../middleware/errorsFormatter");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendNewPasswordMail, sendCodeMail } = require("../functions/sendEmail");

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
  const countries = await pool.query("SELECT * from countries");

  res.status(200).json({
    status: "success",
    data: {
      physical_customers: physicalCustomers?.rows,
      legal_customers: legalCustomers?.rows,
      organization_types: organizationTypes?.rows,
      countries: countries?.rows,
    },
  });
};

// @desc    Register legal Customers
// @route   POST /api/customers
// @access  Private
const registerPhysicalCustomers = async (req, res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

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

  newCustomer = await pool.query(
    `INSERT INTO physical_customers (first_name, last_name, gender, citizenship, ${
      country.rows?.[0]?.name_ka === "საქართველო"
        ? "personal_number"
        : "passport_number"
    }, country_phone_code, phone_number, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      first_name,
      last_name,
      gender,
      citizenship,
      country.rows?.[0]?.name_ka === "საქართველო"
        ? personal_number
        : passport_number,
      country_phone_code,
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

// @desc    Register Legal Customer
// @route   POST /api/customers/legal
// @access  Private
const registerLegalCustomer = async (req, res) => {
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

// @desc    Get Physical Customer
// @route   Get /api/customers/physical/:id
// @access  Private
const getPhysicalCustomer = async (req, res) => {
  const physicalCustomer = await pool.query(
    `Select * FROM physical_customers WHERE id = ${req.params.id}`
  );

  if (physicalCustomer) {
    res.status(200).json({
      status: "success",
      data: physicalCustomer?.rows?.[0],
    });
  }
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

// @desc    Get logged Customer
// @route   Get /api/customers/me
// @access  Private
const getCurrentCustomer = (req, res) => {
  res.status(200).json({
    status: "success",
    user: req?.user,
    token: generateToken(req?.user?.id),
  });
};

// @desc    login Customer
// @route   Post /api/customers/login
// @access  Public
const loginCustomer = async (req, res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  let customerType = "physical";

  const { email, password } = req.body;

  let customer = await pool.query(
    "SELECT * FROM physical_customers WHERE email=$1",
    [email]
  );

  if (!customer?.rows?.[0]) {
    customerType = "legal";
    customer = await pool.query(
      "SELECT * FROM legal_customers WHERE email=$1",
      [email]
    );
  }

  if (await bcrypt.compare(password, customer?.rows?.[0]?.password)) {
    res.status(200).json({
      status: "success",
      data: {
        user: {
          first_name: customer?.rows?.[0]?.first_name,
          last_name: customer?.rows?.[0]?.last_name,
          email: customer?.rows?.[0]?.email,
        },
        token: generateToken(customer?.rows?.[0]?.id),
      },
    });
  } else {
    res.status(200).json({
      errors: {
        password: "პაროლი არასწორია",
      },
    });
  }
};

// @desc    Reset Customer Password
// @route   Post /api/customers/:id/reset
// @access  Private
const resetCustomer = async (req, res) => {
  const { id } = req.params;
  const {legal} = req.body

  const customer = await pool.query(`SELECT * from ${legal ? 'legal_customers' : 'physical_customers'} where id = $1`,[id])

  if (id && customer?.rows?.[0]) {
    const generatedPassword = Math.random().toString(36).slice(-8);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);


    const updatedCustomer = await pool.query(
      `UPDATE ${legal ? 'legal_customers' : 'physical_customers'} SET password = $2 WHERE id = $1`,
      [id, hashedPassword]
    );

    sendNewPasswordMail(customer?.rows?.[0]?.email, customer?.rows?.[0]?.first_name || customer?.rows?.[0]?.organization_name, generatedPassword)

    res.status(200).json({
      status:'success'
    })
  } else {
    res.status(200).json({
      status:'unsuccess'
    })
  }
};

// @desc    Send Customer Password Recovery Mail
// @route   Post /api/customers/send-recovery
// @access  Public
const sendRecovery = async (req,res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const {email, type} = req.body;

  const customerExists = await pool.query(`Select * from ${type} where email = $1`,[email])

  if (customerExists?.rows?.[0]) {

    const resetCodes = await pool.query('Select code from password_resets')

    const generatedCode = generateCode(resetCodes?.rows);

    const emailCodeExists = await pool.query('Select * from password_resets where email = $1',[email])

    if (emailCodeExists?.rows?.[0]) {
      await pool.query(`UPDATE password_resets SET code = $1, customer_type = $3 WHERE id = $2`,[generatedCode, emailCodeExists?.rows?.[0]?.id, type]);
    } else {
      await pool.query('Insert into password_resets (code, email, customer_type) values ($1, $2, $3)',[generatedCode, email, type]);
    }

    sendCodeMail(email, generatedCode)

    res.status(200).json({
      status: 'success'
    })

    
  } else {
    res.status(200).json({
      errors:{
        email: "მითითებული ელ.ფოსტა არ არსებობს"
      }
    })
  }
}

// @desc    Submit Customer Password Recovery
// @route   Post /api/customers/recover-password/:code
// @access  Public
const passwordRecovery = async (req,res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const {password} = req.body;

  const {code} = req.params;

  const codeExists = await pool.query(`Select * from password_resets where code = $1`,[code])

  if (codeExists?.rows?.[0]) {

    const customer = await pool.query(`Select * from ${codeExists?.rows?.[0]?.customer_type} where email = $1`,[codeExists?.rows?.[0]?.email])

    if (customer?.rows?.[0]) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await pool.query(
        `UPDATE ${codeExists?.rows?.[0]?.customer_type} SET password = $1 WHERE id = $2`,
        [hashedPassword, customer?.rows?.[0]?.id]
      );

      await pool.query(`DELETE FROM password_resets WHERE id = $1`,[codeExists?.rows?.[0]?.id])
    } else {
      res.status(200).json({
        errors:{
          message: "მითითებული აღდგენა არ არსებობს"
        }
      })
    }

    res.status(200).json({
      status: 'success'
    })

    
  } else {
    res.status(200).json({
      errors:{
        message: "მითითებული აღდგენა არ არსებობს"
      }
    })
  }
}

// Generate Code
const generateCode = (codes) => {

  const generatedCode = (Math.random() + 1).toString(36).substring(2);

  if (codes?.find(code => code?.code == generatedCode)) {
    generateCode();
  } else {
    return generatedCode;
  }

}

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  getCustomers,
  registerPhysicalCustomers,
  getCustomerForm,
  deletePhysicalCustomer,
  registerLegalCustomer,
  deleteLegalCustomer,
  getPhysicalCustomer,
  getCurrentCustomer,
  loginCustomer,
  resetCustomer,
  sendRecovery,
  passwordRecovery
};
