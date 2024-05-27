const { KelasKuliah, MataKuliah } = require("../../models");

const getAllKelasKuliah = async (req, res) => {
  try {
    // Ambil semua data kelas_kuliah dari database
    const kelas_kuliah = await KelasKuliah.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kelas Kuliah Success",
      jumlahData: kelas_kuliah.length,
      data: kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getKelasKuliahById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const KelasKuliahId = req.params.id;

    // Cari data kelas_kuliah berdasarkan ID di database
    const kelas_kuliah = await KelasKuliah.findByPk(KelasKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Kelas Kuliah With ID ${KelasKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Kelas Kuliah By ID ${KelasKuliahId} Success:`,
      data: kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const GetAllKelasKuliahByProdiAndSemesterId = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;

    // Ambil semua data kelas_kuliah dari database
    const kelas_kuliah = await KelasKuliah.findAll({
      where: {
        id_prodi: prodiId,
        id_semester: semesterId,
      },
    });

    // Ambil semua data mata_kuliah dari database
    const mata_kuliah = await MataKuliah.findAll({
      where: {
        id_prodi: prodiId,
      },
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kelas Kuliah By Prodi and Semester Id Success",
      jumlahDataKelasKuliah: kelas_kuliah.length,
      jumlahDataMataKuliah: mata_kuliah.length,
      dataKelasKuliah: kelas_kuliah,
      dataMataKuliah: mata_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKelasKuliah,
  getKelasKuliahById,
  GetAllKelasKuliahByProdiAndSemesterId,
};
