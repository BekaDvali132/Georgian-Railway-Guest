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

// @desc    Get Organization Type
// @route   Get /api/organization-type/:id
// @access  Private
const getOrganizationType = async (req, res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  let type = await pool.query("Select * from organization_types where id = $1",[req.params.id]);

  res.status(200).json({
    status: "success",
    data: {
      organization_type: type?.rows?.[0],
    },
  });
};

// @desc    Set Organization type
// @route   POST /api/organization-types
// @access  Private
const setOrganizations = async (req, res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const { name_ka, name_en, name_ru } = req.body;

  let newType = await pool.query("INSERT INTO organization_types (name_ka, name_en, name_ru) VALUES ($1, $2, $3)",[name_ka,name_en,name_ru]);

  res.status(200).json({
    status: "success",
  });

};

// @desc    Update Organization type
// @route   PUT /api/organization-types/:id
// @access  Private
const updateOrganizationType = async (req, res) => {
  errorsObjectFormatter(req, res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const { name_ka, name_en, name_ru } = req.body;

  const updatedType = await pool.query(
    `UPDATE organization_types SET name_ka = $1, name_en = $2, name_ru = $3 WHERE id = ${req.params.id}`,
    [name_ka, name_en, name_ru]
  );

  res.status(200).json({
    status: "success",
    data: updatedType,
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

module.exports = { getOrganizationTypes, deleteOrganizationType, setOrganizations, getOrganizationType, updateOrganizationType};
