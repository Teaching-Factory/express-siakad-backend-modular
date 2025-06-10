const express = require("express");

const router = express.Router();

// import controller dan middleware
const PertemuanPerkuliahanController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/kelas-kuliah/:id_kelas_kuliah/get", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.getAllPertemuanPerkuliahanByKelasKuliahId);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.getPertemuanPerkuliahanById);
router.get("/filter/:id_semester/:id_prodi/:id_kelas_kuliah/get", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.getPertemuanPerkuliahanBySemesterProdiAndKelasKuliahId);
router.post("/:id_kelas_kuliah/create", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.createPertemuanPerkuliahanByKelasKuliahId);
router.put("/:id/update", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.updatePertemuanPerkuliahanById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.deletePertemuanPerkuliahanById);
router.put("/:id/lock-enable", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.lockEnablePertemuanPerkuliahanById);
router.put("/:id/lock-disable", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.lockDisablePertemuanPerkuliahanById);
router.put("/open-pertemuan-perkuliahan", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.openPertemuanPerkuliahan);
router.put("/:id/close-pertemuan-perkuliahan", checkRole(["admin", "admin-prodi", "dosen"]), PertemuanPerkuliahanController.closePertemuanPerkuliahanById);
router.get("/get-pertemuan-perkuliahan-aktif-by-dosen", checkRole(["dosen"]), PertemuanPerkuliahanController.getAllPertemuanPerkuliahanActiveByDosen);
router.get("/get-pertemuan-perkuliahan-aktif-by-mahasiswa", checkRole(["mahasiswa"]), PertemuanPerkuliahanController.getAllPertemuanPerkuliahanActiveByMahasiswa);

module.exports = router;
