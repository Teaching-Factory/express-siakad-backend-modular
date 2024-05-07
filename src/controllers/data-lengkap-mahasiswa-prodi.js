const { DataLengkapMahasiswaProdi } = require("../../models");

const getAllDataLengkapMahasiswaProdi = async (req, res) => {
  try {
    // Ambil semua data data_lengkap_mahasiswa_prodi dari database
    const data_lengkap_mahasiswa_prodi = await DataLengkapMahasiswaProdi.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Data Lengkap Mahasiswa Prodi Success",
      jumlahData: data_lengkap_mahasiswa_prodi.length,
      data: data_lengkap_mahasiswa_prodi,
    });
  } catch (error) {
    next(error);
  }
};

const getDataLengkapMahasiswaProdiById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DataLengkapMahasiswaProdiId = req.params.id;

    // Cari data data_lengkap_mahasiswa_prodi berdasarkan ID di database
    const data_lengkap_mahasiswa_prodi = await DataLengkapMahasiswaProdi.findByPk(DataLengkapMahasiswaProdiId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!data_lengkap_mahasiswa_prodi) {
      return res.status(404).json({
        message: `<===== Data Lengkap Mahasiswa Prodi With ID ${DataLengkapMahasiswaProdiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Data Lengkap Mahasiswa Prodi By ID ${DataLengkapMahasiswaProdiId} Success:`,
      data: data_lengkap_mahasiswa_prodi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDataLengkapMahasiswaProdi,
  getDataLengkapMahasiswaProdiById,
};
