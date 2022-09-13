const {validationResult} = require('express-validator')

// @desc    Get Countries
// @route   GET /api/countries
// @access  Private
const getCountries = (req,res) => {
    res.status(200).json({
        message: 'Get Countries'
    })
};

// @desc    Set Countries
// @route   POST /api/countries
// @access  Private
const setCountries = (req,res) => {

    const {name_ka, name_en, name_ru, country_flag, country_phone_code} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ errors: errors.array() });
    }

    res.status(200).json({
        message: 'Set Countries'
    })
};

// @desc    Update Country
// @route   PUT /api/countries/:id
// @access  Private
const updateCountry = (req,res) => {
    res.status(200).json({
        message: `Update Country ${req.params.id}`
    })
};
// @desc    Delete Country
// @route   DELETE /api/countries/:id
// @access  Private
const deleteCountry = (req,res) => {
    res.status(200).json({
        message: `Delete Country ${req.params.id}`
    })
};

module.exports = {
    getCountries,
    setCountries,
    updateCountry,
    deleteCountry
};