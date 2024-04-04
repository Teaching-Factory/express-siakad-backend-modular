const express = require("express");

const router = express.Router();

// import controller
const ProdiController = require("../controllers/prodi");

// all routes
router.get("/get-prodis", ProdiController.getAllProdis);
router.get("/get-prodi/:id", ProdiController.getProdiById);
router.post("/create-prodi", ProdiController.createProdi);
router.put("/update-prodi/:id", ProdiController.updateProdiById);
router.delete("/delete-prodi/:id", ProdiController.deleteProdiById);

module.exports = router;
