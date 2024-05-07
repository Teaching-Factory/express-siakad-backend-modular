const { JenisPendaftaran } = require("../../models");

const getAllJenisPendaftaran = async (req, res) => {
  try {
    // Ambil semua data jenis_pendaftaran dari database
    const jenis_pendaftaran = await JenisPendaftaran.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenis Pendaftaran Success",
      jumlahData: jenis_pendaftaran.length,
      data: jenis_pendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

const getJenisPendaftaranById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const JenisPendaftaranId = req.params.id;

    // Cari data jenis_pendaftaran berdasarkan ID di database
    const jenis_pendaftaran = await JenisPendaftaran.findByPk(JenisPendaftaranId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_pendaftaran) {
      return res.status(404).json({
        message: `<===== Jenis Pendaftaran With ID ${JenisPendaftaranId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jenis Pendaftaran By ID ${JenisPendaftaranId} Success:`,
      data: jenis_pendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJenisPendaftaran,
  getJenisPendaftaranById,
};
