const express = require("express");

const router = express.Router();

// import controller
const PertemuanPerkuliahanController = require("../controllers/pertemuan-perkuliahan");

// all routes
router.get("/:id_kelas_dan_jadwal", PertemuanPerkuliahanController.getAllPertemuanPerkuliahans);
router.get("/:id/get", PertemuanPerkuliahanController.getPertemuanPerkuliahanById);
router.post("/:id_kelas_dan_jadwal/create", PertemuanPerkuliahanController.createPertemuanPerkuliahan);
router.put("/:id/update", PertemuanPerkuliahanController.updatePertemuanPerkuliahanById);
router.delete("/:id/delete", PertemuanPerkuliahanController.deletePertemuanPerkuliahanById);

module.exports = router;
