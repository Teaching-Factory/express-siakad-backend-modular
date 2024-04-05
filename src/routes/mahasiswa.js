const express = require("express");

const router = express.Router();

// import controller
const MahasiswaController = require("../controllers/mahasiswa");

// all routes
router.get("/", MahasiswaController.getAllMahasiswas);
router.get("/:id/get", MahasiswaController.getMahasiswaById);
router.post("/create", MahasiswaController.createMahasiswa);
router.put("/:id/update", MahasiswaController.updateMahasiswaById);
router.delete("/:id/delete", MahasiswaController.deleteMahasiswaById);

module.exports = router;
