const express = require("express");

const router = express.Router();

// import controller
const NilaiPerkuliahanController = require("../controllers/nilai-perkuliahan");

// all routes
router.get("/matakuliah/:id_kelas_dan_jadwal/", NilaiPerkuliahanController.getAllNilaiPerkuliahanByIdKelas);
router.get("/mahasiswa/:id_mahasiswa/", NilaiPerkuliahanController.getAllNilaiPerkuliahanByIdMahasiswa);
router.post("/:id_kelas_dan_jadwal/create", NilaiPerkuliahanController.createNilaiPerkuliahan);
router.put("/:id/update", NilaiPerkuliahanController.updateNilaiPerkuliahanById);
router.delete("/:id/delete", NilaiPerkuliahanController.deleteNilaiPerkuliahanById);

module.exports = router;
