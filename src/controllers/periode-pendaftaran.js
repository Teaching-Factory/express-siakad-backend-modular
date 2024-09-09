const { PeriodePendaftaran, Semester, JalurMasuk, SistemKuliah } = require("../../models");

const getAllPeriodePendaftaran = async (req, res, next) => {
  try {
    // Ambil semua data periode_pendaftarans dari database
    const periode_pendaftarans = await PeriodePendaftaran.findAll({
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Periode Pendaftaran Success",
      jumlahData: periode_pendaftarans.length,
      data: periode_pendaftarans
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodePendaftaranByFilter = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;
    const jalurMasukId = req.params.id_jalur_masuk;
    const sistemKuliahId = req.params.id_sistem_kuliah;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required"
      });
    }
    if (!jalurMasukId) {
      return res.status(400).json({
        message: "Jalur Masuk ID is required"
      });
    }
    if (!sistemKuliahId) {
      return res.status(400).json({
        message: "Sistem Kuliah ID is required"
      });
    }

    // Ambil semua data periode_pendaftarans dari database
    const periode_pendaftarans = await PeriodePendaftaran.findAll({
      where: {
        id_semester: semesterId,
        id_jalur_masuk: jalurMasukId,
        id_sistem_kuliah: sistemKuliahId
      },
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Periode Pendaftaran By Filter Success",
      jumlahData: periode_pendaftarans.length,
      data: periode_pendaftarans
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodePendaftaranById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required"
      });
    }

    // Cari data periode_pendaftaran berdasarkan ID di database
    const periode_pendaftaran = await PeriodePendaftaran.findByPk(periodePendaftaranId, {
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran With ID ${periodePendaftaranId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Periode Pendaftaran By ID ${periodePendaftaranId} Success:`,
      data: periode_pendaftaran
    });
  } catch (error) {
    next(error);
  }
};

// const createJabatan = async (req, res, next) => {
//   const { nama_jabatan } = req.body;

//   if (!nama_jabatan) {
//     return res.status(400).json({ message: "nama_jabatan is required" });
//   }

//   try {
//     // Gunakan metode create untuk membuat data jabatan baru
//     const newJabatan = await Jabatan.create({ nama_jabatan });

//     // Kirim respons JSON jika berhasil
//     res.status(201).json({
//       message: "<===== CREATE Jabatan Success",
//       data: newJabatan
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const updateJabatanById = async (req, res, next) => {
//   // Dapatkan data yang akan diupdate dari body permintaan
//   const { nama_jabatan } = req.body;

//   if (!nama_jabatan) {
//     return res.status(400).json({ message: "nama_jabatan is required" });
//   }

//   try {
//     // Dapatkan ID dari parameter permintaan
//     const jabatanId = req.params.id;

//     if (!jabatanId) {
//       return res.status(400).json({
//         message: "Jabatan ID is required"
//       });
//     }

//     // Cari data jabatan berdasarkan ID di database
//     let jabatan = await Jabatan.findByPk(jabatanId);

//     // Jika data tidak ditemukan, kirim respons 404
//     if (!jabatan) {
//       return res.status(404).json({
//         message: `<===== Jabatan With ID ${jabatanId} Not Found:`
//       });
//     }

//     // Update data jabatan
//     jabatan.nama_jabatan = nama_jabatan;

//     // Simpan perubahan ke dalam database
//     await jabatan.save();

//     // Kirim respons JSON jika berhasil
//     res.status(200).json({
//       message: `<===== UPDATE Jabatan With ID ${jabatanId} Success:`,
//       data: jabatan
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const deletePeriodePendaftaranById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Jabatan ID is required"
      });
    }

    // Cari data periode_pendaftaran berdasarkan ID di database
    let periode_pendaftaran = await PeriodePendaftaran.findByPk(periodePendaftaranId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran With ID ${periodePendaftaranId} Not Found:`
      });
    }

    // Hapus data periode_pendaftaran dari database
    await periode_pendaftaran.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Periode Pendaftaran With ID ${periodePendaftaranId} Success:`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPeriodePendaftaran,
  getPeriodePendaftaranByFilter,
  getPeriodePendaftaranById,
  //   createJabatan,
  //   updateJabatanById,
  deletePeriodePendaftaranById
};
