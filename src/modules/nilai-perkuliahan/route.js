const express = require("express");
const multer = require("multer");

const router = express.Router();

// import controller dan middleware
const NilaiPerkuliahanController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// Setup multer for file upload
const upload = multer({ dest: "uploads/" });

// all routes
router.get("/:id_kelas_kuliah/get-peserta-kelas", checkRole(["admin", "admin-prodi", "dosen"]), NilaiPerkuliahanController.getPesertaKelasKuliahByKelasKuliahId);
router.post("/:id_kelas_kuliah/penilaian-detail-perkuliahan-kelas", checkRole(["admin", "admin-prodi", "dosen"]), NilaiPerkuliahanController.createOrUpdatePenilaianByKelasKuliahId);
router.post("/:id_kelas_kuliah/import-nilai-perkuliahan", checkRole(["admin", "admin-prodi", "dosen"]), upload.single("file"), NilaiPerkuliahanController.importNilaiPerkuliahan);
router.get("/get-nilai-perkuliahan-by-filter", checkRole(["admin", "admin-prodi", "dosen"]), NilaiPerkuliahanController.getRekapNilaiPerkuliahanByFilter);

// export endpoint
router.get("/export-peserta-kelas/:id_kelas_kuliah/get", checkRole(["admin", "admin-prodi", "dosen"]), upload.single("file"), NilaiPerkuliahanController.exportPesertaKelasByKelasKuliahId);

module.exports = router;
