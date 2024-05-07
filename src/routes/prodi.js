const express = require("express");

const router = express.Router();

// import controller
const ProdiController = require("../controllers/prodi");

// all routes
router.get("/", ProdiController.getAllProdi);
router.get("/:id/get", ProdiController.getProdiById);
// router.post("/create", ProdiController.createProdi);
// router.put("/:id/update", ProdiController.updateProdiById);
// router.delete("/:id/delete", ProdiController.deleteProdiById);

module.exports = router;
