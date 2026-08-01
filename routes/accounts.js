const express = require("express");

const router = express.Router();

const controller = require("../controllers/accountsController");

router.get("/", controller.getAccounts);
router.post("/", controller.addAccount);
router.put("/:id", controller.updateAccount);
router.delete("/:id", controller.deleteAccount);

module.exports = router;