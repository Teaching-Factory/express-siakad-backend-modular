const { PertemuanPerkuliahan, RuangPerkuliahan, KelasKuliah } = require("../../models");

const getAllPertemuanPerkuliahanByKelasKuliahId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    // Ambil semua data pertemuan_perkuliahan dari database
    const pertemuan_perkuliahan = await PertemuanPerkuliahan.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah }],
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
    const pertemuan_perkuliahan = await PertemuanPerkuliahan.findByPk(pertemuanPerkuliahanId);

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

module.exports = {
  getAllPertemuanPerkuliahanByKelasKuliahId,
  getPertemuanPerkuliahanById,
  getPertemuanPerkuliahanBySemesterProdiAndKelasKuliahId,
  createPertemuanPerkuliahanByKelasKuliahId,
  updatePertemuanPerkuliahanById,
  deletePertemuanPerkuliahanById,
  lockEnablePertemuanPerkuliahanById,
  lockDisablePertemuanPerkuliahanById,
};
