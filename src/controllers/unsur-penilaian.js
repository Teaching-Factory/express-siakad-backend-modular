const getAllUnsurPenilaians = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all unsur penilaians",
  });
};

const getUnsurPenilaianById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const unsurPenilaianId = req.params.id;

  res.json({
    message: "Berhasil mengakses get unsur penilaian by id",
    unsurPenilaianId: unsurPenilaianId,
  });
};

const createUnsurPenilaian = (req, res) => {
  res.json({
    message: "Berhasil mengakses create unsur penilaian",
  });
};

const updateUnsurPenilaianById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const unsurPenilaianId = req.params.id;

  res.json({
    message: "Berhasil mengakses update unsur penilaian by id",
    unsurPenilaianId: unsurPenilaianId,
  });
};

const deleteUnsurPenilaianById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const unsurPenilaianId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete unsur penilaian by id",
    unsurPenilaianId: unsurPenilaianId,
  });
};

module.exports = {
  getAllUnsurPenilaians,
  getUnsurPenilaianById,
  createUnsurPenilaian,
  updateUnsurPenilaianById,
  deleteUnsurPenilaianById,
};
