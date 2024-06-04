const express = require("express");

const router = express.Router();

// import controller dan middleware
const PertemuanPerkuliahanController = require("../controllers/pertemuan-perkuliahan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/kelas-kuliah/:id_kelas_kuliah/get", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.getAllPertemuanPerkuliahanByKelasKuliahId);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.getPertemuanPerkuliahanById);
router.post("/:id_kelas_kuliah/create", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.createPertemuanPerkuliahanByKelasKuliahId);
router.put("/:id/update", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.updatePertemuanPerkuliahanById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.deletePertemuanPerkuliahanById);
router.put("/:id/lock-enable", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.lockEnablePertemuanPerkuliahanById);
router.put("/:id/lock-disable", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.lockDisablePertemuanPerkuliahanById);

module.exports = router;
