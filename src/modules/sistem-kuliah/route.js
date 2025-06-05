const express = require("express");

const router = express.Router();

// import controller dan middleware
const SistemKuliahController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "camaba", "admin-pmb"]), SistemKuliahController.getAllSistemKuliah);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "camaba", "admin-pmb"]), SistemKuliahController.getSistemKuliahById);
router.get("/filter/:id_prodi/:id_sistem_kuliah/get", checkRole(["admin", "admin-prodi"]), SistemKuliahController.getSistemKuliahMahasiswaByProdiAndSistemKuliahId);
router.post("/create", checkRole(["admin", "admin-prodi"]), SistemKuliahController.createSistemKuliah);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), SistemKuliahController.updateSistemKuliahById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), SistemKuliahController.deleteSistemKuliahById);
router.get("/get-mahasiswa-belum-set-sk", checkRole(["admin", "admin-prodi"]), SistemKuliahController.getAllMahasiswaBelumSetSK);

module.exports = router;
