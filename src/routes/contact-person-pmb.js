const express = require("express");

const router = express.Router();

// import controller dan middleware
const ContactPersonPMBController = require("../controllers/contact-person-pmb");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), ContactPersonPMBController.getAllContactPersonPMB);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), ContactPersonPMBController.getContectPersonPMBById);
router.get("/get-cp-pmb-aktif", checkRole(["admin", "admin-pmb"]), ContactPersonPMBController.getContactPersonAktif);
router.post("/create", checkRole(["admin", "admin-pmb"]), ContactPersonPMBController.createContactPersonPMB);
router.put("/update", checkRole(["admin", "admin-pmb"]), ContactPersonPMBController.updateContactPersonPMBAktif);

module.exports = router;
