const getAllAngkatans = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all angkatans",
  });
};

const getAngkatanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const angkatanId = req.params.id;

  res.json({
    message: "Berhasil mengakses get angkatan by id",
    angkatanId: angkatanId,
  });
};

const createAngkatan = (req, res) => {
  res.json({
    message: "Berhasil mengakses create angkatan",
  });
};

const updateAngkatanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const angkatanId = req.params.id;

  res.json({
    message: "Berhasil mengakses update angkatan by id",
    angkatanId: angkatanId,
  });
};

const deleteAngkatanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const angkatanId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete angkatan by id",
    angkatanId: angkatanId,
  });
};

module.exports = {
  getAllAngkatans,
  getAngkatanById,
  createAngkatan,
  updateAngkatanById,
  deleteAngkatanById,
};
