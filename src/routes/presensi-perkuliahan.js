const express = require("express");

const router = express.Router();

// import controller
const PresensiPerkuliahanController = require("../controllers/presensi-perkuliahan");

// all routes
router.get("/:id_pertemuan_perkuliahan", PresensiPerkuliahanController.getAllPresensiPerkuliahans);
router.get("/:id/get", PresensiPerkuliahanController.getPresensiPerkuliahanById);
router.post("/:id_pertemuan_perkuliahan/create", PresensiPerkuliahanController.createPresensiPerkuliahan);
router.put("/:id/update", PresensiPerkuliahanController.updatePresensiPerkuliahanById);
router.delete("/:id/delete", PresensiPerkuliahanController.deletePresensiPerkuliahanById);
router.post("/:id_pertemuan_perkuliahan/konfirmasi-presensi", PresensiPerkuliahanController.konfirmasiPresensi);

module.exports = router;
