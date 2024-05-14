const { PerguruanTinggi } = require("../../models");

const getAllPerguruanTinggi = async (req, res) => {
  try {
    // Ambil semua data perguruan_tinggi dari database
    const perguruan_tinggi = await PerguruanTinggi.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Perguruan Tinggi Success",
      jumlahData: perguruan_tinggi.length,
      data: perguruan_tinggi,
    });
  } catch (error) {
    next(error);
  }
};

const getPerguruanTinggiById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const perguruanTinggiId = req.params.id;

    // Cari data perguruan_tinggi berdasarkan ID di database
    const perguruan_tinggi = await PerguruanTinggi.findByPk(perguruanTinggiId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!perguruan_tinggi) {
      return res.status(404).json({
        message: `<===== Perguruan Tinggi With ID ${perguruanTinggiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Perguruan Tinggi By ID ${perguruanTinggiId} Success:`,
      data: perguruan_tinggi,
    });
  } catch (error) {
    next(error);
  }
};

const updatePerguruanTinggiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const perguruanTinggiId = req.params.id;

    // Ambil data untuk update dari body permintaan
    const { kode_perguruan_tinggi, nama_perguruan_tinggi, nama_singkat } = req.body;

    // Temukan perguruan_tinggi yang akan diperbarui berdasarkan ID
    const perguruan_tinggi = await PerguruanTinggi.findByPk(perguruanTinggiId);

    if (!perguruan_tinggi) {
      return res.status(404).json({ message: "Perguruan Tinggi tidak ditemukan" });
    }

    // Update data perguruan_tinggi
    perguruan_tinggi.kode_perguruan_tinggi = kode_perguruan_tinggi || perguruan_tinggi.kode_perguruan_tinggi;
    perguruan_tinggi.nama_perguruan_tinggi = nama_perguruan_tinggi || perguruan_tinggi.nama_perguruan_tinggi;
    perguruan_tinggi.nama_singkat = nama_singkat || perguruan_tinggi.nama_singkat;

    await perguruan_tinggi.save();

    res.json({
      message: "UPDATE Perguruan Tinggi Success",
      dataPerguruanTinggi: perguruan_tinggi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPerguruanTinggi,
  getPerguruanTinggiById,
  updatePerguruanTinggiById,
};
