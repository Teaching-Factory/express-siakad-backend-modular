const express = require("express");

const router = express.Router();

// import controller dan middleware
const BobotPenilaianController = require("../controllers/bobot-penilaian");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), BobotPenilaianController.getAllBobotPenilaian);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), BobotPenilaianController.getBobotPenilaianById);
router.post("/create", checkRole(["admin", "admin-prodi"]), BobotPenilaianController.createBobotPenilaian);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), BobotPenilaianController.updateBobotPenilaianById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), BobotPenilaianController.deleteBobotPenilaianById);
router.get("/prodi/:id_prodi/get", checkRole(["admin", "admin-prodi", "dosen"]), BobotPenilaianController.getBobotPenilaianByProdiId);

module.exports = router;
