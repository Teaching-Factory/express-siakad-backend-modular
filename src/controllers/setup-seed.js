const { sequelize } = require("../../models");
const JabatanSeeder = require("../../seeders/20240905041020-seed-jabatan");
const LaporanPMBSeeder = require("../../seeders/20240905041024-seed-laporan-pmb");
const CPPMBSeeder = require("../../seeders/20240905063929-seed-contact-person-pmb");
const SumberSeeder = require("../../seeders/20240909060852-seed-sumber");
const SistemKuliahSeeder = require("../../seeders/20240909073147-seed-sistem-kuliah");
const UserGuideSeeder = require("../../seeders/20240910034158-seed-user-guide-pmb");
const PengaturanPMBSeeder = require("../../seeders/20240919031343-seed-pengaturan-pmb");
const JenisTagihanSeeder = require("../../seeders/20240919070327-seed-jenis-tagihan");
const SettingGlobalSeeder = require("../../seeders/20241002080630-seed-setting-global");

const setupSeederJabatan = async (req, res, next) => {
  try {
    // seed data
    await JabatanSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Setup Seeder Jabatan Success",
    });
  } catch (error) {
    next(error);
  }
};

const setupSeederLaporanPMB = async (req, res, next) => {
  try {
    // seed data
    await LaporanPMBSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Setup Seeder Laporan PMB Success",
    });
  } catch (error) {
    next(error);
  }
};

const setupSeederCPPMB = async (req, res, next) => {
  try {
    // seed data
    await CPPMBSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Setup Seeder CP PMB Success",
    });
  } catch (error) {
    next(error);
  }
};

const setupSeederSumber = async (req, res, next) => {
  try {
    // seed data
    await SumberSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Setup Seeder Sumber Success",
    });
  } catch (error) {
    next(error);
  }
};

const setupSeederSistemKuliah = async (req, res, next) => {
  try {
    // seed data
    await SistemKuliahSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Setup Seeder Sistem Kuliah Success",
    });
  } catch (error) {
    next(error);
  }
};

const setupSeederUserGuidePMB = async (req, res, next) => {
  try {
    // seed data
    await UserGuideSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Setup Seeder User Guide PMB Success",
    });
  } catch (error) {
    next(error);
  }
};

const setupSeederPengaturanPMB = async (req, res, next) => {
  try {
    // seed data
    await PengaturanPMBSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Setup Seeder Pengaturan PMB Success",
    });
  } catch (error) {
    next(error);
  }
};

const setupSeederJenisTagihan = async (req, res, next) => {
  try {
    // seed data
    await JenisTagihanSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Setup Seeder Jenis Tagihan Success",
    });
  } catch (error) {
    next(error);
  }
};

const setupSeederSettingGlobal = async (req, res, next) => {
  try {
    // seed data
    await SettingGlobalSeeder.up(sequelize.getQueryInterface(), sequelize);

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Setup Seeder Setting Global Success",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  setupSeederJabatan,
  setupSeederLaporanPMB,
  setupSeederCPPMB,
  setupSeederSumber,
  setupSeederSistemKuliah,
  setupSeederUserGuidePMB,
  setupSeederPengaturanPMB,
  setupSeederJenisTagihan,
  setupSeederSettingGlobal,
};
