const getAllDosenWalis = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all dosen walis",
  });
};

const getDosenWaliById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const dosenWaliId = req.params.id;

  res.json({
    message: "Berhasil mengakses get dosen wali by id",
    dosenWaliId: dosenWaliId,
  });
};

const createDosenWali = (req, res) => {
  res.json({
    message: "Berhasil mengakses create dosen wali",
  });
};

const updateDosenWaliById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const dosenWaliId = req.params.id;

  res.json({
    message: "Berhasil mengakses update dosen wali by id",
    dosenWaliId: dosenWaliId,
  });
};

const deleteDosenWaliById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const dosenWaliId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete dosen wali by id",
    dosenWaliId: dosenWaliId,
  });
};

const daftarMahasiswaWali = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const dosenWaliId = req.params.id;

  res.json({
    message: "Berhasil mengakses daftar mahasiswa wali by id",
    dosenWaliId: dosenWaliId,
  });
};

module.exports = {
  getAllDosenWalis,
  getDosenWaliById,
  createDosenWali,
  updateDosenWaliById,
  deleteDosenWaliById,
  daftarMahasiswaWali,
};
