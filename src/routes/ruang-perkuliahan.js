const express = require("express");

const router = express.Router();

// import controller
const RuangPerkuliahanController = require("../controllers/ruang-perkuliahan");

// all routes
router.get("/get-ruang-perkuliahans", RuangPerkuliahanController.getAllRuangPerkuliahans);
router.get("/get-ruang-perkuliahan/:id", RuangPerkuliahanController.getRuangPerkuliahanById);
router.post("/create-ruang-perkuliahan", RuangPerkuliahanController.createRuangPerkuliahan);
router.put("/update-ruang-perkuliahan/:id", RuangPerkuliahanController.updateRuangPerkuliahanById);
router.delete("/delete-ruang-perkuliahan/:id", RuangPerkuliahanController.deleteRuangPerkuliahanById);

module.exports = router;
