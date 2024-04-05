const express = require("express");

const router = express.Router();

// import controller
const RolePermissionController = require("../controllers/role-permission");

// all routes
// role
router.get("/roles", RolePermissionController.getAllRoles);
router.post("/create-role", RolePermissionController.createRole);
router.get("/:id/get-role", RolePermissionController.getRoleById);
router.put("/:id/update-role", RolePermissionController.updateRoleById);
router.delete("/:id/delete-role", RolePermissionController.deleteRoleById);

// permission
router.get("/permissions", RolePermissionController.getAllPermissions);
router.post("/create-permission", RolePermissionController.createPermission);
router.get("/:id/get-permission", RolePermissionController.getPermissionById);
router.put("/:id/update-permission", RolePermissionController.updatePermissionById);
router.delete("/:id/delete-permission", RolePermissionController.deletePermissionById);

module.exports = router;
