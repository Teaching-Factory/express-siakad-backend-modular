const express = require("express");

const router = express.Router();

// import controller dan middleware
const RuangPerkuliahanController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "dosen"]), RuangPerkuliahanController.getAllRuangPerkuliahan);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), RuangPerkuliahanController.getRuangPerkuliahanById);
router.post("/create", checkRole(["admin", "admin-prodi"]), RuangPerkuliahanController.createRuangPerkuliahan);
router.put("/:id/update", checkRole(["admin", "admin-prodi"]), RuangPerkuliahanController.updateRuangPerkuliahanById);
router.delete("/:id/delete", checkRole(["admin", "admin-prodi"]), RuangPerkuliahanController.deleteRuangPerkuliahanById);

module.exports = router;
