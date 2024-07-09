const express = require("express");

const router = express.Router();

// import controller dan middleware
const ProfilPTController = require("../controllers/profil-pt");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), ProfilPTController.getAllProfilPT);
router.get("/:id/get", checkRole(["admin"]), ProfilPTController.getProfilPTById);
router.put("/:id/update", checkRole(["admin"]), ProfilPTController.updateProfilPTById);
router.get("/get-profile-pt-active", checkRole(["admin"]), ProfilPTController.getProfilPTActive);
router.put("/update-profil-pt-active", checkRole(["admin"]), ProfilPTController.updateProfilPTActive);

module.exports = router;
