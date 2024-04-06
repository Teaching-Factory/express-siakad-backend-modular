const getAllMahasiswas = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all mahasiswas",
  });
};

const getMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const mahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses get mahasiswa by id",
    mahasiswaId: mahasiswaId,
  });
};

const createMahasiswa = (req, res) => {
  res.json({
    message: "Berhasil mengakses create mahasiswa",
  });
};

const updateMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const mahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses update mahasiswa by id",
    mahasiswaId: mahasiswaId,
  });
};

const deleteMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const mahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete mahasiswa by id",
    mahasiswaId: mahasiswaId,
  });
};

const importMahasiswa = (req, res) => {
  res.json({
    message: "Berhasil mengakses import mahasiswa",
  });
};

module.exports = {
  getAllMahasiswas,
  getMahasiswaById,
  createMahasiswa,
  updateMahasiswaById,
  deleteMahasiswaById,
  importMahasiswa,
};
