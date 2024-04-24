const express = require("express");

const router = express.Router();

// import controllers
const AgamaController = require("../controllers/api-feeder/agama");
const NegaraController = require("../controllers/api-feeder/negara");
const WilayahController = require("../controllers/api-feeder/wilayah");
const PerguruanTinggiController = require("../controllers/api-feeder/perguruan-tinggi");
// const ProfilPTController = require("../controllers/api-feeder/profil-pt");

// all routes
router.get("/get-agama", AgamaController.getAgama);
router.get("/get-negara", NegaraController.getNegara);
router.get("/get-wilayah", WilayahController.getWilayah);
router.get("/get-all-pt", PerguruanTinggiController.getAllPerguruanTinggi);
// router.get("/get-profil-pt", ProfilPTController.getProfilPT);

module.exports = router;
