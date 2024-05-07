const { AktivitasMahasiswa } = require("../../models");

const getAllAktivitasMahasiswa = async (req, res) => {
  try {
    // Ambil semua data aktivitas_mahasiswa dari database
    const aktivitas_mahasiswa = await AktivitasMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Aktivitas Mahasiswa Success",
      jumlahData: aktivitas_mahasiswa.length,
      data: aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAktivitasMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const AktivitasMahasiswaId = req.params.id;

    // Cari data aktivitas_mahasiswa berdasarkan ID di database
    const aktivitas_mahasiswa = await AktivitasMahasiswa.findByPk(AktivitasMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!aktivitas_mahasiswa) {
      return res.status(404).json({
        message: `<===== Aktivitas Mahasiswa With ID ${AktivitasMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Aktivitas Mahasiswa By ID ${AktivitasMahasiswaId} Success:`,
      data: aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// const createAktivitasMahasiswa = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses create aktivitas mahasiswa",
//   });
// };

// const updateAktivitasMahasiswaById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const aktivitasMahasiswaId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses update aktivitas mahasiswa by id",
//     aktivitasMahasiswaId: aktivitasMahasiswaId,
//   });
// };

// const deleteAktivitasMahasiswaById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const aktivitasMahasiswaId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses delete aktivitas mahasiswa by id",
//     aktivitasMahasiswaId: aktivitasMahasiswaId,
//   });
// };

module.exports = {
  getAllAktivitasMahasiswa,
  getAktivitasMahasiswaById,
  // createAktivitasMahasiswa,
  // updateAktivitasMahasiswaById,
  // deleteAktivitasMahasiswaById,
};
