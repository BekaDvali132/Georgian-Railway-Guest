const pool = require("../database/db");
const { unlink } = require("fs");

// @desc    Get Countries
// @route   GET /api/countries
// @access  Private
const getCountries = async (req, res) => {
  const countries = await pool.query(
    "SELECT * from countries ORDER BY created_at"
  );

  res.status(200).json({
    status: "success",
    data: countries?.rows,
    pages: countries?.rows?.length / 10
  });
};

// @desc    Get Country
// @route   GET /api/countries/:id
// @access  Private
const getCountry = async (req, res) => {
  const country = await pool.query("SELECT * from countries WHERE id = $1", [
    req.params.id,
  ]);

  res.status(200).json({
    status: "success",
    data: country?.rows,
  });
};

// @desc    Set Countries
// @route   POST /api/countries
// @access  Private
const setCountries = async (req, res) => {
  const { name_ka, name_en, name_ru, country_phone_code } = req.body;

  const errors = {};

  if (!name_ka) {
    errors.name_ka = "ქვეყნის ქართული სახელი აუცილებელია";
  }
  if (!name_en) {
    errors.name_en = "ქვეყნის ინგლისური სახელი აუცილებელია";
  }
  if (!name_ru) {
    errors.name_ru = "ქვეყნის რუსული სახელი აუცილებელია";
  }
  if (!req?.file?.path) {
    errors.flag_image = "ქვეყნის დროშა აუცილებელია";
  }
  if (!country_phone_code) {
    errors.country_phone_code = "ქვეყნის სატელოფონო კოდი აუცილებელია";
  }

  if (Object.keys(errors).length > 0) {
    if (req?.file?.path) {
      unlink(req?.file?.path, (err) => {
        if (err) {
          console.log(err);
          res.status(200).json({ errors: errors });
        } else {
          res.status(200).json({ errors: errors });
        }
      });
    } else {
      res.status(200).json({ errors: errors });
    }
  } else {
    const newCountry = await pool.query(
      "INSERT INTO countries (name_ka, name_en, name_ru, flag_image_path, country_phone_code) VALUES ($1, $2, $3, $4, $5)",
      [name_ka, name_en, name_ru, req.file.path, country_phone_code]
    );

    res.status(200).json({
      status: "success",
      country: newCountry,
    });
  }
};

// @desc    Update Country
// @route   PUT /api/countries/:id
// @access  Private
const updateCountry = async (req, res) => {
  const { name_ka, name_en, name_ru, flag_image_path, country_phone_code } = req.body;

  const errors = {};

  if (!name_ka) {
    errors.name_ka = "ქვეყნის ქართული სახელი აუცილებელია";
  }
  if (!name_en) {
    errors.name_en = "ქვეყნის ინგლისური სახელი აუცილებელია";
  }
  if (!name_ru) {
    errors.name_ru = "ქვეყნის რუსული სახელი აუცილებელია";
  }
  if (!req?.file?.path && !flag_image_path) {
    errors.flag_image = "ქვეყნის დროშა აუცილებელია";
  }
  if (!country_phone_code) {
    errors.country_phone_code = "ქვეყნის სატელოფონო კოდი აუცილებელია";
  }

  if (Object.keys(errors).length > 0) {
    if (req?.file?.path) {
      unlink(req?.file?.path, (err) => {
        if (err) {
          console.log(err);
          res.status(200).json({ errors: errors });
        } else {
          res.status(200).json({ errors: errors });
        }
      });
    } else {
      res.status(200).json({ errors: errors });
    }
  } else {
    const updateCountry = await pool.query(
      `SELECT * FROM countries WHERE id = $1`,
      [req.params.id]
    );
    if (!flag_image_path && updateCountry?.rows?.[0]?.flag_image_path) {
      unlink(updateCountry?.rows?.[0]?.flag_image_path, async (err) => {
        if (err) {
          console.log(err);
        } else {
          const updatedCountry = await pool.query(
            `UPDATE countries SET name_ka = $1, name_en = $2, name_ru = $3, flag_image_path = $4, country_phone_code = $5 WHERE id = ${req.params.id}`,
            [name_ka, name_en, name_ru, req.file.path || flag_image_path, country_phone_code]
          );
          res.status(200).json({
            status: "success",
            data: updatedCountry,
          });
        }
      });
    } else {
      const updatedCountry = await pool.query(
        `UPDATE countries SET name_ka = $1, name_en = $2, name_ru = $3, flag_image_path = $4, country_phone_code = $5 WHERE id = ${req.params.id}`,
        [name_ka, name_en, name_ru, req?.file?.path || flag_image_path, country_phone_code]
      );
      res.status(200).json({
        status: "success",
        data: updatedCountry,
      });
    }
  }
};

// @desc    Delete Country
// @route   DELETE /api/countries/:id
// @access  Private
const deleteCountry = async (req, res) => {
  const deleteCountryImage = await pool.query(
    `SELECT * FROM countries WHERE id = $1`,
    [req.params.id]
  );

  const deleteCountry = await pool.query(
    `DELETE FROM countries WHERE id = ${req.params.id}`
  );

  unlink(deleteCountryImage.rows?.[0]?.flag_image_path, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: "success",
      });
    }
  });
};

module.exports = {
  getCountries,
  getCountry,
  setCountries,
  updateCountry,
  deleteCountry,
};
