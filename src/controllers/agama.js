const getAllAgamas = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all agamas",
  });
};

const getAgamaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const agamaId = req.params.id;

  res.json({
    message: "Berhasil mengakses get agama by id",
    agamaId: agamaId,
  });
};

const createAgama = (req, res) => {
  res.json({
    message: "Berhasil mengakses create agama",
  });
};

const updateAgamaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const agamaId = req.params.id;

  res.json({
    message: "Berhasil mengakses update agama by id",
    agamaId: agamaId,
  });
};

const deleteAgamaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const agamaId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete agama by id",
    agamaId: agamaId,
  });
};

module.exports = {
  getAllAgamas,
  getAgamaById,
  createAgama,
  updateAgamaById,
  deleteAgamaById,
};
