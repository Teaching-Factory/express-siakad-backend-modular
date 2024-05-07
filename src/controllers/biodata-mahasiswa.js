const { BiodataMahasiswa } = require("../../models");

const getAllBiodataMahasiswa = async (req, res) => {
  try {
    // Ambil semua data biodata_mahasiswa dari database
    const biodata_mahasiswa = await BiodataMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Biodata Mahasiswa Success",
      jumlahData: biodata_mahasiswa.length,
      data: biodata_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getBiodataMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const BiodataMahasiswaId = req.params.id;

    // Cari data biodata_mahasiswa berdasarkan ID di database
    const biodata_mahasiswa = await BiodataMahasiswa.findByPk(BiodataMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!biodata_mahasiswa) {
      return res.status(404).json({
        message: `<===== Biodata Mahasiswa With ID ${BiodataMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Biodata Mahasiswa By ID ${BiodataMahasiswaId} Success:`,
      data: biodata_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBiodataMahasiswa,
  getBiodataMahasiswaById,
};
