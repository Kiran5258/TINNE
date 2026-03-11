const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middlware");
const { getHeroImages, updateHeroImages } = require("../controller/hero.controller");

router.get("/", getHeroImages);
router.put("/", protect, isAdmin, updateHeroImages);

module.exports = router;
