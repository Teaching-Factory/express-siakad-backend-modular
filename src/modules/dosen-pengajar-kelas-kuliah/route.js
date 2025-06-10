const express = require("express");

const router = express.Router();

// import controller dan middleware
const DosenPengajarKelasKuliahController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/:id_kelas_kuliah/get", checkRole(["admin", "admin-prodi"]), DosenPengajarKelasKuliahController.getAllDosenPengajarKelasKuliahByIdKelasKuliah);
router.get("/:id/get-dosen-pengajar-kelas-kuliah", checkRole(["admin", "admin-prodi"]), DosenPengajarKelasKuliahController.getDosenPengajarKelasKuliahById);
router.post("/:id_kelas_kuliah/create", checkRole(["admin", "admin-prodi"]), DosenPengajarKelasKuliahController.createDosenPengajarKelasKuliah);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), DosenPengajarKelasKuliahController.updateDosenPengajarKelasKuliahById);
router.put("/set-ketua-kelas/:id_kelas_kuliah/:id_aktivitas_mengajar/update", checkRole(["admin", "admin-prodi"]), DosenPengajarKelasKuliahController.setKetuaDosenPengajarByKelasKuliahId);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), DosenPengajarKelasKuliahController.deleteDosenPengajarKelasKuliahById);

module.exports = router;
