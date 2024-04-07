const express = require("express");

const router = express.Router();

// import controller
const TagihanMahasiswaController = require("../controllers/tagihan-mahasiswa");

// all routes
router.get("/", TagihanMahasiswaController.getAllTagihanMahasiswas);
router.get("/:id/get", TagihanMahasiswaController.getTagihanMahasiswaById);
router.post("/create", TagihanMahasiswaController.createTagihanMahasiswa);
router.put("/:id/update", TagihanMahasiswaController.updateTagihanMahasiswaById);
router.delete("/:id/delete", TagihanMahasiswaController.deleteTagihanMahasiswaById);

module.exports = router;
