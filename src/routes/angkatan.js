const express = require("express");

const router = express.Router();

// import controller dan middleware
const AngkatanController = require("../controllers/angkatan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "dosen", "mahasiswa", "admin-keuangan"]), AngkatanController.getAllAngkatan);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen"]), AngkatanController.getAngkatanById);
router.post("/create", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen"]), AngkatanController.createAngkatan);
router.put("/:id/update", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen"]), AngkatanController.updateAngkatanById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen"]), AngkatanController.deleteAngkatanById);

module.exports = router;
