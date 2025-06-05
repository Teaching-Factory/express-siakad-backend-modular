const { Fakultas, JenjangPendidikan } = require("../../../models");

const getAllFakultas = async (req, res, next) => {
  try {
    // Ambil semua data fakukltas dari database
    const fakukltas = await Fakultas.findAll({ include: [{ model: JenjangPendidikan }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Fakultas Success",
      jumlahData: fakukltas.length,
      data: fakukltas,
    });
  } catch (error) {
    next(error);
  }
};

const getFakultasById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const FakultasId = req.params.id;

    // Periksa apakah ID disediakan
    if (!FakultasId) {
      return res.status(400).json({
        message: "Fakultas ID is required",
      });
    }

    // Cari data fakukltas berdasarkan ID di database
    const fakukltas = await Fakultas.findByPk(FakultasId, {
      include: [{ model: JenjangPendidikan }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!fakukltas) {
      return res.status(404).json({
        message: `<===== Fakultas With ID ${FakultasId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Fakultas By ID ${FakultasId} Success:`,
      data: fakukltas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFakultas,
  getFakultasById,
};
