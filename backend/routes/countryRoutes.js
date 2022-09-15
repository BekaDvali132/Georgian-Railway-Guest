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
  check(["name_ka", "name_en", "name_ru"])
    .notEmpty()
    .withMessage("ქვეყნის სახელი აუცილებელია"),
  check("flag_image_path").notEmpty().withMessage("ქვეყნის დროშა აუცილებელია"),
  check("country_phone_code")
    .notEmpty()
    .withMessage("ქვეყნის სატელოფონო კოდი აუცილებელია")
    .isNumeric()
    .withMessage("ქვეყნის სატელოფონო კოდის ფორმატი არასწორია"),
  updateCountry
);

router.delete(
  "/:id", deleteCountry
);

module.exports = router;
