const { JenisKeluar } = require("../../models");

const getAllJenisKeluar = async (req, res) => {
  try {
    // Ambil semua data jenis_keluar dari database
    const jenis_keluar = await JenisKeluar.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenis Keluar Success",
      jumlahData: jenis_keluar.length,
      data: jenis_keluar,
    });
  } catch (error) {
    next(error);
  }
};

const getJenisKeluarById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const JenisKeluarId = req.params.id;

    // Cari data jenis_keluar berdasarkan ID di database
    const jenis_keluar = await JenisKeluar.findByPk(JenisKeluarId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_keluar) {
      return res.status(404).json({
        message: `<===== Jenis Keluar With ID ${JenisKeluarId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jenis Keluar By ID ${JenisKeluarId} Success:`,
      data: jenis_keluar,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJenisKeluar,
  getJenisKeluarById,
};
