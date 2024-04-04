const getAllFakultas = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all fakultas",
  });
};

const getFakultasById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const fakultasId = req.params.id;

  res.json({
    message: "Berhasil mengakses get fakultas by id",
    fakultasId: fakultasId,
  });
};

const createFakultas = (req, res) => {
  res.json({
    message: "Berhasil mengakses create fakultas",
  });
};

const updateFakultasById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const fakultasId = req.params.id;

  res.json({
    message: "Berhasil mengakses update fakultas by id",
    fakultasId: fakultasId,
  });
};

const deleteFakultasById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const fakultasId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete fakultas by id",
    fakultasId: fakultasId,
  });
};

module.exports = {
  getAllFakultas,
  getFakultasById,
  createFakultas,
  updateFakultasById,
  deleteFakultasById,
};
