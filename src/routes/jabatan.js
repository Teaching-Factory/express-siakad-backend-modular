const express = require("express");

const router = express.Router();

// import controller
const JabatanController = require("../controllers/jabatan");

// all routes
router.get("/get-jabatans", JabatanController.getAllJabatans);
router.get("/get-jabatan/:id", JabatanController.getJabatanById);
router.post("/create-jabatan", JabatanController.createJabatan);
router.put("/update-jabatan/:id", JabatanController.updateJabatanById);
router.delete("/delete-jabatan/:id", JabatanController.deleteJabatanById);

module.exports = router;
