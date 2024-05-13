const express = require("express");

const router = express.Router();

// import controller dan middleware
const StatusMahasiswaController = require("../controllers/status-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), StatusMahasiswaController.getAllStatusMahasiswa);
router.get("/:id/get", checkRole(["admin"]), StatusMahasiswaController.getStatusMahasiswaById);
// router.put("/:id/update", StatusMahasiswaController.updateStatusMahasiswa); // set status mahasiswa
// router.put("/:id_prodi/non-aktif", StatusMahasiswaController.updateAllStatusNonAktif); // set seluruh status mahasiswa non-aktif

module.exports = router;
