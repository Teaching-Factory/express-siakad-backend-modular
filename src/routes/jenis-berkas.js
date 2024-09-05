const express = require("express");

const router = express.Router();

// import controller dan middleware
const JenisBerkasController = require("../controllers/jenis-berkas");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), JenisBerkasController.getAllJenisBerkas);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), JenisBerkasController.getJenisBerkasById);
router.post("/create", checkRole(["admin", "admin-prodi"]), JenisBerkasController.createJenisBerkas);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), JenisBerkasController.updateJenisBerkasById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), JenisBerkasController.deleteJenisBerkasById);

module.exports = router;
