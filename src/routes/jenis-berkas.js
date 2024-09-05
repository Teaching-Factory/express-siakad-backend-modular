const express = require("express");

const router = express.Router();

// import controller dan middleware
const JenisBerkasController = require("../controllers/jenis-berkas");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), JenisBerkasController.getAllJenisBerkas);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), JenisBerkasController.getJenisBerkasById);
router.post("/create", checkRole(["admin", "admin-pmb"]), JenisBerkasController.createJenisBerkas);
router.put("/:id/update", checkRole(["admin", "admin-pmb"]), JenisBerkasController.updateJenisBerkasById);
router.delete("/:id/delete", checkRole(["admin", "admin-pmb"]), JenisBerkasController.deleteJenisBerkasById);

module.exports = router;
