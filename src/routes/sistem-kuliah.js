const express = require("express");

const router = express.Router();

// import controller dan middleware
const SistemKuliahController = require("../controllers/sistem-kuliah");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), SistemKuliahController.getAllSistemKuliah);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), SistemKuliahController.getSistemKuliahById);
router.post("/create", checkRole(["admin", "admin-prodi"]), SistemKuliahController.createSistemKuliah);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), SistemKuliahController.updateSistemKuliahById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), SistemKuliahController.deleteSistemKuliahById);
router.get("/get-mahasiswa-belum-set-sk", checkRole(["admin", "admin-prodi"]), SistemKuliahController.getAllMahasiswaBelumSetSK);

module.exports = router;
