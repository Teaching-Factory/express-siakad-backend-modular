const express = require("express");

const router = express.Router();

// import controller
const AgamaController = require("../controllers/agama");

// all routes
router.get("/get-agamas", AgamaController.getAllAgamas);
router.get("/get-agama/:id", AgamaController.getAgamaById);
router.post("/create-agama", AgamaController.createAgama);
router.put("/update-agama/:id", AgamaController.updateAgamaById);
router.delete("/delete-agama/:id", AgamaController.deleteAgamaById);

module.exports = router;
