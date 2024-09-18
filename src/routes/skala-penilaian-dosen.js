const express = require("express");

const router = express.Router();

// import controller dan middleware
const SkalaPenilaianDosenController = require("../controllers/skala-penilaian-dosen");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), SkalaPenilaianDosenController.getAllSkalaPenilaianDosen);
router.get("/semester/:id_semester/get", checkRole(["admin", "admin-prodi"]), SkalaPenilaianDosenController.getAllSkalaPenilaianDosenBySemesterId);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), SkalaPenilaianDosenController.getSkalaPenilaianDosenById);
router.post("/create", checkRole(["admin", "admin-prodi"]), SkalaPenilaianDosenController.createSkalaPenilaianDosen);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), SkalaPenilaianDosenController.updateSkalaPenilaianDosenById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), SkalaPenilaianDosenController.deleteSkalaPenilaianDosenById);

module.exports = router;
