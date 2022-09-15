const express = require("express");
const {upload} = require('../functions/imageUpload');
const router = express.Router();
const multer = require('multer');
const read = multer();

const {
  getCountries,
  getCountry,
  setCountries,
  updateCountry,
  deleteCountry,
} = require("../controllers/countryController");
const { check } = require("express-validator");

router.get("/", getCountries);

router.get("/:id", getCountry);

router.post(
  "/",
  upload.single('flag_image')
  ,
  setCountries
);

router.put(
  "/:id",
  upload.single('flag_image'),
  updateCountry
);

router.delete(
  "/:id", deleteCountry
);

module.exports = router;
