const express = require("express");

const router = express.Router();

// import controller dan middleware
const AspekPenilaianDosenController = require("../controllers/aspek-penilaian-dosen");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), AspekPenilaianDosenController.getAllAspekPenilaianDosen);
router.get("/semester/:id_semester/get", checkRole(["admin", "admin-prodi"]), AspekPenilaianDosenController.getAllAspekPenilaianDosenBySemesterId);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), AspekPenilaianDosenController.getAspekPenilaianDosenById);
router.post("/create", checkRole(["admin", "admin-prodi"]), AspekPenilaianDosenController.createAspekPenilaianDosen);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), AspekPenilaianDosenController.updateAspekPenilaianDosenById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), AspekPenilaianDosenController.deleteAspekPenilaianDosenById);

module.exports = router;
