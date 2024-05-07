const { KRSMahasiswa } = require("../../models");

const getAllKRSMahasiswa = async (req, res) => {
  try {
    // Ambil semua data krs_mahasiswa dari database
    const krs_mahasiswa = await KRSMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All KRS Mahasiswa Success",
      jumlahData: krs_mahasiswa.length,
      data: krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getKRSMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const KRSMahasiswaId = req.params.id;

    // Cari data krs_mahasiswa berdasarkan ID di database
    const krs_mahasiswa = await KRSMahasiswa.findByPk(KRSMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!krs_mahasiswa) {
      return res.status(404).json({
        message: `<===== KRS Mahasiswa With ID ${KRSMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET KRS Mahasiswa By ID ${KRSMahasiswaId} Success:`,
      data: krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// const createKrsMahasiswa = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses create krs mahasiswa",
//   });
// };

// const updateKrsMahasiswaById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const krsMahasiswaId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses update krs mahasiswa by id",
//     krsMahasiswaId: krsMahasiswaId,
//   });
// };

// const deleteKrsMahasiswaById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const krsMahasiswaId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses delete krs mahasiswa by id",
//     krsMahasiswaId: krsMahasiswaId,
//   });
// };

// const getAllMahasiswaBelumKrs = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses get all mahasiswa belum krs",
//   });
// };

module.exports = {
  getAllKRSMahasiswa,
  getKRSMahasiswaById,
  // createKrsMahasiswa,
  // updateKrsMahasiswaById,
  // deleteKrsMahasiswaById,
  // getAllMahasiswaBelumKrs,
};
