const { Op } = require("sequelize");
const { SistemKuliah, Mahasiswa, SistemKuliahMahasiswa } = require("../../models");

const getAllSistemKuliah = async (req, res, next) => {
  try {
    // Ambil semua data sistem_kuliah dari database
    const sistem_kuliah = await SistemKuliah.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Sistem Kuliah Success",
      jumlahData: sistem_kuliah.length,
      data: sistem_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getSistemKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const sistemKuliahId = req.params.id;

    // Cari data sistem_kuliah berdasarkan ID di database
    const sistem_kuliah = await SistemKuliah.findByPk(sistemKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!sistem_kuliah) {
      return res.status(404).json({
        message: `<===== Sistem Kuliah With ID ${sistemKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Sistem Kuliah By ID ${sistemKuliahId} Success:`,
      data: sistem_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const createSistemKuliah = async (req, res, next) => {
  try {
    const { nama_sk, kode_sk } = req.body;
    // Gunakan metode create untuk membuat data sistem_kuliah baru
    const newSistemKuliah = await SistemKuliah.create({ nama_sk, kode_sk });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Sistem Kuliah Success",
      data: newSistemKuliah,
    });
  } catch (error) {
    next(error);
  }
};

const updateSistemKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const sistemKuliahId = req.params.id;

    // Dapatkan data yang akan diupdate dari body permintaan
    const { nama_sk, kode_sk } = req.body;

    // Cari data sistem_kuliah berdasarkan ID di database
    let sistem_kuliah = await SistemKuliah.findByPk(sistemKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!sistem_kuliah) {
      return res.status(404).json({
        message: `<===== Unit Sistem Kuliah With ID ${sistemKuliahId} Not Found:`,
      });
    }

    // Update data sistem_kuliah
    sistem_kuliah.nama_sk = nama_sk;
    sistem_kuliah.kode_sk = kode_sk;

    // Simpan perubahan ke dalam database
    await sistem_kuliah.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Unit Sistem Kuliah With ID ${sistemKuliahId} Success:`,
      data: sistem_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSistemKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const sistemKuliahId = req.params.id;

    // Cari data sistem_kuliah berdasarkan ID di database
    let sistem_kuliah = await SistemKuliah.findByPk(sistemKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!sistem_kuliah) {
      return res.status(404).json({
        message: `<===== Sistem Kuliah With ID ${sistemKuliahId} Not Found:`,
      });
    }

    // Hapus data sistem_kuliah dari database
    await sistem_kuliah.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Sistem Kuliah With ID ${sistemKuliahId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMahasiswaBelumSetSK = async (req, res, next) => {
  try {
    // Ambil semua ID mahasiswa yang sudah diatur sistem kuliah
    const mahasiswaYangSudahDisetSK = await SistemKuliahMahasiswa.findAll({
      attributes: ["id_registrasi_mahasiswa"],
    });

    // Ekstrak daftar ID registrasi mahasiswa yang sudah diatur sistem kuliah
    const idMahasiswaSudahDisetSK = mahasiswaYangSudahDisetSK.map((skm) => skm.id_registrasi_mahasiswa);

    // Cari semua mahasiswa yang ID-nya tidak ada di daftar di atas
    const mahasiswasBelumSetSK = await Mahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: {
          [Op.notIn]: idMahasiswaSudahDisetSK.length > 0 ? idMahasiswaSudahDisetSK : [0],
        },
      },
    });

    // Jika data mahasiswa tidak ditemukan, kirim respons 404
    if (!mahasiswasBelumSetSK || mahasiswasBelumSetSK.length === 0) {
      return res.status(404).json({
        message: "Mahasiswa yang belum diatur sistem kuliah tidak ditemukan",
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "GET All Mahasiswa Belum Set Sistem Kuliah Success",
      jumlahData: mahasiswasBelumSetSK.length,
      data: mahasiswasBelumSetSK,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getAllSistemKuliah,
  getSistemKuliahById,
  createSistemKuliah,
  updateSistemKuliahById,
  deleteSistemKuliahById,
  getAllMahasiswaBelumSetSK,
};
