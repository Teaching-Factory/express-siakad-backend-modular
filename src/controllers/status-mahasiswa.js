const getAllStatusMahasiswas = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all status mahasiswas",
  });
};

const getStatusMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const statusMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses get status mahasiswa by id",
    statusMahasiswaId: statusMahasiswaId,
  });
};

const createStatusMahasiswa = (req, res) => {
  res.json({
    message: "Berhasil mengakses create status mahasiswa",
  });
};

const updateStatusMahasiswa = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const statusMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses update status mahasiswa by id",
    statusMahasiswaId: statusMahasiswaId,
  });
};

const updateAllStatusNonAktif = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const prodiId = req.params.id_prodi;

  res.json({
    message: "Berhasil mengakses update all status non aktif",
    prodiId: prodiId,
  });
};

module.exports = {
  getAllStatusMahasiswas,
  getStatusMahasiswaById,
  createStatusMahasiswa,
  updateStatusMahasiswa,
  updateAllStatusNonAktif,
};
