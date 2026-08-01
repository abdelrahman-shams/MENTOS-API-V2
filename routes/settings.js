const express = require("express");

const router = express.Router();

const controller = require("../controllers/settingsController");

router.get("/key", controller.getKey);

router.put("/key", controller.updateKey);

module.exports = router;