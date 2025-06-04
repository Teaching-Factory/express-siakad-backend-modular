const { Prodi, JenjangPendidikan } = require("../../../models");

const getAllProdiByGuest = async (req, res, next) => {
  try {
    // Ambil semua data prodi dari database
    const prodis = await Prodi.findAll({ include: [{ model: JenjangPendidikan }] });

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodis || prodis.length === 0) {
      return res.status(404).json({
        message: `<===== Prodi Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Prodi by Guest Success",
      jumlahData: prodis.length,
      data: prodis,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProdiByGuest,
};
