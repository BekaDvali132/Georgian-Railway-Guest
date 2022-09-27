const express = require("express");
const router = express.Router();
const { protect, protectUser } = require("../middleware/authMiddleware");
const { check } = require("express-validator");
const pool = require("../database/db");

const {getOrganizationTypes, deleteOrganizationType} = require('../controllers/organizationTypeController');

router.get('/', getOrganizationTypes)

router.delete('/:id', protect,deleteOrganizationType)

module.exports = router