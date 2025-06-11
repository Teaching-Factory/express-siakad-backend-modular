const {
  PeriodePendaftaran,
  Semester,
  JalurMasuk,
  SistemKuliah,
  ProdiPeriodePendaftaran,
  BerkasPeriodePendaftaran,
  SumberPeriodePendaftaran,
  Prodi,
  JenisBerkas,
  Sumber,
  JenjangPendidikan,
} = require("../../../models");

const getPeriodePendaftaranDibuka = async (req, res, next) => {
  try {
    // Cari data periode_pendaftaran_dibuka berdasarkan ID di database
    const periode_pendaftaran_dibuka = await PeriodePendaftaran.findAll({
      where: {
        dibuka: true,
      },
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_pendaftaran_dibuka) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran Dibuka Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Periode Pendaftaran Dibuka Success:`,
      jumlahData: periode_pendaftaran_dibuka.length,
      data: periode_pendaftaran_dibuka,
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodePendaftaranGuestById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    // Cari data periode_pendaftaran berdasarkan ID di database
    const periode_pendaftaran = await PeriodePendaftaran.findByPk(periodePendaftaranId, {
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran With ID ${periodePendaftaranId} Not Found:`,
      });
    }

    // Get berkas periode pendaftaran dengan include dan alias yang sesuai
    const berkas_periode_pendaftaran = await BerkasPeriodePendaftaran.findAll({
      where: { id_periode_pendaftaran: periodePendaftaranId },
      include: [{ model: JenisBerkas, as: "JenisBerkas" }], // Pastikan 'jenisBerkas' sesuai dengan alias yang ditentukan
    });

    // Get sumber periode pendaftaran
    const sumber_periode_pendaftaran = await SumberPeriodePendaftaran.findAll({
      where: { id_periode_pendaftaran: periodePendaftaranId },
      include: [{ model: Sumber, as: "Sumber" }],
    });

    // Get prodi periode pendaftaran
    const prodi_periode_pendaftaran = await ProdiPeriodePendaftaran.findAll({
      where: { id_periode_pendaftaran: periodePendaftaranId },
      include: [{ model: Prodi, as: "Prodi", include: [{ model: JenjangPendidikan }] }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Periode Pendaftaran By ID ${periodePendaftaranId} Success:`,
      data: periode_pendaftaran,
      berkas: berkas_periode_pendaftaran,
      sumber: sumber_periode_pendaftaran,
      prodi: prodi_periode_pendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPeriodePendaftaranDibuka,
  getPeriodePendaftaranGuestById,
};
