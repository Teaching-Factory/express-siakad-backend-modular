const { AlatTransportasi } = require("../../../models");

const getAllAlatTransportasi = async (req, res, next) => {
  try {
    // Ambil semua data alat_transportasi dari database
    const alat_transportasi = await AlatTransportasi.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Alat Transportasi Success",
      jumlahData: alat_transportasi.length,
      data: alat_transportasi,
    });
  } catch (error) {
    next(error);
  }
};

const getAlatTransportasiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const AlatTransportasiId = req.params.id;

    // Cari data alat_transportasi berdasarkan ID di database
    const alat_transportasi = await AlatTransportasi.findByPk(AlatTransportasiId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!alat_transportasi) {
      return res.status(404).json({
        message: `<===== Alat Transportasi With ID ${AlatTransportasiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Alat Transportasi By ID ${AlatTransportasiId} Success:`,
      data: alat_transportasi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAlatTransportasi,
  getAlatTransportasiById,
};
