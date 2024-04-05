const getAllSistemKuliahs = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all sistem kuliahs",
  });
};

const getSistemKuliahById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const sistemKuliahId = req.params.id;

  res.json({
    message: "Berhasil mengakses get sistem kuliah by id",
    sistemKuliahId: sistemKuliahId,
  });
};

const createSistemKuliah = (req, res) => {
  res.json({
    message: "Berhasil mengakses create sistem kuliah",
  });
};

const updateSistemKuliahById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const sistemKuliahId = req.params.id;

  res.json({
    message: "Berhasil mengakses update sistem kuliah by id",
    sistemKuliahId: sistemKuliahId,
  });
};

const deleteSistemKuliahById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const sistemKuliahId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete sistem kuliah by id",
    sistemKuliahId: sistemKuliahId,
  });
};

module.exports = {
  getAllSistemKuliahs,
  getSistemKuliahById,
  createSistemKuliah,
  updateSistemKuliahById,
  deleteSistemKuliahById,
};
