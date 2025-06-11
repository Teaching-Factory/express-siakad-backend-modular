const express = require("express");

const router = express.Router();

// import controller dan middleware
const RencanaEvaluasiController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), RencanaEvaluasiController.getAllRencanaEvaluasi);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), RencanaEvaluasiController.getRencanaEvaluasiById);
router.get("/mata-kuliah/:id_matkul/get", checkRole(["admin", "admin-prodi"]), RencanaEvaluasiController.getRencanaEvaluasiByMataKuliahId);
router.post("/mata-kuliah/:id_matkul/create", checkRole(["admin", "admin-prodi"]), RencanaEvaluasiController.createOrUpdateRencanaEvaluasi);
router.delete("/:id_rencana_evaluasi/delete", checkRole(["admin", "admin-prodi"]), RencanaEvaluasiController.deleteRencanaEvaluasiById);

module.exports = router;
