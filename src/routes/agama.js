const express = require("express");

const router = express.Router();

// import controller
const AgamaController = require("../controllers/agama");

// all routes
router.get("/", AgamaController.getAllAgamas);
router.get("/:id/get", AgamaController.getAgamaById);
router.post("/create", AgamaController.createAgama);
router.put("/:id/update", AgamaController.updateAgamaById);
router.delete("/:id/delete", AgamaController.deleteAgamaById);

module.exports = router;
