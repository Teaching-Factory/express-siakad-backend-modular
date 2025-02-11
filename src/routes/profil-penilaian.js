const express = require("express");

const router = express.Router();

// import controller dan middleware
const ProfilPenilaianController = require("../controllers/profil-penilaian");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), ProfilPenilaianController.getAllProfilPenilaian);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), ProfilPenilaianController.getProfilPenilaianById);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), ProfilPenilaianController.updateProfilPenilaianById);

module.exports = router;
