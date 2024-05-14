const express = require("express");

const router = express.Router();

// import controller dan middleware
const RolePermissionController = require("../controllers/role");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), RolePermissionController.getAllRoles);
router.get("/:id/get", checkRole(["admin"]), RolePermissionController.getRoleById);
router.post("/create", checkRole(["admin"]), RolePermissionController.createRole);
router.put("/:id/update", checkRole(["admin"]), RolePermissionController.updateRoleById);
router.delete("/:id/delete", checkRole(["admin"]), RolePermissionController.deleteRoleById);

module.exports = router;
