const { PertemuanPerkuliahan, RuangPerkuliahan, KelasKuliah, Dosen, Mahasiswa, TahunAjaran, KRSMahasiswa, Semester, Sequelize, Prodi, MataKuliah } = require("../../models");

const getAllPertemuanPerkuliahanByKelasKuliahId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    // Ambil semua data pertemuan_perkuliahan dari database
    const pertemuan_perkuliahan = await PertemuanPerkuliahan.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah, include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }] }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Pertemuan Perkuliahan By Kelas Kuliah Id ${kelasKuliahId} Success`,
      jumlahData: pertemuan_perkuliahan.length,
      data: pertemuan_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const getPertemuanPerkuliahanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pertemuanPerkuliahanId = req.params.id;

    // Cari data pertemuan_perkuliahan berdasarkan ID di database
    const pertemuan_perkuliahan = await PertemuanPerkuliahan.findByPk(pertemuanPerkuliahanId, {
      include: [{ model: KelasKuliah, include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!pertemuan_perkuliahan) {
      return res.status(404).json({
        message: `<===== Pertemuan Perkuliahan With ID ${pertemuanPerkuliahanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Pertemuan Perkuliahan By ID ${pertemuanPerkuliahanId} Success:`,
      data: pertemuan_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const getPertemuanPerkuliahanBySemesterProdiAndKelasKuliahId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;
    const prodiId = req.params.id_prodi;
    const kelasKuliahId = req.params.id_kelas_kuliah;

    // Ambil semua data pertemuan_perkuliahan dari database
    const pertemuan_perkuliahan = await PertemuanPerkuliahan.findAll({
      where: { id_kelas_kuliah: kelasKuliahId },
      include: [
        {
          model: KelasKuliah,
          include: [{ model: Dosen }],
          where: {
            id_prodi: prodiId,
            id_semester: semesterId,
          },
        },
        { model: RuangPerkuliahan },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Pertemuan Perkuliahan By Semester ID ${semesterId}, Prodi ID ${prodiId} And Kelas Kuliah ID ${kelasKuliahId} Success`,
      jumlahData: pertemuan_perkuliahan.length,
      data: pertemuan_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const createPertemuanPerkuliahanByKelasKuliahId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    const { pertemuan, tanggal_pertemuan, waktu_mulai, waktu_selesai, materi, id_ruang_perkuliahan } = req.body;

    // Gunakan metode create untuk membuat data pertemuan perkuliahan baru
    const newPertemuanPerkuliahan = await PertemuanPerkuliahan.create({
      pertemuan,
      tanggal_pertemuan,
      waktu_mulai,
      waktu_selesai,
      materi,
      id_ruang_perkuliahan,
      id_kelas_kuliah: kelasKuliahId,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Pertemuan Perkuliahan Success",
      data: newPertemuanPerkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const updatePertemuanPerkuliahanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pertemuanPerkuliahanId = req.params.id;

    // Dapatkan data yang akan diupdate dari body permintaan
    const { pertemuan, tanggal_pertemuan, waktu_mulai, waktu_selesai, materi, id_ruang_perkuliahan } = req.body;

    // Cari data pertemuan_perkuliahan berdasarkan ID di database
    let pertemuan_perkuliahan = await PertemuanPerkuliahan.findByPk(pertemuanPerkuliahanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!pertemuan_perkuliahan) {
      return res.status(404).json({
        message: `<===== Pertemuan Perkuliahan With ID ${pertemuanPerkuliahanId} Not Found:`,
      });
    }

    // Update data pertemuan_perkuliahan
    pertemuan_perkuliahan.pertemuan = pertemuan;
    pertemuan_perkuliahan.tanggal_pertemuan = tanggal_pertemuan;
    pertemuan_perkuliahan.waktu_mulai = waktu_mulai;
    pertemuan_perkuliahan.waktu_selesai = waktu_selesai;
    pertemuan_perkuliahan.materi = materi;
    pertemuan_perkuliahan.id_ruang_perkuliahan = id_ruang_perkuliahan;

    // Simpan perubahan ke dalam database
    await pertemuan_perkuliahan.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Pertemuan Perkuliahan With ID ${pertemuanPerkuliahanId} Success:`,
      data: pertemuan_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const deletePertemuanPerkuliahanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pertemuanPerkuliahanId = req.params.id;

    // Cari data pertemuan_perkuliahan berdasarkan ID di database
    let pertemuan_perkuliahan = await PertemuanPerkuliahan.findByPk(pertemuanPerkuliahanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!pertemuan_perkuliahan) {
      return res.status(404).json({
        message: `<===== Pertemuan Perkuliahan With ID ${pertemuanPerkuliahanId} Not Found:`,
      });
    }

    // Hapus data pertemuan_perkuliahan dari database
    await pertemuan_perkuliahan.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Pertemuan Perkuliahan With ID ${pertemuanPerkuliahanId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

const lockEnablePertemuanPerkuliahanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pertemuanPerkuliahanId = req.params.id;

    // Cari data pertemuan_perkuliahan berdasarkan ID di database
    const pertemuan_perkuliahan = await PertemuanPerkuliahan.findByPk(pertemuanPerkuliahanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!pertemuan_perkuliahan) {
      return res.status(404).json({
        message: `<===== Pertemuan Perkuliahan With ID ${pertemuanPerkuliahanId} Not Found:`,
      });
    }

    // ubah kolom lock pertemuan perkuliahan menjadi true
    pertemuan_perkuliahan.kunci_pertemuan = true;

    // Simpan perubahan ke dalam database
    await pertemuan_perkuliahan.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Lock Pertemuan Perkuliahan Enable By ID ${pertemuanPerkuliahanId} Success:`,
      data: pertemuan_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const lockDisablePertemuanPerkuliahanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pertemuanPerkuliahanId = req.params.id;

    // Cari data pertemuan_perkuliahan berdasarkan ID di database
    const pertemuan_perkuliahan = await PertemuanPerkuliahan.findByPk(pertemuanPerkuliahanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!pertemuan_perkuliahan) {
      return res.status(404).json({
        message: `<===== Pertemuan Perkuliahan With ID ${pertemuanPerkuliahanId} Not Found:`,
      });
    }

    // ubah kolom lock pertemuan perkuliahan menjadi false
    pertemuan_perkuliahan.kunci_pertemuan = false;

    // Simpan perubahan ke dalam database
    await pertemuan_perkuliahan.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Lock Pertemuan Perkuliahan Disable By ID ${pertemuanPerkuliahanId} Success:`,
      data: pertemuan_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const openPertemuanPerkuliahan = async (req, res, next) => {
  try {
    // ambil request body
    const { id_kelas_kuliah, id_pertemuan_perkuliahan } = req.body;

    // Ambil semua data pertemuan_perkuliahan dari database
    const pertemuan_perkuliahan = await PertemuanPerkuliahan.findOne({
      where: {
        id: id_pertemuan_perkuliahan,
        id_kelas_kuliah,
      },
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!pertemuan_perkuliahan) {
      return res.status(404).json({
        message: `<===== Pertemuan Perkuliahan Not Found:`,
      });
    }

    // Update data jabatan
    pertemuan_perkuliahan.buka_presensi = true;

    // Simpan perubahan ke dalam database
    await pertemuan_perkuliahan.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== OPEN Pertemuan Perkuliahan Success`,
      data: pertemuan_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const closePertemuanPerkuliahanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pertemuanPerkuliahanId = req.params.id;

    if (!pertemuanPerkuliahanId) {
      return res.status(400).json({
        message: "Pertemuan Perkuliahan ID is required",
      });
    }

    // Ambil semua data pertemuan_perkuliahan dari database
    const pertemuan_perkuliahan = await PertemuanPerkuliahan.findByPk(pertemuanPerkuliahanId, {
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!pertemuan_perkuliahan) {
      return res.status(404).json({
        message: `<===== Pertemuan Perkuliahan With ID ${pertemuanPerkuliahanId} Not Found:`,
      });
    }

    // Update data jabatan
    pertemuan_perkuliahan.buka_presensi = false;

    // Simpan perubahan ke dalam database
    await pertemuan_perkuliahan.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== CLOSE Pertemuan Perkuliahan By ID ${pertemuanPerkuliahanId} Success`,
      data: pertemuan_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPertemuanPerkuliahanActiveByDosen = async (req, res, next) => {
  try {
    const user = req.user;

    const dosen = await Dosen.findOne({
      where: {
        nidn: user.username,
      },
    });

    if (!dosen) {
      return res.status(404).json({ message: "Dosen not found" });
    }

    // Ambil semua data kelas kuliah dengan dosen.id_dosen dari database
    const kelas_kuliahs = await KelasKuliah.findAll({
      where: {
        id_dosen: dosen.id_dosen,
      },
    });

    // Ambil semua pertemuan perkuliahan yang buka_presensi == true dan id_kelas_kuliah ada di kelas_kuliahs
    const pertemuan_perkuliahan_aktifs = await PertemuanPerkuliahan.findAll({
      where: {
        buka_presensi: true,
        kunci_pertemuan: false,
        id_kelas_kuliah: kelas_kuliahs.map((kelas) => kelas.id_kelas_kuliah), // Ambil id_kelas_kuliah dari kelas_kuliahs
      },
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah, include: [{ model: MataKuliah }, { model: Prodi }, { model: Semester }, { model: Dosen }] }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Pertemuan Perkuliahan Aktif By Dosen Success",
      jumlahData: pertemuan_perkuliahan_aktifs.length,
      data: pertemuan_perkuliahan_aktifs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPertemuanPerkuliahanActiveByMahasiswa = async (req, res, next) => {
  try {
    const user = req.user;

    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: user.username,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa not found" });
    }

    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua semester yang sesuai dengan tahun awal
    const semesters = await Semester.findAll({
      where: {
        id_semester: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_semester dari hasil query semester
    const idSemester = semesters.map((semester) => semester.id_semester);

    // Ambil data KRS mahasiswa berdasarkan id_semester yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_semester: idSemester,
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      },
    });

    // Ambil semua id_kelas_kuliah dari hasil query krs_mahasiswas
    const idKelasKuliahs = krs_mahasiswas.map((krs) => krs.id_kelas);

    // Ambil semua data kelas kuliah yang sesuai dengan idKelasKuliahs
    const kelas_kuliahs = await KelasKuliah.findAll({
      where: {
        id_kelas_kuliah: idKelasKuliahs,
      },
    });

    // Ambil semua pertemuan perkuliahan yang buka_presensi == true dan id_kelas_kuliah ada di kelas_kuliahs
    const pertemuan_perkuliahan_aktifs = await PertemuanPerkuliahan.findAll({
      where: {
        buka_presensi: true,
        kunci_pertemuan: false,
        id_kelas_kuliah: kelas_kuliahs.map((kelas) => kelas.id_kelas_kuliah), // Ambil id_kelas_kuliah dari kelas_kuliahs
      },
      include: [{ model: KelasKuliah, include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }] }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Pertemuan Perkuliahan Aktif By Mahasiswa Success",
      jumlahData: pertemuan_perkuliahan_aktifs.length,
      data: pertemuan_perkuliahan_aktifs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPertemuanPerkuliahanByKelasKuliahId,
  getPertemuanPerkuliahanById,
  getPertemuanPerkuliahanBySemesterProdiAndKelasKuliahId,
  createPertemuanPerkuliahanByKelasKuliahId,
  updatePertemuanPerkuliahanById,
  deletePertemuanPerkuliahanById,
  lockEnablePertemuanPerkuliahanById,
  lockDisablePertemuanPerkuliahanById,
  openPertemuanPerkuliahan,
  closePertemuanPerkuliahanById,
  getAllPertemuanPerkuliahanActiveByDosen,
  getAllPertemuanPerkuliahanActiveByMahasiswa,
};
