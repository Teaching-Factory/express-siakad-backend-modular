const { KRSMahasiswa, TahunAjaran } = require("../../models");

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

const getKRSMahasiswaByMahasiswaId = async (req, res, next) => {
  try {
    // Mengambil data tahun ajaran yang kolom a_periode bernilai = 1
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Jika data tahun ajaran tidak ditemukan, kirim respons 404
    if (!tahunAjaran) {
      return res.status(404).json({
        message: "Tahun Ajaran with a_periode 1 not found",
      });
    }

    // Dapatkan ID dari parameter permintaan
    const idRegistrasiMahasiswa = req.params.id_registrasi_mahasiswa;

    // Cari data krs_mahasiswa berdasarkan id_registrasi_mahasiswa dan id_tahun_ajaran di database
    const krsMahasiswa = await KRSMahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: idRegistrasiMahasiswa,
        angkatan: tahunAjaran.id_tahun_ajaran,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!krsMahasiswa || krsMahasiswa.length === 0) {
      return res.status(404).json({
        message: `<===== KRS Mahasiswa With ID ${idRegistrasiMahasiswa} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET KRS Mahasiswa By ID ${idRegistrasiMahasiswa} Success:`,
      jumlahData: krsMahasiswa.length,
      data: krsMahasiswa,
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
  getKRSMahasiswaByMahasiswaId,
  // createKrsMahasiswa,
  // updateKrsMahasiswaById,
  // deleteKrsMahasiswaById,
  // getAllMahasiswaBelumKrs,
};
