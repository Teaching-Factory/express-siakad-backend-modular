const { DetailNilaiPerkuliahanKelasSync, DetailNilaiPerkuliahanKelas, Mahasiswa, Agama, Prodi, JenjangPendidikan, KelasKuliah, MataKuliah, Dosen } = require("../../models");

const getAllDetailNilaiPerkuliahanKelasSyncBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data detail_nilai_perkuliahan_kelas_syncs dari database
    const detail_nilai_perkuliahan_kelas_syncs = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: {
        status: false,
      },
      include: [
        {
          model: DetailNilaiPerkuliahanKelas,
          attributes: ["angkatan", "nilai_angka", "nilai_indeks", "nilai_huruf"],
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [
                { model: Agama, attributes: ["nama_agama"] },
                { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"], include: [{ model: JenjangPendidikan, attributes: ["nama_jenjang_didik"] }] },
              ],
            },
            {
              model: KelasKuliah,
              attributes: ["nama_kelas_kuliah", "id_feeder"],
              include: [
                { model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah", "sks_mata_kuliah"] },
                { model: Dosen, attributes: ["nama_dosen", "nidn"] },
              ],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Sync Belum Singkron Success",
      jumlahData: detail_nilai_perkuliahan_kelas_syncs.length,
      data: detail_nilai_perkuliahan_kelas_syncs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDetailNilaiPerkuliahanKelasSyncSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data detail_nilai_perkuliahan_kelas_syncs dari database
    const detail_nilai_perkuliahan_kelas_syncs = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: {
        status: true,
      },
      include: [
        {
          model: DetailNilaiPerkuliahanKelas,
          attributes: ["angkatan", "nilai_angka", "nilai_indeks", "nilai_huruf"],
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [
                { model: Agama, attributes: ["nama_agama"] },
                { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"], include: [{ model: JenjangPendidikan, attributes: ["nama_jenjang_didik"] }] },
              ],
            },
            {
              model: KelasKuliah,
              attributes: ["nama_kelas_kuliah", "id_feeder"],
              include: [
                { model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah", "sks_mata_kuliah"] },
                { model: Dosen, attributes: ["nama_dosen", "nidn"] },
              ],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Sync Sudah Singkron Success",
      jumlahData: detail_nilai_perkuliahan_kelas_syncs.length,
      data: detail_nilai_perkuliahan_kelas_syncs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDetailNilaiPerkuliahanKelasSyncBelumSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: false };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data detail_nilai_perkuliahan_kelas_syncs berdasarkan kondisi
    const detail_nilai_perkuliahan_kelas_syncs = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: whereCondition,
      include: [
        {
          model: DetailNilaiPerkuliahanKelas,
          attributes: ["angkatan", "nilai_angka", "nilai_indeks", "nilai_huruf"],
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [
                { model: Agama, attributes: ["nama_agama"] },
                { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"], include: [{ model: JenjangPendidikan, attributes: ["nama_jenjang_didik"] }] },
              ],
            },
            {
              model: KelasKuliah,
              attributes: ["nama_kelas_kuliah", "id_feeder"],
              include: [
                { model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah", "sks_mata_kuliah"] },
                { model: Dosen, attributes: ["nama_dosen", "nidn"] },
              ],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Sync Belum Singkron By Filter Success",
      jumlahData: detail_nilai_perkuliahan_kelas_syncs.length,
      data: detail_nilai_perkuliahan_kelas_syncs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDetailNilaiPerkuliahanKelasSyncSudahSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: true };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data detail_nilai_perkuliahan_kelas_syncs berdasarkan kondisi
    const detail_nilai_perkuliahan_kelas_syncs = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: whereCondition,
      include: [
        {
          model: DetailNilaiPerkuliahanKelas,
          attributes: ["angkatan", "nilai_angka", "nilai_indeks", "nilai_huruf"],
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [
                { model: Agama, attributes: ["nama_agama"] },
                { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"], include: [{ model: JenjangPendidikan, attributes: ["nama_jenjang_didik"] }] },
              ],
            },
            {
              model: KelasKuliah,
              attributes: ["nama_kelas_kuliah", "id_feeder"],
              include: [
                { model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah", "sks_mata_kuliah"] },
                { model: Dosen, attributes: ["nama_dosen", "nidn"] },
              ],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Sync Sudah Singkron By Filter Success",
      jumlahData: detail_nilai_perkuliahan_kelas_syncs.length,
      data: detail_nilai_perkuliahan_kelas_syncs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetailNilaiPerkuliahanKelasSyncBelumSingkron,
  getAllDetailNilaiPerkuliahanKelasSyncSudahSingkron,
  getAllDetailNilaiPerkuliahanKelasSyncBelumSingkronByFilter,
  getAllDetailNilaiPerkuliahanKelasSyncSudahSingkronByFilter,
};
