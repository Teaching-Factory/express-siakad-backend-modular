const getAllProdis = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all prodis",
  });
};

const getProdiById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const prodiId = req.params.id;

  res.json({
    message: "Berhasil mengakses get prodi by id",
    prodiId: prodiId,
  });
};

const createProdi = (req, res) => {
  res.json({
    message: "Berhasil mengakses create prodi",
  });
};

const updateProdiById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const prodiId = req.params.id;

  res.json({
    message: "Berhasil mengakses update prodi by id",
    prodiId: prodiId,
  });
};

const deleteProdiById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const prodiId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete prodi by id",
    prodiId: prodiId,
  });
};

module.exports = {
  getAllProdis,
  getProdiById,
  createProdi,
  updateProdiById,
  deleteProdiById,
};
