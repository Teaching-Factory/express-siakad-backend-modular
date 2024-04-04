const getAllJabatans = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all jabatans",
  });
};

const getJabatanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const jabatanId = req.params.id;

  res.json({
    message: "Berhasil mengakses get jabatan by id",
    jabatanId: jabatanId,
  });
};

const createJabatan = (req, res) => {
  res.json({
    message: "Berhasil mengakses create jabatan",
  });
};

const updateJabatanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const jabatanId = req.params.id;

  res.json({
    message: "Berhasil mengakses update jabatan by id",
    jabatanId: jabatanId,
  });
};

const deleteJabatanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const jabatanId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete jabatan by id",
    jabatanId: jabatanId,
  });
};

module.exports = {
  getAllJabatans,
  getJabatanById,
  createJabatan,
  updateJabatanById,
  deleteJabatanById,
};
