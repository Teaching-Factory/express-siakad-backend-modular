const express = require("express");

const router = express.Router();

// import controller dan middleware
const AuthController = require("../controllers/auth");

// all routes
router.post("/do-login", AuthController.doLogin);
router.get("/do-logout", AuthController.doLogout);
router.post("/:id/do-login-as", AuthController.doLoginAs);

module.exports = router;
