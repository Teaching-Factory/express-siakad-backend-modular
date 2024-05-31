const express = require("express");

const router = express.Router();

// import controller dan middleware
const DosenPengajarKelasKuliahController = require("../controllers/dosen-pengajar-kelas-kuliah");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/:id_kelas_kuliah/get", checkRole(["admin", "admin-prodi"]), DosenPengajarKelasKuliahController.getAllDosenPengajarKelasKuliahByIdKelasKuliah);
router.post("/:id_kelas_kuliah/create", checkRole(["admin", "admin-prodi"]), DosenPengajarKelasKuliahController.createDosenPengajarKelasKuliah);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), DosenPengajarKelasKuliahController.updateDosenPengajarKelasKuliahById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), DosenPengajarKelasKuliahController.deleteDosenPengajarKelasKuliahById);

module.exports = router;
