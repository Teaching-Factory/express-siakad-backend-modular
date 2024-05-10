const express = require("express");

const router = express.Router();

// import controller dan middleware
const AgamaController = require("../controllers/agama");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), AgamaController.getAllAgamas);
router.get("/:id/get", checkRole(["admin"]), AgamaController.getAgamaById);
// router.post("/create", AgamaController.createAgama);
// router.put("/:id/update", AgamaController.updateAgamaById);
// router.delete("/:id/delete", AgamaController.deleteAgamaById);

module.exports = router;
