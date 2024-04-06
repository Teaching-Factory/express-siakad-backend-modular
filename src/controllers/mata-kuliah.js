const getAllMataKuliahs = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all mata kuliahs",
  });
};

const getMataKuliahById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const mataKuliahId = req.params.id;

  res.json({
    message: "Berhasil mengakses get mata kuliah by id",
    mataKuliahId: mataKuliahId,
  });
};

const createMataKuliah = (req, res) => {
  res.json({
    message: "Berhasil mengakses create mata kuliah",
  });
};

const updateMataKuliahById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const mataKuliahId = req.params.id;

  res.json({
    message: "Berhasil mengakses update mata kuliah by id",
    mataKuliahId: mataKuliahId,
  });
};

const deleteMataKuliahById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const mataKuliahId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete mata kuliah by id",
    mataKuliahId: mataKuliahId,
  });
};

module.exports = {
  getAllMataKuliahs,
  getMataKuliahById,
  createMataKuliah,
  updateMataKuliahById,
  deleteMataKuliahById,
};
