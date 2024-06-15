const { PerkuliahanMahasiswa, Mahasiswa, Semester, StatusMahasiswa, Pembiayaan } = require("../../models");

const getAllPerkuliahanMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data perkuliahan_mahasiswa dari database
    const perkuliahan_mahasiswa = await PerkuliahanMahasiswa.findAll({ include: [{ model: Mahasiswa }, { model: Semester }, { model: StatusMahasiswa }, { model: Pembiayaan }] });

    // Jika data tidak ditemukan, kirim respons 404
    if (!perkuliahan_mahasiswa || perkuliahan_mahasiswa.length === 0) {
      return res.status(404).json({
        message: `<===== Perkuliahan Mahasiswa Not Found`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Perkuliahan Mahasiswa Success",
      jumlahData: perkuliahan_mahasiswa.length,
      data: perkuliahan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getPerkuliahanMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PerkuliahanMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!PerkuliahanMahasiswaId) {
      return res.status(400).json({
        message: "Perkuliahan Mahasiswa ID is required",
      });
    }

    // Cari data perkuliahan_mahasiswa berdasarkan ID di database
    const perkuliahan_mahasiswa = await PerkuliahanMahasiswa.findByPk(PerkuliahanMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Semester }, { model: StatusMahasiswa }, { model: Pembiayaan }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!perkuliahan_mahasiswa) {
      return res.status(404).json({
        message: `<===== Perkuliahan Mahasiswa With ID ${PerkuliahanMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Perkuliahan Mahasiswa By ID ${PerkuliahanMahasiswaId} Success:`,
      data: perkuliahan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPerkuliahanMahasiswa,
  getPerkuliahanMahasiswaById,
};
