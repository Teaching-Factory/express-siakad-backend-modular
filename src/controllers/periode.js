const getAllPeriodes = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all periodes",
  });
};

const getPeriodeById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const periodeId = req.params.id;

  res.json({
    message: "Berhasil mengakses get periode by id",
    periodeId: periodeId,
  });
};

const createPeriode = (req, res) => {
  res.json({
    message: "Berhasil mengakses create periode",
  });
};

const updatePeriodeById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const periodeId = req.params.id;

  res.json({
    message: "Berhasil mengakses update periode by id",
    periodeId: periodeId,
  });
};

const deletePeriodeById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const periodeId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete periode by id",
    periodeId: periodeId,
  });
};

module.exports = {
  getAllPeriodes,
  getPeriodeById,
  createPeriode,
  updatePeriodeById,
  deletePeriodeById,
};
