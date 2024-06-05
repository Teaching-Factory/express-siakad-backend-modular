const { Prodi, JenjangPendidikan } = require("../../models");

const getAllProdi = async (req, res, next) => {
  try {
    // Ambil semua data prodi dari database
    const prodi = await Prodi.findAll({ include: [{ model: JenjangPendidikan }] });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodi || prodi.length === 0) {
      return res.status(404).json({
        message: `<===== Prodi Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Prodi Success",
      jumlahData: prodi.length,
      data: prodi,
    });
  } catch (error) {
    next(error);
  }
};

const getProdiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const ProdiId = req.params.id;

    // Cari data prodi berdasarkan ID di database
    const prodi = await Prodi.findByPk(ProdiId, {
      include: [{ model: JenjangPendidikan }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodi) {
      return res.status(404).json({
        message: `<===== Prodi With ID ${ProdiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Prodi By ID ${ProdiId} Success:`,
      data: prodi, // Mengubah objek Sequelize ke bentuk JSON
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProdi,
  getProdiById,
};
