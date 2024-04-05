const express = require("express");

const router = express.Router();

// import controller
const SistemKuliahController = require("../controllers/sistem-kuliah");

// all routes
router.get("/", SistemKuliahController.getAllSistemKuliahs);
router.get("/:id/get", SistemKuliahController.getSistemKuliahById);
router.post("/create", SistemKuliahController.createSistemKuliah);
router.put("/:id/update", SistemKuliahController.updateSistemKuliahById);
router.delete("/:id/delete", SistemKuliahController.deleteSistemKuliahById);

module.exports = router;
