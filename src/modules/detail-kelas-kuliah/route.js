const express = require("express");

const router = express.Router();

// import controller dan middleware
const DetailKelasKuliahController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "dosen"]), DetailKelasKuliahController.getAllDetailKelasKuliah);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "dosen"]), DetailKelasKuliahController.getDetailKelasKuliahById);
router.get("/filter/:id_prodi/:id_semester/get", checkRole(["admin", "admin-prodi", "dosen"]), DetailKelasKuliahController.getDetailKelasKuliahByProdiAndSemesterId);
router.get("/filtering/:id_prodi/:id_semester/:id_kurikulum/:semester/get", checkRole(["admin", "admin-prodi", "dosen"]), DetailKelasKuliahController.getDetailKelasKuliahByFilter);
router.get("/:id_semester/get-kelas-kuliah-dosen", checkRole(["admin", "admin-prodi", "dosen"]), DetailKelasKuliahController.getAllDetailKelasKuliahBySemesterAndDosenActive);

module.exports = router;
