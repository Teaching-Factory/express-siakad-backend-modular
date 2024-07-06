const express = require("express");

const router = express.Router();

// import controller dan middleware
const RolePermissionController = require("../controllers/role-permission");
const checkRole = require("../middlewares/check-role");

// all routes
// role
router.get("/roles", checkRole(["admin"]), RolePermissionController.getAllRoles);
router.post("/create-role", checkRole(["admin"]), RolePermissionController.createRole);
router.get("/:id/get-role", checkRole(["admin"]), RolePermissionController.getRoleById);
router.put("/:id/update-role", checkRole(["admin"]), RolePermissionController.updateRoleById);
router.delete("/:id/delete-role", checkRole(["admin"]), RolePermissionController.deleteRoleById);

// permission
router.get("/permissions", checkRole(["admin"]), RolePermissionController.getAllPermissions);
router.post("/create-permission", checkRole(["admin"]), RolePermissionController.createPermission);
router.post("/create-multiple-permission", checkRole(["admin"]), RolePermissionController.createMultiplePermission);
router.get("/:id/get-permission", checkRole(["admin"]), RolePermissionController.getPermissionById);
router.put("/:id/update-permission", checkRole(["admin"]), RolePermissionController.updatePermissionById);
router.delete("/:id/delete-permission", checkRole(["admin"]), RolePermissionController.deletePermissionById);

// role permissions
router.get("/:id_role/list-permissions", checkRole(["admin"]), RolePermissionController.listPermissionsFromRole);
router.post("/:id_role/manage", checkRole(["admin"]), RolePermissionController.manageRolePermission);

module.exports = router;
