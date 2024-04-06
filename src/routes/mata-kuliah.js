const express = require("express");

const router = express.Router();

// import controller
const MataKuliahController = require("../controllers/mata-kuliah");

// all routes
router.get("/", MataKuliahController.getAllMataKuliahs);
router.get("/:id/get", MataKuliahController.getMataKuliahById);
router.post("/create", MataKuliahController.createMataKuliah);
router.put("/:id/update", MataKuliahController.updateMataKuliahById);
router.delete("/:id/delete", MataKuliahController.deleteMataKuliahById);

module.exports = router;
