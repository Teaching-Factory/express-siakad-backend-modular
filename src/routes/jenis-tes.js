const express = require("express");

const router = express.Router();

// import controller dan middleware
const JenisTesController = require("../controllers/jenis-tes");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), JenisTesController.getAllJenisTes);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), JenisTesController.getJenisTesById);
router.post("/create", checkRole(["admin", "admin-prodi"]), JenisTesController.createJenisTes);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), JenisTesController.updateJenisTesById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), JenisTesController.deleteJenisTesById);

module.exports = router;
