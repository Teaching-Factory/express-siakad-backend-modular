const { MatkulKurikulum, Kurikulum, MataKuliah } = require("../../../models");

const getAllMatkulKurikulum = async (req, res, next) => {
  try {
    // Ambil semua data matkul_kurikulum dari database
    const matkul_kurikulum = await MatkulKurikulum.findAll({ include: [{ model: Kurikulum }, { model: MataKuliah }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Matkul Kurikulum Success",
      jumlahData: matkul_kurikulum.length,
      data: matkul_kurikulum,
    });
  } catch (error) {
    next(error);
  }
};

const getMatkulKurikulumById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const MatkulKurikulumId = req.params.id;

    // Periksa apakah ID disediakan
    if (!MatkulKurikulumId) {
      return res.status(400).json({
        message: "Matkul Kurikulum ID is required",
      });
    }

    // Cari data matkul_kurikulum berdasarkan ID di database
    const matkul_kurikulum = await MatkulKurikulum.findByPk(MatkulKurikulumId, {
      include: [{ model: Kurikulum }, { model: MataKuliah }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!matkul_kurikulum) {
      return res.status(404).json({
        message: `<===== Matkul Kurikulum With ID ${MatkulKurikulumId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Matkul Kurikulum By ID ${MatkulKurikulumId} Success:`,
      data: matkul_kurikulum,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMatkulKurikulum,
  getMatkulKurikulumById,
};
