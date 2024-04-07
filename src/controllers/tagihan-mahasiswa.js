const getAllTagihanMahasiswas = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all tagihan mahasiswas",
  });
};

const getTagihanMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const tagihanMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses get tagihan mahasiswa by id",
    tagihanMahasiswaId: tagihanMahasiswaId,
  });
};

const createTagihanMahasiswa = (req, res) => {
  res.json({
    message: "Berhasil mengakses create tagihan mahasiswa",
  });
};

const updateTagihanMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const tagihanMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses update tagihan mahasiswa by id",
    tagihanMahasiswaId: tagihanMahasiswaId,
  });
};

const deleteTagihanMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const tagihanMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete tagihan mahasiswa by id",
    tagihanMahasiswaId: tagihanMahasiswaId,
  });
};

module.exports = {
  getAllTagihanMahasiswas,
  getTagihanMahasiswaById,
  createTagihanMahasiswa,
  updateTagihanMahasiswaById,
  deleteTagihanMahasiswaById,
};
