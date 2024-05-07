const express = require("express");

const router = express.Router();

// import controller
const KrsMahasiswaController = require("../controllers/krs-mahasiswa");

// all routes
router.get("/", KrsMahasiswaController.getAllKRSMahasiswa);
router.get("/:id/get", KrsMahasiswaController.getKRSMahasiswaById);
// router.post("/create", KrsMahasiswaController.createKrsMahasiswa);
// router.put("/:id/update", KrsMahasiswaController.updateKrsMahasiswaById);
// router.delete("/:id/delete", KrsMahasiswaController.deleteKrsMahasiswaById);
// router.get("/belum-krs", KrsMahasiswaController.getAllMahasiswaBelumKrs);

module.exports = router;
