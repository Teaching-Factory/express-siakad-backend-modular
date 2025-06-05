const express = require("express");

const router = express.Router();

// import controller
const KurikulumController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), KurikulumController.getAllKurikulum);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), KurikulumController.getKurikulumById);
router.get("/prodi/:id_prodi/get", checkRole(["admin", "admin-prodi", "dosen", "mahasiswa"]), KurikulumController.getKurikulumByProdiId);

module.exports = router;
