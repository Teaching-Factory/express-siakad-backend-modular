const getAllWilayahs = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all wilayahs",
  });
};

const getWilayahById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const wilayahId = req.params.id;

  res.json({
    message: "Berhasil mengakses get wilayah by id",
    wilayahId: wilayahId,
  });
};

const createWilayah = (req, res) => {
  res.json({
    message: "Berhasil mengakses create wilayah",
  });
};

const updateWilayahById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const wilayahId = req.params.id;

  res.json({
    message: "Berhasil mengakses update wilayah by id",
    wilayahId: wilayahId,
  });
};

const deleteWilayahById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const wilayahId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete wilayah by id",
    wilayahId: wilayahId,
  });
};

module.exports = {
  getAllWilayahs,
  getWilayahById,
  createWilayah,
  updateWilayahById,
  deleteWilayahById,
};
