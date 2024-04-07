const getAllPembayaranMahasiswas = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const mahasiswaId = req.params.id_mahasiswa;

  res.json({
    message: "Berhasil mengakses all pembayaran mahasiswas",
    mahasiswaId: mahasiswaId,
  });
};

const getPembayaranMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const pembayaranMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses get pembayaran mahasiswa by id",
    pembayaranMahasiswaId: pembayaranMahasiswaId,
  });
};

const createPembayaranMahasiswa = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const tagihanMahasiswaId = req.params.id_tagihan_mahasiswa;

  res.json({
    message: "Berhasil mengakses create pembayaran mahasiswa",
    tagihanMahasiswaId: tagihanMahasiswaId,
  });
};

const updatePembayaranMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const pembayaranMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses update pembayaran mahasiswa by id",
    pembayaranMahasiswaId: pembayaranMahasiswaId,
  });
};

const deletePembayaranMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const pembayaranMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete pembayaran mahasiswa by id",
    pembayaranMahasiswaId: pembayaranMahasiswaId,
  });
};

const konfirmasiPembayaranMahasiswa = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const pembayaranMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses konfirmasi pembayaran mahasiswa",
    pembayaranMahasiswaId: pembayaranMahasiswaId,
  });
};

module.exports = {
  getAllPembayaranMahasiswas,
  getPembayaranMahasiswaById,
  createPembayaranMahasiswa,
  updatePembayaranMahasiswaById,
  deletePembayaranMahasiswaById,
  konfirmasiPembayaranMahasiswa,
};
