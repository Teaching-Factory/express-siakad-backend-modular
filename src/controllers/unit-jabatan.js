const getAllUnitJabatans = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all unit jabatans",
  });
};

const getUnitJabatanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const unitJabatanId = req.params.id;

  res.json({
    message: "Berhasil mengakses get unit jabatan by id",
    unitJabatanId: unitJabatanId,
  });
};

const createUnitJabatan = (req, res) => {
  res.json({
    message: "Berhasil mengakses create unit jabatan",
  });
};

const updateUnitJabatanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const unitJabatanId = req.params.id;

  res.json({
    message: "Berhasil mengakses update unit jabatan by id",
    unitJabatanId: unitJabatanId,
  });
};

const deleteUnitJabatanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const unitJabatanId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete unit jabatan by id",
    unitJabatanId: unitJabatanId,
  });
};

module.exports = {
  getAllUnitJabatans,
  getUnitJabatanById,
  createUnitJabatan,
  updateUnitJabatanById,
  deleteUnitJabatanById,
};
