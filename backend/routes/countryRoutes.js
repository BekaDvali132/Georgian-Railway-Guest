const express = require("express");
const { upload } = require("../functions/imageUpload");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCountries,
  getCountry,
  setCountries,
  updateCountry,
  deleteCountry,
} = require("../controllers/countryController");

router.get("/", protect, getCountries);

router.get("/:id", protect, getCountry);

router.post("/", protect, upload.single("flag_image"), setCountries);

router.put("/:id", protect, upload.single("flag_image"), updateCountry);

router.delete("/:id", protect, deleteCountry);

module.exports = router;
