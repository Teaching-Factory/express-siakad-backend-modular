const express = require("express");

const router = express.Router();

// import controller dan middleware
const JenisEvaluasiController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), JenisEvaluasiController.getAllJenisEvaluasi);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), JenisEvaluasiController.getJenisEvaluasiById);
router.get("/for-rencana-evaluasi", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), JenisEvaluasiController.getJenisEvaluasiForRencanaEvaluasi);

module.exports = router;
