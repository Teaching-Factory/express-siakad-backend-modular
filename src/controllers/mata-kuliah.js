const { MataKuliah } = require("../../models");

const getAllMataKuliah = async (req, res) => {
  try {
    // Ambil semua data mata_kuliah dari database
    const mata_kuliah = await MataKuliah.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mata Kuliah Success",
      jumlahData: mata_kuliah.length,
      data: mata_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getMataKuliahById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const MataKuliahId = req.params.id;

    // Cari data mata_kuliah berdasarkan ID di database
    const mata_kuliah = await MataKuliah.findByPk(MataKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!mata_kuliah) {
      return res.status(404).json({
        message: `<===== Mata Kuliah With ID ${MataKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Mata Kuliah By ID ${MataKuliahId} Success:`,
      data: mata_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

// const createMataKuliah = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses create mata kuliah",
//   });
// };

// const updateMataKuliahById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const mataKuliahId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses update mata kuliah by id",
//     mataKuliahId: mataKuliahId,
//   });
// };

// const deleteMataKuliahById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const mataKuliahId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses delete mata kuliah by id",
//     mataKuliahId: mataKuliahId,
//   });
// };

module.exports = {
  getAllMataKuliah,
  getMataKuliahById,
  // createMataKuliah,
  // updateMataKuliahById,
  // deleteMataKuliahById,
};
