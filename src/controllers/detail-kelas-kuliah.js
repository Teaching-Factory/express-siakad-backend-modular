const { DetailKelasKuliah, KelasKuliah, Semester, MataKuliah, Dosen, RuangPerkuliahan } = require("../../models");

const getAllDetailKelasKuliah = async (req, res, next) => {
  try {
    // Ambil semua data detail_kelas_kuliah dari database
    const detail_kelas_kuliah = await DetailKelasKuliah.findAll({ include: [{ model: KelasKuliah, include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }, { model: RuangPerkuliahan }] }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Kelas Kuliah Success",
      jumlahData: detail_kelas_kuliah.length,
      data: detail_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailKelasKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DetailKelasKuliahId = req.params.id;

    // Periksa apakah ID disediakan
    if (!DetailKelasKuliahId) {
      return res.status(400).json({
        message: "Detail Kelas Kuliah ID is required",
      });
    }

    // Cari data detail_kelas_kuliah berdasarkan ID di database
    const detail_kelas_kuliah = await DetailKelasKuliah.findByPk(DetailKelasKuliahId, {
      include: [{ model: KelasKuliah, include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }, { model: RuangPerkuliahan }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!detail_kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Detail Kelas Kuliah With ID ${DetailKelasKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Detail Kelas Kuliah By ID ${DetailKelasKuliahId} Success:`,
      data: detail_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailKelasKuliahByProdiAndSemesterId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;

    // Periksa apakah ID disediakan
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    // Periksa apakah ID disediakan
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    const detail_kelas_kuliah = await DetailKelasKuliah.findAll({
      include: [
        {
          model: KelasKuliah,
          where: {
            id_prodi: prodiId,
            id_semester: semesterId,
          },
          include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }],
        },
        {
          model: RuangPerkuliahan,
        },
      ],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (detail_kelas_kuliah.length === 0) {
      return res.status(404).json({
        message: `<===== Detail Kelas Kuliah With ID Prodi ${prodiId} And ID Semester ${semesterId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Detail Kelas Kuliah By ID Prodi ${prodiId} And ID Semester ${semesterId} Success:`,
      jumlahData: detail_kelas_kuliah.length,
      data: detail_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetailKelasKuliah,
  getDetailKelasKuliahById,
  getDetailKelasKuliahByProdiAndSemesterId,
};
