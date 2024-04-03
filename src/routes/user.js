const express = require("express");

const router = express.Router();

// import controller
const UserController = require("../controllers/user");

// all routes
router.get("/get-users", UserController.getAllUsers);
router.get("/get-user/:id", UserController.getUserById);
router.post("/create-user", UserController.createUser);
router.put("/update-user/:id", UserController.updateUserById);
router.delete("/delete-user/:id", UserController.deleteUserById);

// import user by
router.post("/import-user-by-mahasiswa", UserController.importUserByMahasiswa);
router.post("/import-user-by-dosen", UserController.importUserByDosen);

module.exports = router;
