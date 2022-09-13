const express = require("express");
const router = express.Router();
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
  check(["name_ka", "name_en", "name_ru"])
    .notEmpty()
    .withMessage("ქვეყნის სახელი აუცილებელია"),
  check("flag_image_path").notEmpty().withMessage("ქვეყნის დროშა აუცილებელია"),
  check("country_phone_code")
    .isNumeric()
    .withMessage("ქვეყნის სატელოფონო კოდის ფორმატი არასწორია")
    .notEmpty()
    .withMessage("ქვეყნის სატელოფონო კოდი აუცილებელია"),
  setCountries
);

router.put(
  "/:id",
  check(["name_ka", "name_en", "name_ru"])
    .notEmpty()
    .withMessage("ქვეყნის სახელი აუცილებელია"),
  check("flag_image_path").notEmpty().withMessage("ქვეყნის დროშა აუცილებელია"),
  check("country_phone_code")
    .isNumeric()
    .withMessage("ქვეყნის სატელოფონო კოდის ფორმატი არასწორია")
    .notEmpty()
    .withMessage("ქვეყნის სატელოფონო კოდი აუცილებელია"),
  updateCountry
);

router.delete(
  "/:id", deleteCountry
);

module.exports = router;
