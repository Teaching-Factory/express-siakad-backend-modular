const { JenisSMS } = require("../../models");

const getAllJenisSMS = async (req, res, next) => {
  try {
    // Ambil semua data jenis_sms dari database
    const jenis_sms = await JenisSMS.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenis SMS Success",
      jumlahData: jenis_sms.length,
      data: jenis_sms,
    });
  } catch (error) {
    next(error);
  }
};

const getJenisSMSById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const JenisSMSId = req.params.id;

    // Periksa apakah ID disediakan
    if (!JenisSMSId) {
      return res.status(400).json({
        message: "Jenis SMS ID is required",
      });
    }

    // Cari data jenis_sms berdasarkan ID di database
    const jenis_sms = await JenisSMS.findByPk(JenisSMSId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_sms) {
      return res.status(404).json({
        message: `<===== Jenis SMS With ID ${JenisSMSId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jenis SMS By ID ${JenisSMSId} Success:`,
      data: jenis_sms,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJenisSMS,
  getJenisSMSById,
};
