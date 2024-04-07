const getAllKhsMahasiswas = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all khs mahasiswas",
  });
};

const getKhsMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const khsMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses get khs mahasiswa by id",
    khsMahasiswaId: khsMahasiswaId,
  });
};

const createKhsMahasiswa = (req, res) => {
  res.json({
    message: "Berhasil mengakses create khs mahasiswa",
  });
};

const updateKhsMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const khsMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses update khs mahasiswa by id",
    khsMahasiswaId: khsMahasiswaId,
  });
};

const deleteKhsMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const khsMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete khs mahasiswa by id",
    khsMahasiswaId: khsMahasiswaId,
  });
};

module.exports = {
  getAllKhsMahasiswas,
  getKhsMahasiswaById,
  createKhsMahasiswa,
  updateKhsMahasiswaById,
  deleteKhsMahasiswaById,
};
