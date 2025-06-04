const { KebutuhanKhusus } = require("../../../models");

const getAllKebutuhanKhusus = async (req, res, next) => {
  try {
    // Ambil semua data kebutuhan_khusus dari database
    const kebutuhan_khusus = await KebutuhanKhusus.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kebutuhan Khusus Success",
      jumlahData: kebutuhan_khusus.length,
      data: kebutuhan_khusus,
    });
  } catch (error) {
    next(error);
  }
};

const getKebutuhanKhususById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const KebutuhanKhususId = req.params.id;

    // Periksa apakah ID disediakan
    if (!KebutuhanKhususId) {
      return res.status(400).json({
        message: "Kebutuhan Khusus ID is required",
      });
    }

    // Cari data kebutuhan_khusus berdasarkan ID di database
    const kebutuhan_khusus = await KebutuhanKhusus.findByPk(KebutuhanKhususId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!kebutuhan_khusus) {
      return res.status(404).json({
        message: `<===== Kebutuhan Khusus With ID ${KebutuhanKhususId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Kebutuhan Khusus By ID ${KebutuhanKhususId} Success:`,
      data: kebutuhan_khusus,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKebutuhanKhusus,
  getKebutuhanKhususById,
};
