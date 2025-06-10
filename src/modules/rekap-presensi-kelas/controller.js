const { KelasKuliah, Prodi, JenjangPendidikan, Dosen, MataKuliah, PertemuanPerkuliahan, PesertaKelasKuliah, Mahasiswa, PresensiMahasiswa, Semester } = require("../../../models");

const getRekapPresensiKelasByFilter = async (req, res, next) => {
  const { id_semester, id_prodi, nama_kelas_kuliah, format, tanggal_penandatanganan } = req.query;

  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }
  if (!id_prodi) {
    return res.status(400).json({ message: "id_prodi is required" });
  }
  if (!nama_kelas_kuliah) {
    return res.status(400).json({ message: "nama_kelas_kuliah is required" });
  }
  if (!format) {
    return res.status(400).json({ message: "format is required" });
  }
  if (!tanggal_penandatanganan) {
    return res.status(400).json({ message: "tanggal_penandatanganan is required" });
  }

  try {
    // Ambil data kelas kuliah
    const kelas_kuliah = await KelasKuliah.findOne({
      where: {
        id_semester: id_semester,
        id_prodi: id_prodi,
        nama_kelas_kuliah: nama_kelas_kuliah,
      },
      include: [{ model: MataKuliah }, { model: Semester }, { model: Dosen }, { model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });

    if (!kelas_kuliah) {
      return res.status(404).json({ message: "Kelas kuliah not found" });
    }

    // Menghitung jumlah peserta kelas kuliah
    const peserta_kelas_kuliah = await PesertaKelasKuliah.findAll({
      where: {
        id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah,
      },
      include: [{ model: Mahasiswa }],
    });

    // Menghitung jumlah pertemuan perkuliahan
    const pertemuan_perkuliahan_count = await PertemuanPerkuliahan.count({
      where: {
        id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah,
      },
    });

    // Ambil data presensi mahasiswa berdasarkan kelas kuliah
    const presensi_mahasiswa = await PresensiMahasiswa.findAll({
      include: [
        {
          model: PertemuanPerkuliahan,
          where: {
            id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah,
          },
        },
      ],
    });

    // Menghitung presensi kehadiran mahasiswa
    const rekap_presensi_kehadiran = peserta_kelas_kuliah.map((peserta) => {
      const presensi_peserta = presensi_mahasiswa.filter((presensi) => presensi.id_mahasiswa === peserta.id_mahasiswa);

      const jumlah_kehadiran = presensi_peserta.filter((presensi) => presensi.status_presensi === "Hadir").length;
      const jumlah_izin = presensi_peserta.filter((presensi) => presensi.status_presensi === "Izin").length;
      const jumlah_sakit = presensi_peserta.filter((presensi) => presensi.status_presensi === "Sakit").length;
      const jumlah_alfa = presensi_peserta.filter((presensi) => presensi.status_presensi === "Alfa").length;

      // Perhitungan presentase kehadiran memperhitungkan kehadiran, izin, dan sakit sebagai hadir
      const total_hadir = jumlah_kehadiran + jumlah_izin + jumlah_sakit;
      const presentase_kehadiran = ((total_hadir / pertemuan_perkuliahan_count) * 100).toFixed(2);

      return {
        ...peserta.toJSON(),
        jumlah_kehadiran,
        jumlah_izin,
        jumlah_sakit,
        jumlah_alfa,
        presentase_kehadiran,
      };
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET Rekap Presensi Kelas By Filter Success",
      format: format,
      tanggal_penandatanganan: tanggal_penandatanganan,
      kelas_kuliah: kelas_kuliah,
      jumlah_peserta: peserta_kelas_kuliah.length,
      jumlah_pertemuan: pertemuan_perkuliahan_count,
      jumlahData: rekap_presensi_kehadiran.length,
      data: rekap_presensi_kehadiran,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRekapPresensiKelasByFilter,
};

module.exports = {
  getRekapPresensiKelasByFilter,
};
