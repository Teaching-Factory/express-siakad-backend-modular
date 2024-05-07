const { StatusMahasiswa } = require("../../models");

const getAllStatusMahasiswa = async (req, res) => {
  try {
    // Ambil semua data status_mahasiswa dari database
    const status_mahasiswa = await StatusMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Status Mahasiswa Success",
      jumlahData: status_mahasiswa.length,
      data: status_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getStatusMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const StatusMahasiswaId = req.params.id;

    // Cari data status_mahasiswa berdasarkan ID di database
    const status_mahasiswa = await StatusMahasiswa.findByPk(StatusMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!status_mahasiswa) {
      return res.status(404).json({
        message: `<===== Status Mahasiswa With ID ${StatusMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Status Mahasiswa By ID ${StatusMahasiswaId} Success:`,
      data: status_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// const createStatusMahasiswa = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses create status mahasiswa",
//   });
// };

// const updateStatusMahasiswa = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const statusMahasiswaId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses update status mahasiswa by id",
//     statusMahasiswaId: statusMahasiswaId,
//   });
// };

// const updateAllStatusNonAktif = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const prodiId = req.params.id_prodi;

//   res.json({
//     message: "Berhasil mengakses update all status non aktif",
//     prodiId: prodiId,
//   });
// };

module.exports = {
  getAllStatusMahasiswa,
  getStatusMahasiswaById,
  // createStatusMahasiswa,
  // updateStatusMahasiswa,
  // updateAllStatusNonAktif,
};
