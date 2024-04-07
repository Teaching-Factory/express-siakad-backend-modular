const getNilaiTranskripByIdKrs = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const krsMahasiswaId = req.params.id_krs_mahasiswa;

  res.json({
    message: "Berhasil mengakses get nilai transkrip by id krs mahasiswa",
    krsMahasiswaId: krsMahasiswaId,
  });
};

const getNilaiTranskripByIdMahasiswa = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const mahasiswaId = req.params.id_mahasiswa;

  res.json({
    message: "Berhasil mengakses get nilai transkrip by id mahasiswa",
    mahasiswaId: mahasiswaId,
  });
};

module.exports = {
  getNilaiTranskripByIdKrs,
  getNilaiTranskripByIdMahasiswa,
};
