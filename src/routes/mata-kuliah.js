const express = require("express");

const router = express.Router();

// import controller dan middleware
const MataKuliahController = require("../controllers/mata-kuliah");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), MataKuliahController.getAllMataKuliah);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), MataKuliahController.getMataKuliahById);

// router.post("/create", checkRole(["admin", "admin-prodi"]),MataKuliahController.createMataKuliah);
// router.put("/:id/update", checkRole(["admin", "admin-prodi"]),MataKuliahController.updateMataKuliahById);
// router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]),MataKuliahController.deleteMataKuliahById);

module.exports = router;
