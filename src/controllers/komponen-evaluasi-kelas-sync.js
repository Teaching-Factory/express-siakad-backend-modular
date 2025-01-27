const { KomponenEvaluasiKelasSync, KelasKuliah, Semester, MataKuliah, Prodi, JenisEvaluasi, KomponenEvaluasiKelas } = require("../../models");

const getAllKomponenEvaluasiKelasSyncBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data komponen_evaluasi_kelas_syncs dari database
    const komponen_evaluasi_kelas_syncs = await KomponenEvaluasiKelasSync.findAll({
      where: {
        status: false,
      },
      include: [
        {
          model: KomponenEvaluasiKelas,
          attributes: ["id_komponen_evaluasi", "id_feeder", "id_kelas_kuliah", "id_jenis_evaluasi", "nomor_urut", "nama", "nama_inggris", "bobot_evaluasi"],
          include: [
            { model: JenisEvaluasi, attributes: ["id_jenis_evaluasi", "nama_jenis_evaluasi"] },
            {
              model: KelasKuliah,
              attributes: ["nama_kelas_kuliah"],
              include: [
                { model: Semester, attributes: ["id_semester", "nama_semester"] },
                { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"], include: [{ model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] }] },
              ],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Komponen Evaluasi Kelas Sync Belum Singkron Success",
      jumlahData: komponen_evaluasi_kelas_syncs.length,
      data: komponen_evaluasi_kelas_syncs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllKomponenEvaluasiKelasSyncSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data komponen_evaluasi_kelas_syncs dari database
    const komponen_evaluasi_kelas_syncs = await KomponenEvaluasiKelasSync.findAll({
      where: {
        status: true,
      },
      include: [
        {
          model: KomponenEvaluasiKelas,
          attributes: ["id_komponen_evaluasi", "id_feeder", "id_kelas_kuliah", "id_jenis_evaluasi", "nomor_urut", "nama", "nama_inggris", "bobot_evaluasi"],
          include: [
            { model: JenisEvaluasi, attributes: ["id_jenis_evaluasi", "nama_jenis_evaluasi"] },
            {
              model: KelasKuliah,
              attributes: ["nama_kelas_kuliah"],
              include: [
                { model: Semester, attributes: ["id_semester", "nama_semester"] },
                { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"], include: [{ model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] }] },
              ],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Komponen Evaluasi Kelas Sync Sudah Singkron Success",
      jumlahData: komponen_evaluasi_kelas_syncs.length,
      data: komponen_evaluasi_kelas_syncs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllKomponenEvaluasiKelasSyncBelumSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: false };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data komponen_evaluasi_kelas_syncs berdasarkan kondisi
    const komponen_evaluasi_kelas_syncs = await KomponenEvaluasiKelasSync.findAll({
      where: whereCondition,
      include: [
        {
          model: KomponenEvaluasiKelas,
          attributes: ["id_komponen_evaluasi", "id_feeder", "id_kelas_kuliah", "id_jenis_evaluasi", "nomor_urut", "nama", "nama_inggris", "bobot_evaluasi"],
          include: [
            { model: JenisEvaluasi, attributes: ["id_jenis_evaluasi", "nama_jenis_evaluasi"] },
            {
              model: KelasKuliah,
              attributes: ["nama_kelas_kuliah"],
              include: [
                { model: Semester, attributes: ["id_semester", "nama_semester"] },
                { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"], include: [{ model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] }] },
              ],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Komponen Evaluasi Kelas Sync Belum Singkron By Filter Success",
      jumlahData: komponen_evaluasi_kelas_syncs.length,
      data: komponen_evaluasi_kelas_syncs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllKomponenEvaluasiKelasSyncSudahSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: true };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data komponen_evaluasi_kelas_syncs berdasarkan kondisi
    const komponen_evaluasi_kelas_syncs = await KomponenEvaluasiKelasSync.findAll({
      where: whereCondition,
      include: [
        {
          model: KomponenEvaluasiKelas,
          attributes: ["id_komponen_evaluasi", "id_feeder", "id_kelas_kuliah", "id_jenis_evaluasi", "nomor_urut", "nama", "nama_inggris", "bobot_evaluasi"],
          include: [
            { model: JenisEvaluasi, attributes: ["id_jenis_evaluasi", "nama_jenis_evaluasi"] },
            {
              model: KelasKuliah,
              attributes: ["nama_kelas_kuliah"],
              include: [
                { model: Semester, attributes: ["id_semester", "nama_semester"] },
                { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"], include: [{ model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] }] },
              ],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Komponen Evaluasi Kelas Sync Sudah Singkron By Filter Success",
      jumlahData: komponen_evaluasi_kelas_syncs.length,
      data: komponen_evaluasi_kelas_syncs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKomponenEvaluasiKelasSyncBelumSingkron,
  getAllKomponenEvaluasiKelasSyncSudahSingkron,
  getAllKomponenEvaluasiKelasSyncBelumSingkronByFilter,
  getAllKomponenEvaluasiKelasSyncSudahSingkronByFilter,
};
