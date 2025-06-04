const express = require("express");

const router = express.Router();

// import controller
const JenjangPendidikanController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen", "mahasiswa", "camaba", "admin-pmb"]), JenjangPendidikanController.getAllJenjangPendidikan);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen", "mahasiswa", "camaba", "admin-pmb"]), JenjangPendidikanController.getJenjangPendidikanById);

module.exports = router;
