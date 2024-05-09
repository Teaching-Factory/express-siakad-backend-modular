const express = require("express");

const router = express.Router();

// import controller dan middleware
const AuthController = require("../controllers/auth");

// all routes
router.post("/do-login", AuthController.doLogin);
router.get("/do-logout", AuthController.doLogout);

module.exports = router;
