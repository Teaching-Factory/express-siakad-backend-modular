const express = require("express");

const router = express.Router();

// import controller dan middleware
const JabatanController = require("../controllers/jabatan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), JabatanController.getAllJabatan);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), JabatanController.getJabatanById);
router.post("/create", checkRole(["admin", "admin-prodi"]), JabatanController.createJabatan);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), JabatanController.updateJabatanById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), JabatanController.deleteJabatanById);

module.exports = router;
