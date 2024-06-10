const { JenjangPendidikan } = require("../../models");

const getAllJenjangPendidikan = async (req, res, next) => {
  try {
    // Ambil semua data jenjang_pendidikan dari database
    const jenjang_pendidikan = await JenjangPendidikan.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenjang Pendidikan Success",
      jumlahData: jenjang_pendidikan.length,
      data: jenjang_pendidikan,
    });
  } catch (error) {
    next(error);
  }
};

const getJenjangPendidikanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const JenjangPendidikanId = req.params.id;

    // Periksa apakah ID disediakan
    if (!JenjangPendidikanId) {
      return res.status(400).json({
        message: "Jenjang Pendidikan ID is required",
      });
    }

    // Cari data jenjang_pendidikan berdasarkan ID di database
    const jenjang_pendidikan = await JenjangPendidikan.findByPk(JenjangPendidikanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenjang_pendidikan) {
      return res.status(404).json({
        message: `<===== Jenjang Pendidikan With ID ${JenjangPendidikanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jenjang Pendidikan By ID ${JenjangPendidikanId} Success:`,
      data: jenjang_pendidikan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJenjangPendidikan,
  getJenjangPendidikanById,
};
