const express = require("express");

const router = express.Router();

// import controller
const KhsMahasiswaController = require("../controllers/khs-mahasiswa");

// all routes
router.get("/", KhsMahasiswaController.getAllKhsMahasiswas);
router.get("/:id/get", KhsMahasiswaController.getKhsMahasiswaById);
router.post("/create", KhsMahasiswaController.createKhsMahasiswa);
router.put("/:id/update", KhsMahasiswaController.updateKhsMahasiswaById);
router.delete("/:id/delete", KhsMahasiswaController.deleteKhsMahasiswaById);

module.exports = router;
