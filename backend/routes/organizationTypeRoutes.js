const express = require("express");
const router = express.Router();
const { protect, protectUser } = require("../middleware/authMiddleware");
const { check } = require("express-validator");
const pool = require("../database/db");

const {
  getOrganizationTypes,
  deleteOrganizationType,
  setOrganizations,
  getOrganizationType,
  updateOrganizationType,
} = require("../controllers/organizationTypeController");

router.get("/", getOrganizationTypes).post(
  "/",
  protect,
  check(["name_ka", "name_en", "name_ru"])
    .notEmpty()
    .withMessage("დასახელება აუცილებელია"),
  check("name_ka").custom(async (value) => {
    let typeExists = await pool.query(
      "Select * from organization_types WHERE name_ka = $1",
      [value]
    );

    if (typeExists?.rows?.[0]) {
      return Promise.reject("დასახელება დაკავებულია");
    }
  }),
  check("name_en").custom(async (value) => {
    let typeExists = await pool.query(
      "Select * from organization_types WHERE name_en = $1",
      [value]
    );

    if (typeExists?.rows?.[0]) {
      return Promise.reject("დასახელება დაკავებულია");
    }
  }),
  check("name_ru").custom(async (value) => {
    let typeExists = await pool.query(
      "Select * from organization_types WHERE name_ru = $1",
      [value]
    );

    if (typeExists?.rows?.[0]) {
      return Promise.reject("დასახელება დაკავებულია");
    }
  }),
  setOrganizations
);

router
  .delete("/:id", protect, deleteOrganizationType)
  .get("/:id", protect, getOrganizationType)
  .put(
    "/:id",
    protect,
    check(["name_ka", "name_en", "name_ru"])
      .notEmpty()
      .withMessage("დასახელება აუცილებელია"),
      check("name_ka").custom(async (value,{req}) => {
        let typeExists = await pool.query(
          "Select * from organization_types WHERE id != $1 AND name_ka = $2",
          [req?.params?.id, value]
        );
    
        if (typeExists?.rows?.[0]) {
          return Promise.reject("დასახელება დაკავებულია");
        }
      }),
      check("name_en").custom(async (value,{req}) => {
        let typeExists = await pool.query(
          "Select * from organization_types WHERE id != $1 AND name_en = $2",
          [req?.params?.id, value]
        );
    
        if (typeExists?.rows?.[0]) {
          return Promise.reject("დასახელება დაკავებულია");
        }
      }),
      check("name_ru").custom(async (value,{req}) => {
        let typeExists = await pool.query(
          "Select * from organization_types WHERE id != $1 AND name_ru = $2",
          [req?.params?.id, value]
        );
    
        if (typeExists?.rows?.[0]) {
          return Promise.reject("დასახელება დაკავებულია");
        }
      }),
    updateOrganizationType
  );

module.exports = router;
