const { SettingWSFeeder } = require("../../../models");

const getAllSettingWSFeeder = async (req, res, next) => {
  try {
    // Ambil semua data setting_ws_feeders dari database
    const setting_ws_feeders = await SettingWSFeeder.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Setting WS Feeder Success",
      jumlahData: setting_ws_feeders.length,
      data: setting_ws_feeders
    });
  } catch (error) {
    next(error);
  }
};

const getSettingWSFeederById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const settingWsFeederId = req.params.id;

    if (!settingWsFeederId) {
      return res.status(400).json({
        message: "Setting WS Feeder ID is required"
      });
    }

    // Cari data setting_ws_feeder berdasarkan ID di database
    const setting_ws_feeder = await SettingWSFeeder.findByPk(settingWsFeederId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!setting_ws_feeder) {
      return res.status(404).json({
        message: `<===== Setting WS Feeder With ID ${settingWsFeederId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Setting WS Feeder By ID ${settingWsFeederId} Success:`,
      data: setting_ws_feeder
    });
  } catch (error) {
    next(error);
  }
};

const getSettingWSFeederAktif = async (req, res, next) => {
  try {
    // Cari data setting_ws_feeder_aktif berdasarkan ID di database
    const setting_ws_feeder_aktif = await SettingWSFeeder.findOne({
      where: {
        status: true
      }
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!setting_ws_feeder_aktif) {
      return res.status(404).json({
        message: `<===== Setting WS Feeder Aktif Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Setting WS Feeder Aktif Success:`,
      data: setting_ws_feeder_aktif
    });
  } catch (error) {
    next(error);
  }
};

const createSettingWSFeeder = async (req, res, next) => {
  const { url_feeder, username_feeder, password_feeder, status } = req.body;

  if (!url_feeder) {
    return res.status(400).json({ message: "url_feeder is required" });
  }
  if (!username_feeder) {
    return res.status(400).json({ message: "username_feeder is required" });
  }
  if (!password_feeder) {
    return res.status(400).json({ message: "password_feeder is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  try {
    // Gunakan metode create untuk membuat data setting ws feeder baru
    const newSettingWSFeeder = await SettingWSFeeder.create({ url_feeder, username_feeder, password_feeder, status });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Setting WS Feeder Success",
      data: newSettingWSFeeder
    });
  } catch (error) {
    next(error);
  }
};

const updateSettingWSFeeder = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { url_feeder, username_feeder, password_feeder } = req.body;

  if (!url_feeder) {
    return res.status(400).json({ message: "url_feeder is required" });
  }
  if (!username_feeder) {
    return res.status(400).json({ message: "username_feeder is required" });
  }
  if (!password_feeder) {
    return res.status(400).json({ message: "password_feeder is required" });
  }

  try {
    // get data setting ws feeder, dengan status bernilai true
    const setting_ws_feeder = await SettingWSFeeder.findOne({
      where: {
        status: true
      }
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!setting_ws_feeder) {
      return res.status(404).json({
        message: `<===== Setting WS Feeder Not Found:`
      });
    }

    // Update data setting_ws_feeder
    setting_ws_feeder.url_feeder = url_feeder;
    setting_ws_feeder.username_feeder = username_feeder;
    setting_ws_feeder.password_feeder = password_feeder;

    // Simpan perubahan ke dalam database
    await setting_ws_feeder.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Setting WS Feeder Success:`,
      data: setting_ws_feeder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSettingWSFeeder,
  getSettingWSFeederById,
  getSettingWSFeederAktif,
  createSettingWSFeeder,
  updateSettingWSFeeder
};
