const express = require("express");

const router = express.Router();

// import controller
const DetailKelasKuliahController = require("../controllers/detail-kelas-kuliah");

// all routes
router.get("/", DetailKelasKuliahController.getAllDetailKelasKuliah);
router.get("/:id/get", DetailKelasKuliahController.getDetailKelasKuliahById);

module.exports = router;
