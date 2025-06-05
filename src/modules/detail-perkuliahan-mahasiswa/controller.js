const { DetailPerkuliahanMahasiswa, Mahasiswa, Semester, StatusMahasiswa } = require("../../../models");

const getAllDetailPerkuliahanMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data detail_perkuliahan_mahasiswa dari database
    const detail_perkuliahan_mahasiswa = await DetailPerkuliahanMahasiswa.findAll({ include: [{ model: Mahasiswa }, { model: Semester }, { model: StatusMahasiswa }] });

    // Jika data tidak ditemukan, kirim respons 404
    if (!detail_perkuliahan_mahasiswa || detail_perkuliahan_mahasiswa.length === 0) {
      return res.status(404).json({
        message: `<===== Detail Perkuliahan Mahasiswa Not Found`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Perkuliahan Mahasiswa Success",
      jumlahData: detail_perkuliahan_mahasiswa.length,
      data: detail_perkuliahan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailPerkuliahanMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DetailPerkuliahanMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!DetailPerkuliahanMahasiswaId) {
      return res.status(400).json({
        message: "Detail Perkuliahan Mahasiswa ID is required",
      });
    }

    // Cari data detail_perkuliahan_mahasiswa berdasarkan ID di database
    const detail_perkuliahan_mahasiswa = await DetailPerkuliahanMahasiswa.findByPk(DetailPerkuliahanMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Semester }, { model: StatusMahasiswa }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!detail_perkuliahan_mahasiswa) {
      return res.status(404).json({
        message: `<===== Detail Perkuliahan Mahasiswa With ID ${DetailPerkuliahanMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Detail Perkuliahan Mahasiswa By ID ${DetailPerkuliahanMahasiswaId} Success:`,
      data: detail_perkuliahan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetailPerkuliahanMahasiswa,
  getDetailPerkuliahanMahasiswaById,
};
