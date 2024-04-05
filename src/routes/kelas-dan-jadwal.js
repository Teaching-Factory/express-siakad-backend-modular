const express = require("express");

const router = express.Router();

// import controller
const KelasDanJadwalController = require("../controllers/kelas-dan-jadwal");

// all routes
router.get("/", KelasDanJadwalController.getAllKelasDanJadwals);
router.get("/:id/get", KelasDanJadwalController.getKelasDanJadwalById);
router.post("/create", KelasDanJadwalController.createKelasDanJadwal);
router.put("/:id/update", KelasDanJadwalController.updateKelasDanJadwalById);
router.delete("/:id/delete", KelasDanJadwalController.deleteKelasDanJadwalById);

module.exports = router;
