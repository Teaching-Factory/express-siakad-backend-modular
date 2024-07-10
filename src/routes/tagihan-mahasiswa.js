const express = require("express");

const router = express.Router();

// import controller dan middleware
const TagihanMahasiswaController = require("../controllers/tagihan-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-keuangan", "mahasiswa"]), TagihanMahasiswaController.getAllTagihanMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-keuangan", "mahasiswa"]), TagihanMahasiswaController.getTagihanMahasiswaById);
router.get("/mahasiswa/:id_registrasi_mahasiswa/get", checkRole(["admin", "admin-keuangan", "mahasiswa"]), TagihanMahasiswaController.getTagihanMahasiswaByMahasiswaId);
router.post("/create", checkRole(["admin", "admin-keuangan", "mahasiswa"]), TagihanMahasiswaController.createTagihanMahasiswa);
router.put("/:id/update", checkRole(["admin", "admin-keuangan", "mahasiswa"]), TagihanMahasiswaController.updateTagihanMahasiswaById);
router.delete("/:id/delete", checkRole(["admin", "admin-keuangan", "mahasiswa"]), TagihanMahasiswaController.deleteTagihanMahasiswaById);
router.get("/get-tagihan-by-mahasiswa-active", checkRole(["mahasiswa"]), TagihanMahasiswaController.getAllTagihanMahasiswaByMahasiswaActive);
router.get("/get-tagihan-mahasiswa-by-filter", checkRole(["admin", "admin-keuangan"]), TagihanMahasiswaController.getAllTagihanMahasiswaByFilter);
router.post("/create-tagihan-mahasiswa-kolektif", checkRole(["admin", "admin-keuangan"]), TagihanMahasiswaController.createTagihanMahasiswaKolektif);

module.exports = router;
