const getAllDosens = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all dosens",
  });
};

const getDosenById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const dosenId = req.params.id;

  res.json({
    message: "Berhasil mengakses get dosen by id",
    dosenId: dosenId,
  });
};

const createDosen = (req, res) => {
  res.json({
    message: "Berhasil mengakses create dosen",
  });
};

const updateDosenById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const dosenId = req.params.id;

  res.json({
    message: "Berhasil mengakses update dosen by id",
    dosenId: dosenId,
  });
};

const deleteDosenById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const dosenId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete dosen by id",
    dosenId: dosenId,
  });
};

module.exports = {
  getAllDosens,
  getDosenById,
  createDosen,
  updateDosenById,
  deleteDosenById,
};
