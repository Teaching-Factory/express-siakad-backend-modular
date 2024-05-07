const { Mahasiswa } = require("../../models");

const getAllMahasiswa = async (req, res) => {
  try {
    // Ambil semua data mahasiswa dari database
    const mahasiswa = await Mahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa Success",
      jumlahData: mahasiswa.length,
      data: mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const MahasiswaId = req.params.id;

    // Cari data mahasiswa berdasarkan ID di database
    const mahasiswa = await Mahasiswa.findByPk(MahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!mahasiswa) {
      return res.status(404).json({
        message: `<===== Mahasiswa With ID ${MahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Mahasiswa By ID ${MahasiswaId} Success:`,
      data: mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// const createMahasiswa = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses create mahasiswa",
//   });
// };

// const updateMahasiswaById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const mahasiswaId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses update mahasiswa by id",
//     mahasiswaId: mahasiswaId,
//   });
// };

// const deleteMahasiswaById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const mahasiswaId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses delete mahasiswa by id",
//     mahasiswaId: mahasiswaId,
//   });
// };

// const importMahasiswa = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses import mahasiswa",
//   });
// };

module.exports = {
  getAllMahasiswa,
  getMahasiswaById,
  // createMahasiswa,
  // updateMahasiswaById,
  // deleteMahasiswaById,
  // importMahasiswa,
};
