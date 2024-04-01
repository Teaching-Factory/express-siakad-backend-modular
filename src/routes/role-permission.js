const express = require("express");

const router = express.Router();

// import controller
const RolePermissionController = require("../controllers/role-permission");

// all routes
// role
router.get("/roles", RolePermissionController.getAllRoles);
router.post("/create-role", RolePermissionController.createRole);
router.get("/get-role/:id", RolePermissionController.getRoleById);
router.put("/update-role/:id", RolePermissionController.updateRoleById);
router.delete("/delete-role/:id", RolePermissionController.deleteRoleById);

// permission
router.get("/permissions", RolePermissionController.getAllPermissions);
router.post("/create-permission", RolePermissionController.createPermission);
router.get("/get-permission/:id", RolePermissionController.getPermissionById);
router.put("/update-permission/:id", RolePermissionController.updatePermissionById);
router.delete("/delete-permission/:id", RolePermissionController.deletePermissionById);

module.exports = router;
