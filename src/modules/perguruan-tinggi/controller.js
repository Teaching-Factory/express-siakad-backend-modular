const { PerguruanTinggi, SettingWSFeeder, ProfilPT } = require("../../../models");

const getAllPerguruanTinggi = async (req, res, next) => {
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

const getPerguruanTinggiById = async (req, res, next) => {
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
  // Ambil data untuk update dari body permintaan
  const { kode_perguruan_tinggi, nama_perguruan_tinggi, nama_singkat } = req.body;

  // validasi required
  if (!kode_perguruan_tinggi) {
    return res.status(400).json({ message: "kode_perguruan_tinggi is required" });
  }
  if (!nama_perguruan_tinggi) {
    return res.status(400).json({ message: "nama_perguruan_tinggi is required" });
  }
  if (!nama_singkat) {
    return res.status(400).json({ message: "nama_singkat is required" });
  }

  // valiasi tipe data
  if (typeof kode_perguruan_tinggi !== "string") {
    return res.status(400).json({ message: "kode_perguruan_tinggi must be a string" });
  }
  if (typeof nama_perguruan_tinggi !== "string") {
    return res.status(400).json({ message: "nama_perguruan_tinggi must be a string" });
  }
  if (typeof nama_singkat !== "string") {
    return res.status(400).json({ message: "nama_singkat must be a string" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const perguruanTinggiId = req.params.id;

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

const getDataKopSurat = async (req, res, next) => {
  try {
    // ambil data perguruan tinggi yang aktif berdasarkan web service
    const settingWSFeeder = await SettingWSFeeder.findOne({
      where: {
        status: true,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!settingWSFeeder) {
      return res.status(404).json({
        message: `Setting WS Feeder With Active Not Found:`,
      });
    }

    const perguruanTinggi = await PerguruanTinggi.findOne({
      where: {
        kode_perguruan_tinggi: settingWSFeeder.username_feeder,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!perguruanTinggi) {
      return res.status(404).json({
        message: `Perguruan Tinggi Not Found:`,
      });
    }

    const profilPT = await ProfilPT.findOne({
      where: {
        id_perguruan_tinggi: perguruanTinggi.id_perguruan_tinggi,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!profilPT) {
      return res.status(404).json({
        message: `Profil PT Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET Data Kop Surat Success",
      perguruanTinggi: perguruanTinggi,
      data: profilPT,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPerguruanTinggi,
  getPerguruanTinggiById,
  updatePerguruanTinggiById,
  getDataKopSurat,
};
