const { errorsObjectFormatter } = require("../middleware/errorsFormatter");
const { validationResult } = require("express-validator");
const pool = require("../database/db");

// @desc    Get Organization Types
// @route   Get /api/organization-types
// @access  Private
const getOrganizationTypes = async (req, res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  let types = await pool.query("Select * from organization_types");

  res.status(200).json({
    status: "success",
    data: {
      organization_types: types?.rows,
    },
  });
};

// @desc    Delete Organization type
// @route   DELETE /api/organization-types/:id
// @access  Private
const deleteOrganizationType = async (req, res) => {
  const deleteCountry = await pool.query(
    `DELETE FROM organization_types WHERE id = ${req.params.id}`
  );

  res.status(200).json({
    status: "success",
  });
};

module.exports = { getOrganizationTypes, deleteOrganizationType };
