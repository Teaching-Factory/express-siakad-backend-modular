const express = require("express");

const router = express.Router();
const checkAuthorization = require("../middlewares/check-token");

// import controller
const UserController = require("../controllers/user");

// all routes
router.get("/", UserController.getAllUser);
router.get("/:id/get", UserController.getUserById);
router.post("/create", UserController.createUser);
// router.put("/:id/update", UserController.updateUserById);
router.delete("/:id/delete", UserController.deleteUserById);

// generate user by
router.post("/mahasiswa/generate", UserController.generateUserByMahasiswa);
router.post("/dosen/generate", UserController.generateUserByDosen);

module.exports = router;
