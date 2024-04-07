const getAllNilaiPerkuliahanByIdKelas = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const kelasDanJadwalId = req.params.id_kelas_dan_jadwal;

  res.json({
    message: "Berhasil mengakses get all nilai perkuliahan by id kelas",
    kelasDanJadwalId: kelasDanJadwalId,
  });
};

const getAllNilaiPerkuliahanByIdMahasiswa = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const mahasiswaId = req.params.id_mahasiswa;

  res.json({
    message: "Berhasil mengakses get all nilai perkuliahan by id mahasiswa",
    mahasiswaId: mahasiswaId,
  });
};

const createNilaiPerkuliahan = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const kelasDanJadwalId = req.params.id_kelas_dan_jadwal;

  res.json({
    message: "Berhasil mengakses create nilai perkuliahan",
    kelasDanJadwalId: kelasDanJadwalId,
  });
};

const updateNilaiPerkuliahanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const nilaiPerkuliahanId = req.params.id;

  res.json({
    message: "Berhasil mengakses update nilai perkuliahan by id",
    nilaiPerkuliahanId: nilaiPerkuliahanId,
  });
};

const deleteNilaiPerkuliahanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const nilaiPerkuliahanId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete nilai perkuliahan by id",
    nilaiPerkuliahanId: nilaiPerkuliahanId,
  });
};

module.exports = {
  getAllNilaiPerkuliahanByIdKelas,
  getAllNilaiPerkuliahanByIdMahasiswa,
  createNilaiPerkuliahan,
  updateNilaiPerkuliahanById,
  deleteNilaiPerkuliahanById,
};
