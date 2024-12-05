const { KelasKuliahSync, KelasKuliah, Semester, MataKuliah, Prodi } = require("../../models");

const getAllKelasKuliahSyncBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data kelas_kuliahs dari database
    const kelas_kuliahs = await KelasKuliahSync.findAll({
      where: {
        status: false,
      },
      include: [
        {
          model: KelasKuliah,
          attributes: ["nama_kelas_kuliah", "id_feeder"],
          include: [
            { model: Semester, attributes: ["id_semester", "nama_semester"] },
            { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kelas Kuliah Sync Belum Singkron Success",
      jumlahData: kelas_kuliahs.length,
      data: kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllKelasKuliahSyncSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data kelas_kuliahs dari database
    const kelas_kuliahs = await KelasKuliahSync.findAll({
      where: {
        status: true,
      },
      include: [
        {
          model: KelasKuliah,
          attributes: ["nama_kelas_kuliah", "id_feeder"],
          include: [
            { model: Semester, attributes: ["id_semester", "nama_semester"] },
            { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kelas Kuliah Sync Sudah Singkron Success",
      jumlahData: kelas_kuliahs.length,
      data: kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllKelasKuliahSyncBelumSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: false };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data kelas_kuliahs berdasarkan kondisi
    const kelas_kuliahs = await KelasKuliahSync.findAll({
      where: whereCondition,
      include: [
        {
          model: KelasKuliah,
          attributes: ["nama_kelas_kuliah", "id_feeder"],
          include: [
            { model: Semester, attributes: ["id_semester", "nama_semester"] },
            { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kelas Kuliah Sync Belum Singkron By Filter Success",
      jumlahData: kelas_kuliahs.length,
      data: kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllKelasKuliahSyncSudahSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: true };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data kelas_kuliahs berdasarkan kondisi
    const kelas_kuliahs = await KelasKuliahSync.findAll({
      where: whereCondition,
      include: [
        {
          model: KelasKuliah,
          attributes: ["nama_kelas_kuliah", "id_feeder"],
          include: [
            { model: Semester, attributes: ["id_semester", "nama_semester"] },
            { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kelas Kuliah Sync Sudah Singkron By Filter Success",
      jumlahData: kelas_kuliahs.length,
      data: kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKelasKuliahSyncBelumSingkron,
  getAllKelasKuliahSyncSudahSingkron,
  getAllKelasKuliahSyncBelumSingkronByFilter,
  getAllKelasKuliahSyncSudahSingkronByFilter,
};
