const getAllKrsMahasiswas = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all krs mahasiswas",
  });
};

const getKrsMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const krsMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses get krs mahasiswa by id",
    krsMahasiswaId: krsMahasiswaId,
  });
};

const createKrsMahasiswa = (req, res) => {
  res.json({
    message: "Berhasil mengakses create krs mahasiswa",
  });
};

const updateKrsMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const krsMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses update krs mahasiswa by id",
    krsMahasiswaId: krsMahasiswaId,
  });
};

const deleteKrsMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const krsMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete krs mahasiswa by id",
    krsMahasiswaId: krsMahasiswaId,
  });
};

const getAllMahasiswaBelumKrs = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all mahasiswa belum krs",
  });
};

module.exports = {
  getAllKrsMahasiswas,
  getKrsMahasiswaById,
  createKrsMahasiswa,
  updateKrsMahasiswaById,
  deleteKrsMahasiswaById,
  getAllMahasiswaBelumKrs,
};
