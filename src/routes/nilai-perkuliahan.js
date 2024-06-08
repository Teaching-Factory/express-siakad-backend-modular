const express = require("express");

const router = express.Router();

// import controller dan middleware
const NilaiPerkuliahanController = require("../controllers/nilai-perkuliahan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/matakuliah/:id_kelas_dan_jadwal/", checkRole(["admin", "admin-prodi"]), NilaiPerkuliahanController.getAllNilaiPerkuliahanByIdKelas);
router.get("/mahasiswa/:id_mahasiswa/", checkRole(["admin", "admin-prodi"]), NilaiPerkuliahanController.getAllNilaiPerkuliahanByIdMahasiswa);
router.post("/:id_kelas_dan_jadwal/create", checkRole(["admin", "admin-prodi"]), NilaiPerkuliahanController.createNilaiPerkuliahan);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), NilaiPerkuliahanController.updateNilaiPerkuliahanById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), NilaiPerkuliahanController.deleteNilaiPerkuliahanById);

module.exports = router;
