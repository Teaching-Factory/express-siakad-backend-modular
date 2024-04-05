const express = require("express");

const router = express.Router();

// import controller
const UserController = require("../controllers/user");

// all routes
router.get("/", UserController.getAllUsers);
router.get("/:id/get", UserController.getUserById);
router.post("/create", UserController.createUser);
router.put("/:id/update", UserController.updateUserById);
router.delete("/:id/delete", UserController.deleteUserById);

// import user by
router.post("/mahasiswa/import", UserController.importUserByMahasiswa);
router.post("/dosen/import", UserController.importUserByDosen);

module.exports = router;
