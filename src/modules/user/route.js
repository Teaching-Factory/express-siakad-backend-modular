const express = require("express");

const router = express.Router();

// import controller dan middleware
const UserController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), UserController.getAllUser);
router.get("/role/:id_role/get", checkRole(["admin"]), UserController.getAllUserByRoleId);
router.get("/:id/get", checkRole(["admin"]), UserController.getUserById);
router.post("/create", checkRole(["admin"]), UserController.createUser);
router.put("/:id/update", checkRole(["admin"]), UserController.updateUserById);
router.delete("/:id/delete", checkRole(["admin"]), UserController.deleteUserById);

// get mahasiswa/dosen dont have user
router.get("/:id_prodi/:id_angkatan/get-mahasiswa-dont-have-user", checkRole(["admin", "admin-prodi"]), UserController.getMahasiswaDontHaveUserByProdiAndAngkatanId);
router.get("/get-dosen-dont-have-user", checkRole(["admin", "admin-prodi"]), UserController.getDosenDontHaveUser);

// generate user by
router.post("/mahasiswa/generate", checkRole(["admin"]), UserController.generateUserByMahasiswa);
router.post("/mahasiswa/generate/:id_angkatan", checkRole(["admin"]), UserController.generateUserMahasiswaAllProdiByAngkatan);
router.post("/dosen/generate", checkRole(["admin"]), UserController.generateUserByDosen);

// admin prodi
router.get("/get-user-admin-prodi-not-registered", checkRole(["admin", "admin-prodi"]), UserController.getUserAdminProdi);
router.get("/checking-admin-prodi-user", checkRole(["admin-prodi"]), UserController.checkingAdminProdiUser);

module.exports = router;
