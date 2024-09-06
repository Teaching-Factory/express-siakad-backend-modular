const { Mahasiswa, Prodi, SettingGlobalSemester, KRSMahasiswa, Angkatan, DosenWali, Dosen } = require("../../models");
const { Op } = require("sequelize");

// Fungsi untuk mengkonversi tahun ke format periode masuk
const convertTahunToNamaPeriodeMasuk = (tahun) => {
  return `${tahun}%`; // Akan mencocokkan format '2020%'
};

const getRekapMahasiswaBelumKRS = async (req, res, next) => {
  const { id_angkatan, id_prodi, format, tanggal_penandatanganan } = req.query;

  if (!id_angkatan) {
    return res.status(400).json({ message: "id_angkatan is required" });
  }
  if (!id_prodi) {
    return res.status(400).json({ message: "id_prodi is required" });
  }
  if (!format) {
    return res.status(400).json({ message: "format is required" });
  }
  if (!tanggal_penandatanganan) {
    return res.status(400).json({ message: "tanggal_penandatanganan is required" });
  }

  try {
    // Mengambil data angkatan berdasarkan id_angkatan
    const angkatan = await Angkatan.findOne({
      where: {
        id: id_angkatan
      }
    });

    if (!angkatan) {
      return res.status(404).json({ message: `Angkatan With ID ${id_angkatan} Not Found` });
    }

    // get data setting global semester
    const setting_global_semester = await SettingGlobalSemester.findOne({
      where: {
        status: true
      }
    });

    if (!setting_global_semester) {
      return res.status(404).json({
        message: "Setting Global Semester Aktif not found"
      });
    }

    // Mengambil id semester aktif
    const id_semester_aktif = setting_global_semester.id_semester_krs;

    // Mengambil seluruh data KRS mahasiswa semester sekarang dengan mengambil id_registrasi_mahasiswa
    const krs_mahasiswa_now = await KRSMahasiswa.findAll({
      where: {
        id_semester: id_semester_aktif
      },
      attributes: ["id_registrasi_mahasiswa"] // Hanya ambil id_registrasi_mahasiswa untuk filtering
    });

    // Mengambil seluruh mahasiswa berdasarkan angkatan dan prodi
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        nama_periode_masuk: {
          [Op.like]: convertTahunToNamaPeriodeMasuk(angkatan.tahun)
        },
        id_prodi: id_prodi
      },
      include: { model: Prodi }
    });

    // Filter mahasiswa yang tidak memiliki entri KRS di semester aktif
    const mahasiswa_belum_krs = mahasiswas.filter((mahasiswa) => {
      return !krs_mahasiswa_now.some((krs) => krs.id_registrasi_mahasiswa === mahasiswa.id_registrasi_mahasiswa);
    });

    // Mengambil data dosen wali untuk mahasiswa yang belum KRS
    const idRegistrasiMahasiswaBelumKRS = mahasiswa_belum_krs.map((mhs) => mhs.id_registrasi_mahasiswa);
    const dosen_wali_mahasiswas = await DosenWali.findAll({
      where: {
        id_registrasi_mahasiswa: {
          [Op.in]: idRegistrasiMahasiswaBelumKRS
        },
        id_tahun_ajaran: angkatan.tahun
      },
      include: [{ model: Dosen }]
    });

    // Menggabungkan data dosen wali dengan data mahasiswa
    const mahasiswaBelumKRSWithDosenWali = mahasiswa_belum_krs.map((mahasiswa) => {
      const dosenWali = dosen_wali_mahasiswas.find((dw) => dw.id_registrasi_mahasiswa === mahasiswa.id_registrasi_mahasiswa);
      return {
        ...mahasiswa.toJSON(),
        dosen_wali: dosenWali ? dosenWali.Dosen : null
      };
    });

    res.json({
      message: "Get Rekap Mahasiswa Belum KRS Success",
      semesterAktif: setting_global_semester,
      tanggal_penandatanganan: tanggal_penandatanganan,
      angkatan: angkatan,
      format: format,
      jumlahData: mahasiswaBelumKRSWithDosenWali.length,
      dataRekapMahasiswaBelumKRS: mahasiswaBelumKRSWithDosenWali
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRekapMahasiswaBelumKRS
};
