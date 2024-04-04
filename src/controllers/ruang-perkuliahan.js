const getAllRuangPerkuliahans = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all ruang perkuliahans",
  });
};

const getRuangPerkuliahanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const ruangPerkuliahanId = req.params.id;

  res.json({
    message: "Berhasil mengakses get ruang perkuliahan by id",
    ruangPerkuliahanId: ruangPerkuliahanId,
  });
};

const createRuangPerkuliahan = (req, res) => {
  res.json({
    message: "Berhasil mengakses create ruang perkuliahan",
  });
};

const updateRuangPerkuliahanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const ruangPerkuliahanId = req.params.id;

  res.json({
    message: "Berhasil mengakses update ruang perkuliahan by id",
    ruangPerkuliahanId: ruangPerkuliahanId,
  });
};

const deleteRuangPerkuliahanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const ruangPerkuliahanId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete ruang perkuliahan by id",
    ruangPerkuliahanId: ruangPerkuliahanId,
  });
};

module.exports = {
  getAllRuangPerkuliahans,
  getRuangPerkuliahanById,
  createRuangPerkuliahan,
  updateRuangPerkuliahanById,
  deleteRuangPerkuliahanById,
};
