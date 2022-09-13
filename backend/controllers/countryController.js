const { validationResult } = require("express-validator");
const pool = require("../database/db");

// @desc    Get Countries
// @route   GET /api/countries
// @access  Private
const getCountries = async (req, res) => {
  const countries = await pool.query("SELECT * from countries ORDER BY created_at");

  res.status(200).json({
    status: "success",
    data: countries?.rows,
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }

  const { name_ka, name_en, name_ru, flag_image_path, country_phone_code } =
    req.body;

  const newCountry = await pool.query(
    "INSERT INTO countries (name_ka, name_en, name_ru, flag_image_path, country_phone_code) VALUES ($1, $2, $3, $4, $5)",
    [name_ka, name_en, name_ru, flag_image_path, country_phone_code]
  );

  res.status(200).json({
    message: "success",
    country: newCountry,
  });
};

// @desc    Update Country
// @route   PUT /api/countries/:id
// @access  Private
const updateCountry = async (req, res) => {
  try {
    const { name_ka, name_en, name_ru, flag_image_path, country_phone_code } =
      req.body;

    const updatedCountry = await pool.query(
      `UPDATE countries SET name_ka = $1, name_en = $2, name_ru = $3, flag_image_path = $4, country_phone_code = $5 WHERE id = ${req.params.id}`,
      [name_ka, name_en, name_ru, flag_image_path, country_phone_code]
    );

    res.status(200).json({
      status: "success",
      data: updatedCountry,
    });
  } catch (error) {
    console.error(error);
  }
};

// @desc    Delete Country
// @route   DELETE /api/countries/:id
// @access  Private
const deleteCountry = async (req, res) => {
    try {
        const { name_ka, name_en, name_ru, flag_image_path, country_phone_code } =
      req.body;

      const deleteCountry = await pool.query(
        `DELETE FROM countries WHERE id = ${req.params.id}`
      );

        res.status(200).json({
            status: 'success',
            message: `Delete Country ${req.params.id}`,
          });

    } catch (error) {
        console.error(error)
    }

};

module.exports = {
  getCountries,
  getCountry,
  setCountries,
  updateCountry,
  deleteCountry,
};
