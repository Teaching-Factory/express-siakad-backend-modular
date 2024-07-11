const express = require("express");

const router = express.Router();

// import controller dan middleware
const SemesterAktifController = require("../controllers/semester-aktif");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), SemesterAktifController.getAllSemesterAktif);
router.get("/:id/get", checkRole(["admin"]), SemesterAktifController.getSemesterAktifById);
router.get("/get-semester-aktif-now", checkRole(["admin"]), SemesterAktifController.getSemesterAktifNow);
router.post("/create", checkRole(["admin"]), SemesterAktifController.createSemesterAktif);
router.put("/update", checkRole(["admin"]), SemesterAktifController.updateSemesterAktifNow);

module.exports = router;
