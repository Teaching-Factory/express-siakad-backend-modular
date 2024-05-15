const express = require("express");

const router = express.Router();

// import controller dan middleware
const KrsMahasiswaController = require("../controllers/krs-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.getAllKRSMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.getKRSMahasiswaById);
router.get("/mahasiswa/:id_registrasi_mahasiswa/get", checkRole(["admin", "admin-prodi"]), KrsMahasiswaController.getKRSMahasiswaByMahasiswaId);

// router.post("/create", KrsMahasiswaController.createKrsMahasiswa);
// router.put("/:id/update", KrsMahasiswaController.updateKrsMahasiswaById);
// router.delete("/:id/delete", KrsMahasiswaController.deleteKrsMahasiswaById);
// router.get("/belum-krs", KrsMahasiswaController.getAllMahasiswaBelumKrs);

module.exports = router;
