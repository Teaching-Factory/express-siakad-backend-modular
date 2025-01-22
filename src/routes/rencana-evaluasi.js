const express = require("express");

const router = express.Router();

// import controller dan middleware
const RencanaEvaluasiController = require("../controllers/rencana-evaluasi");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), RencanaEvaluasiController.getAllRencanaEvaluasi);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), RencanaEvaluasiController.getRencanaEvaluasiById);
router.get("/mata-kuliah/:id_matkul/get", checkRole(["admin", "admin-prodi"]), RencanaEvaluasiController.getRencanaEvaluasiByMataKuliahId);
router.post("/mata-kuliah/:id_matkul/create", checkRole(["admin", "admin-prodi"]), RencanaEvaluasiController.createOrUpdateRencanaEvaluasi);

module.exports = router;
