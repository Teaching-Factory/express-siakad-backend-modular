const { SettingGlobal, Prodi, JenjangPendidikan } = require("../../../models");

const getAllSettingGlobals = async (req, res, next) => {
  try {
    // Ambil semua data setting_global dari database
    const setting_global = await SettingGlobal.findAll({
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Setting Global Success",
      jumlahData: setting_global.length,
      data: setting_global
    });
  } catch (error) {
    next(error);
  }
};

const getSettingGlobalById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const settingGlobalId = req.params.id;

    if (!settingGlobalId) {
      return res.status(400).json({
        message: "Setting Global ID is required"
      });
    }

    // Cari data setting_global berdasarkan ID di database
    const setting_global = await SettingGlobal.findByPk(settingGlobalId, {
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!setting_global) {
      return res.status(404).json({
        message: `<===== Setting Global With ID ${settingGlobalId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Setting Global By ID ${settingGlobalId} Success:`,
      data: setting_global
    });
  } catch (error) {
    next(error);
  }
};

const createSettingGlobal = async (req, res, next) => {
  const { id_prodi } = req.body;

  if (!id_prodi) {
    return res.status(400).json({ message: "id_prodi is required" });
  }

  try {
    // Gunakan metode create untuk membuat data setting global baru
    const newSettingGlobal = await SettingGlobal.create({ id_prodi });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Setting Global Success",
      data: newSettingGlobal
    });
  } catch (error) {
    next(error);
  }
};

const updateSettingGlobal = async (req, res, next) => {
  try {
    const { setting_globals } = req.body;

    if (!setting_globals || !Array.isArray(setting_globals)) {
      return res.status(400).json({
        message: "Invalid request body format. 'setting_globals' should be an array."
      });
    }

    const updatePromises = setting_globals.map(async (setting) => {
      const { id, access } = setting;

      if (!id || !Array.isArray(access)) {
        return Promise.reject(new Error(`Invalid format for setting with id ${id}`));
      }

      const updatedFields = access.reduce((acc, item) => {
        return { ...acc, ...item };
      }, {});

      const [updated] = await SettingGlobal.update(updatedFields, {
        where: { id: id }
      });

      if (!updated) {
        return Promise.reject(new Error(`Setting Global ID ${id} not found`));
      }

      return SettingGlobal.findOne({ where: { id: id } });
    });

    const updatedSettings = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Global settings updated successfully",
      data: updatedSettings
    });
  } catch (error) {
    next(error);
  }
};

const deleteSettingGlobalById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const settingGlobalId = req.params.id;

    if (!settingGlobalId) {
      return res.status(400).json({
        message: "Setting Global ID is required"
      });
    }

    // Cari data setting_global berdasarkan ID di database
    let setting_global = await SettingGlobal.findByPk(settingGlobalId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!setting_global) {
      return res.status(404).json({
        message: `<===== Setting Global With ID ${settingGlobalId} Not Found:`
      });
    }

    // Hapus data setting_global dari database
    await setting_global.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Setting Global With ID ${settingGlobalId} Success:`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSettingGlobals,
  getSettingGlobalById,
  createSettingGlobal,
  updateSettingGlobal,
  deleteSettingGlobalById
};
