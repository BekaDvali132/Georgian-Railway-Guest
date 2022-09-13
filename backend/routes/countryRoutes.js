const express = require("express");
const router = express.Router();
const {
  getCountries,
  setCountries,
  updateCountry,
  deleteCountry,
} = require("../controllers/countryController");
const { check } = require("express-validator");

router.get("/", getCountries);

router.post(
  "/",
  check("name_ka")
  .notEmpty()
  .withMessage("ქვეყნის ქართული სახელი აუცილებელია"),
  setCountries
);

router.put("/:id", updateCountry);

router.delete("/:id", deleteCountry);

module.exports = router;
