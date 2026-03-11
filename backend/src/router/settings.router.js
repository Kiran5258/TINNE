const express = require('express');
const { getSettings, updateSettings } = require("../controller/settings.controller.js");

const router = express.Router();

router.get("/", getSettings);
router.put("/", updateSettings);


module.exports = router;