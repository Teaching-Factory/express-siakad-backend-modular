const createSistemKuliahMahasiswa = (req, res) => {
  res.json({
    message: "Berhasil mengakses create sistem kuliah mahasiswa",
  });
};

const deleteSistemKuliahMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const sistemKuliahMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete sistem kuliah mahasiswa by id",
    sistemKuliahMahasiswaId: sistemKuliahMahasiswaId,
  });
};

module.exports = {
  createSistemKuliahMahasiswa,
  deleteSistemKuliahMahasiswaById,
};
