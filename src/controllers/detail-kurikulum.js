const { DetailKurikulum } = require("../../models");

const getAllDetailKurikulum = async (req, res) => {
  try {
    // Ambil semua data detail_kurikulum dari database
    const detail_kurikulum = await DetailKurikulum.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Kurikulum Success",
      jumlahData: detail_kurikulum.length,
      data: detail_kurikulum,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailKurikulumById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DetailKurikulumId = req.params.id;

    // Cari data detail_kurikulum berdasarkan ID di database
    const detail_kurikulum = await DetailKurikulum.findByPk(DetailKurikulumId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!detail_kurikulum) {
      return res.status(404).json({
        message: `<===== Detail Kurikulum With ID ${DetailKurikulumId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Detail Kurikulum By ID ${DetailKurikulumId} Success:`,
      data: detail_kurikulum,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetailKurikulum,
  getDetailKurikulumById,
};
