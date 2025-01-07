const express = require("express");

const router = express.Router();

// import controller dan middleware
const AdminProdiController = require("../controllers/admin-prodi");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), AdminProdiController.getAllAdminProdi);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), AdminProdiController.getAdminProdiById);
router.post("/create", checkRole(["admin", "admin-prodi"]), AdminProdiController.createAdminProdi);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), AdminProdiController.updateAdminProdiById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), AdminProdiController.deleteAdminProdiById);

module.exports = router;
