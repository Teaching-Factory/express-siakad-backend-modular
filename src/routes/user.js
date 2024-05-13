const express = require("express");

const router = express.Router();

// import controller dan middleware
const UserController = require("../controllers/user");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), UserController.getAllUser);
router.get("/:id/get", checkRole(["admin"]), UserController.getUserById);
router.post("/create", checkRole(["admin"]), UserController.createUser);
router.put("/:id/update", checkRole(["admin"]),UserController.updateUserById);
router.delete("/:id/delete", checkRole(["admin"]), UserController.deleteUserById);

// generate user by
router.post("/mahasiswa/generate", checkRole(["admin"]), UserController.generateUserByMahasiswa);
router.post("/dosen/generate", checkRole(["admin"]), UserController.generateUserByDosen);

module.exports = router;
