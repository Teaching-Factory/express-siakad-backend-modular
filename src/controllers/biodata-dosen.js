const { BiodataDosen } = require("../../models");

const getAllBiodataDosen = async (req, res) => {
  try {
    // Ambil semua data biodata_dosen dari database
    const biodata_dosen = await BiodataDosen.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Biodata Dosen Success",
      jumlahData: biodata_dosen.length,
      data: biodata_dosen,
    });
  } catch (error) {
    next(error);
  }
};

const getBiodataDosenById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const BiodataDosenId = req.params.id;

    // Cari data biodata_dosen berdasarkan ID di database
    const biodata_dosen = await BiodataDosen.findByPk(BiodataDosenId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!biodata_dosen) {
      return res.status(404).json({
        message: `<===== Biodata Dosen With ID ${BiodataDosenId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Biodata Dosen By ID ${BiodataDosenId} Success:`,
      data: biodata_dosen,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBiodataDosen,
  getBiodataDosenById,
};
