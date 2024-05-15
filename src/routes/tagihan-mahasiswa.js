const express = require("express");

const router = express.Router();

// import controller
const TagihanMahasiswaController = require("../controllers/tagihan-mahasiswa");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-keuangan"]), TagihanMahasiswaController.getAllTagihanMahasiswa);
router.get("/:id/get", checkRole(["admin", "admin-keuangan"]), TagihanMahasiswaController.getTagihanMahasiswaById);
router.post("/create", checkRole(["admin", "admin-keuangan"]), TagihanMahasiswaController.createTagihanMahasiswa);
router.put("/:id/update", checkRole(["admin", "admin-keuangan"]), TagihanMahasiswaController.updateTagihanMahasiswaById);
router.delete("/:id/delete", checkRole(["admin", "admin-keuangan"]), TagihanMahasiswaController.deleteTagihanMahasiswaById);

module.exports = router;
