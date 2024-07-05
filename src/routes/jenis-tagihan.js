const express = require("express");

const router = express.Router();

// import controller dan middleware
const JenisTagihanController = require("../controllers/jenis-tagihan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-keuangan"]), JenisTagihanController.getAllJenisTagihan);
router.get("/get-jenis-tagihan-active", checkRole(["admin", "admin-keuangan"]), JenisTagihanController.getAllJenisTagihanActive);
router.get("/:id/get", checkRole(["admin", "admin-keuangan"]), JenisTagihanController.getJenisTagihanById);
router.post("/create", checkRole(["admin", "admin-keuangan"]), JenisTagihanController.createJenisTagihan);
router.put("/:id/update", checkRole(["admin", "admin-keuangan"]), JenisTagihanController.updateJenisTagihanById);
router.delete("/:id/delete", checkRole(["admin", "admin-keuangan"]), JenisTagihanController.deleteJenisTagihanById);

module.exports = router;
