const { JalurMasuk } = require("../../models");

const getAllJalurMasuk = async (req, res, next) => {
  try {
    // Ambil semua data jalur_masuk dari database
    const jalur_masuk = await JalurMasuk.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jalur Masuk Success",
      jumlahData: jalur_masuk.length,
      data: jalur_masuk,
    });
  } catch (error) {
    next(error);
  }
};

const getJalurMasukById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const JalurMasukId = req.params.id;

    // Cari data jalur_masuk berdasarkan ID di database
    const jalur_masuk = await JalurMasuk.findByPk(JalurMasukId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jalur_masuk) {
      return res.status(404).json({
        message: `<===== Jalur Masuk With ID ${JalurMasukId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jalur Masuk By ID ${JalurMasukId} Success:`,
      data: jalur_masuk,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJalurMasuk,
  getJalurMasukById,
};
