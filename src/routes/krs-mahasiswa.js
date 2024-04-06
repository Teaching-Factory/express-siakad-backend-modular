const express = require("express");

const router = express.Router();

// import controller
const KrsMahasiswaController = require("../controllers/krs-mahasiswa");

// all routes
router.get("/", KrsMahasiswaController.getAllKrsMahasiswas);
router.get("/:id/get", KrsMahasiswaController.getKrsMahasiswaById);
router.post("/create", KrsMahasiswaController.createKrsMahasiswa);
router.put("/:id/update", KrsMahasiswaController.updateKrsMahasiswaById);
router.delete("/:id/delete", KrsMahasiswaController.deleteKrsMahasiswaById);

module.exports = router;
