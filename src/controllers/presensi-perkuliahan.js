const { PresensiMahasiswa, PertemuanPerkuliahan, UserRole, Role, User, Mahasiswa } = require("../../models");
const moment = require("moment-timezone");

const getAllPresensiPerkuliahanByPertemuanPerkuliahanId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pertemuanPerkuliahanId = req.params.id_pertemuan_perkuliahan;

    // Cari data presensi_mahasiswa berdasarkan ID di database
    const presensi_mahasiswa = await PresensiMahasiswa.findAll({
      where: {
        id_pertemuan_perkuliahan: pertemuanPerkuliahanId,
      },
      include: [{ model: PertemuanPerkuliahan }, { model: Mahasiswa }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!presensi_mahasiswa) {
      return res.status(404).json({
        message: `<===== Presensi Mahasiswa By ID Pertemuan Perkuliahan ${pertemuanPerkuliahanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Presensi Mahasiswa By ID Pertemuan Perkuliahan ${pertemuanPerkuliahanId} Success:`,
      jumlahData: presensi_mahasiswa.length,
      data: presensi_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const doPresensiPertemuanByMahasiswaAndPertemuanId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pertemuanPerkuliahanId = req.params.id_pertemuan_perkuliahan;

    // Dapatkan user yang sedang login
    const userId = req.user.id; // mengambil data id user yang aktif

    // Ambil data user dengan role mahasiswa
    const userRole = await UserRole.findOne({
      where: {
        id_user: userId,
      },
      include: [
        {
          model: Role,
          where: {
            nama_role: "mahasiswa",
          },
        },
      ],
    });

    if (!userRole) {
      return res.status(403).json({ message: "Anda tidak memiliki akses untuk melakukan presensi." });
    }

    // Ambil data user berdasarkan ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    // Ambil data mahasiswa berdasarkan username user
    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: user.username,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan." });
    }

    // Cek apakah presensi untuk mahasiswa dan pertemuan ini sudah ada
    const existingPresensi = await PresensiMahasiswa.findOne({
      where: {
        id_pertemuan_perkuliahan: pertemuanPerkuliahanId,
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      },
    });

    if (existingPresensi) {
      return res.status(400).json({ message: "Presensi sudah dilakukan untuk pertemuan ini." });
    }

    // mengecek apakah pertemuan perkuliahan lock enable
    const pertemuan_perkuliahan = await PertemuanPerkuliahan.findByPk(pertemuanPerkuliahanId);

    // Mengecek apakah waktu saat ini sesuai dengan jadwal pertemuan
    const now = moment().tz("Asia/Jakarta");
    const tanggalPertemuan = moment(pertemuan_perkuliahan.tanggal_pertemuan).tz("Asia/Jakarta").format("YYYY-MM-DD");
    const waktuMulai = moment(tanggalPertemuan + " " + pertemuan_perkuliahan.waktu_mulai).tz("Asia/Jakarta");
    const waktuSelesai = moment(tanggalPertemuan + " " + pertemuan_perkuliahan.waktu_selesai).tz("Asia/Jakarta");

    if (!now.isBetween(waktuMulai, waktuSelesai)) {
      return res.status(400).json({ message: "Anda hanya dapat melakukan presensi pada waktu pertemuan yang ditentukan." });
    }

    if (pertemuan_perkuliahan.kunci_pertemuan === true) {
      return res.status(400).json({ message: "Pertemuan telah berakhir, Anda tidak dapat melakukan presensi" });
    } else if (pertemuan_perkuliahan.buka_presensi === false) {
      return res.status(400).json({ message: "Pertemuan belum dibuka, Anda tidak dapat melakukan presensi" });
    } else {
      // Increment kolom jumlah_mahasiswa_hadir
      await pertemuan_perkuliahan.increment("jumlah_mahasiswa_hadir");

      // Buat data presensi mahasiswa
      const newPresensi = await PresensiMahasiswa.create({
        presensi_hadir: true,
        status_presensi: "Hadir",
        id_pertemuan_perkuliahan: pertemuanPerkuliahanId,
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      });

      // Kirim respons JSON jika berhasil
      res.status(201).json({
        message: "<===== Absensi Pertemuan Perkuliahan Success =====>",
        data: newPresensi,
      });
    }
  } catch (error) {
    next(error);
  }
};

const updatePresensiMahasiswaByPertemuanPerkuliahanId = async (req, res, next) => {
  try {
    // Dapatkan ID pertemuan dari parameter permintaan
    const pertemuanPerkuliahanId = req.params.id_pertemuan_perkuliahan;
    const { presensiMahasiswa } = req.body;

    // Pastikan request body adalah array
    if (!Array.isArray(presensiMahasiswa)) {
      return res.status(400).json({ message: "Data presensi harus berupa array." });
    }

    // Loop melalui setiap data presensi dan update sesuai dengan id dan status_presensi
    for (const presensi of presensiMahasiswa) {
      const { id, status_presensi } = presensi;

      // Periksa apakah id dan status_presensi ada dalam objek presensi
      if (!id || !status_presensi) {
        return res.status(400).json({ message: "Setiap data presensi harus memiliki id dan status_presensi." });
      }

      // Temukan data presensi mahasiswa berdasarkan id dan id_pertemuan_perkuliahan
      const presensiMahasiswa = await PresensiMahasiswa.findOne({
        where: {
          id: id,
          id_pertemuan_perkuliahan: pertemuanPerkuliahanId,
        },
      });

      // Jika data presensi tidak ditemukan, kembalikan pesan kesalahan
      if (!presensiMahasiswa) {
        return res.status(404).json({ message: `Presensi mahasiswa dengan ID ${id} tidak ditemukan untuk pertemuan perkuliahan ${pertemuanPerkuliahanId}.` });
      }

      // Update status presensi
      presensiMahasiswa.status_presensi = status_presensi;
      await presensiMahasiswa.save();
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Update Presensi Mahasiswa Success =====>",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPresensiPerkuliahanByPertemuanPerkuliahanId,
  doPresensiPertemuanByMahasiswaAndPertemuanId,
  updatePresensiMahasiswaByPertemuanPerkuliahanId,
};
