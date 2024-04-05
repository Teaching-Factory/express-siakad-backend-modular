const express = require("express");

const router = express.Router();

// import controller
const RuangPerkuliahanController = require("../controllers/ruang-perkuliahan");

// all routes
router.get("/", RuangPerkuliahanController.getAllRuangPerkuliahans);
router.get("/:id/get", RuangPerkuliahanController.getRuangPerkuliahanById);
router.post("/create", RuangPerkuliahanController.createRuangPerkuliahan);
router.put("/:id/update", RuangPerkuliahanController.updateRuangPerkuliahanById);
router.delete("/:id/delete", RuangPerkuliahanController.deleteRuangPerkuliahanById);

module.exports = router;
