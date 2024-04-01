const express = require("express");

const router = express.Router();

// import controller
const UserController = require("../controllers/users");

// all routes user
router.get("/", UserController.getAllUsers);
router.post("/", UserController.createNewUser);

module.exports = router;
