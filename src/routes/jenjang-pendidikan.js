const express = require("express");

const router = express.Router();

// import controller
const JenjangPendidikanController = require("../controllers/jenjang-pendidikan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen", "mahasiswa"]), JenjangPendidikanController.getAllJenjangPendidikan);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen", "mahasiswa"]), JenjangPendidikanController.getJenjangPendidikanById);

module.exports = router;
