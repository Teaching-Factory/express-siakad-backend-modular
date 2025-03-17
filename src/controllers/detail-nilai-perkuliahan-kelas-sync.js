const { DetailNilaiPerkuliahanKelasSync, DetailNilaiPerkuliahanKelas, Mahasiswa, Agama, Prodi, JenjangPendidikan, KelasKuliah, MataKuliah, Dosen } = require("../../models");
const { getToken } = require("./api-feeder/get-token");
const axios = require("axios");
const { Op } = require("sequelize");

async function getDetailNilaiPerkuliahanKelasFromFeederByFilter(id_kelas_kuliah, id_registrasi_mahasiswa, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetDetailNilaiPerkuliahanKelas",
      token: token,
      filter: `id_kelas_kuliah='${id_kelas_kuliah}' and id_registrasi_mahasiswa='${id_registrasi_mahasiswa}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// khusus create dan update yang belum singkron
const getAllDetailNilaiPerkuliahanKelasSyncBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data detail_nilai_perkuliahan_kelas_syncs dari database
    const detail_nilai_perkuliahan_kelas_syncs = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: {
        status: false,
        jenis_singkron: {
          [Op.in]: ["create", "update"],
        },
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

// khsus create dan update yang sudah singkron
const getAllDetailNilaiPerkuliahanKelasSyncSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data detail_nilai_perkuliahan_kelas_syncs dari database
    const detail_nilai_perkuliahan_kelas_syncs = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: {
        status: true,
        jenis_singkron: {
          [Op.in]: ["create", "update"],
        },
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

// khusus get yang belum singkron
const getAllDetailNilaiPerkuliahanKelasSyncGetBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data detail_nilai_perkuliahan_kelas_syncs dari database
    const detail_nilai_perkuliahan_kelas_syncs = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: {
        status: false,
        jenis_singkron: "get",
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

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedDetailNilaiPerkuliahanKelas = await Promise.all(
      detail_nilai_perkuliahan_kelas_syncs.map(async (detail_nilai) => {
        if (detail_nilai.jenis_singkron === "get") {
          // Mendapatkan data detail nilai perkuliahan kelas dari feeder berdasarkan ID
          const detailNilaiPerkuliahanKelasFeeder = await getDetailNilaiPerkuliahanKelasFromFeederByFilter(detail_nilai.id_kelas_kuliah_feeder, detail_nilai.id_registrasi_mahasiswa_feeder);

          if (!detailNilaiPerkuliahanKelasFeeder) {
            throw new Error(`Data Detail nilai perkuliahan kelas Feeder With ID ${detail_nilai.id_feeder} Not Found`);
          }

          // Menambahkan properti DetailNilaiPerkuliahanKelasFeeder ke dalam objek detail_nilai
          detail_nilai = {
            ...detail_nilai.dataValues, // Membawa semua properti asli
            DetailNilaiPerkuliahanKelasFeeder: detailNilaiPerkuliahanKelasFeeder, // Properti tambahan
          };
        }
        return detail_nilai;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Sync Get Belum Singkron Success",
      jumlahData: updatedDetailNilaiPerkuliahanKelas.length,
      data: updatedDetailNilaiPerkuliahanKelas,
    });
  } catch (error) {
    next(error);
  }
};

// khsus get yang sudah singkron
const getAllDetailNilaiPerkuliahanKelasSyncGetSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data detail_nilai_perkuliahan_kelas_syncs dari database
    const detail_nilai_perkuliahan_kelas_syncs = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: {
        status: true,
        jenis_singkron: "get",
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

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedDetailNilaiPerkuliahanKelas = await Promise.all(
      detail_nilai_perkuliahan_kelas_syncs.map(async (detail_nilai) => {
        if (detail_nilai.jenis_singkron === "get") {
          // Mendapatkan data detail nilai perkuliahan kelas dari feeder berdasarkan ID
          const detailNilaiPerkuliahanKelasFeeder = await getDetailNilaiPerkuliahanKelasFromFeederByFilter(detail_nilai.id_kelas_kuliah_feeder, detail_nilai.id_registrasi_mahasiswa_feeder);

          if (!detailNilaiPerkuliahanKelasFeeder) {
            throw new Error(`Data Detail nilai perkuliahan kelas Feeder With ID ${detail_nilai.id_feeder} Not Found`);
          }

          // Menambahkan properti DetailNilaiPerkuliahanKelasFeeder ke dalam objek detail_nilai
          detail_nilai = {
            ...detail_nilai.dataValues, // Membawa semua properti asli
            DetailNilaiPerkuliahanKelasFeeder: detailNilaiPerkuliahanKelasFeeder, // Properti tambahan
          };
        }
        return detail_nilai;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Sync Get Sudah Singkron Success",
      jumlahData: updatedDetailNilaiPerkuliahanKelas.length,
      data: updatedDetailNilaiPerkuliahanKelas,
    });
  } catch (error) {
    next(error);
  }
};

// khusus delete yang belum singkron
const getAllDetailNilaiPerkuliahanKelasSyncDeleteBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data detail_nilai_perkuliahan_kelas_syncs dari database
    const detail_nilai_perkuliahan_kelas_syncs = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: {
        status: false,
        jenis_singkron: "delete",
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
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Sync Delete Belum Singkron Success",
      jumlahData: detail_nilai_perkuliahan_kelas_syncs.length,
      data: detail_nilai_perkuliahan_kelas_syncs,
    });
  } catch (error) {
    next(error);
  }
};

// khsus delete yang sudah singkron
const getAllDetailNilaiPerkuliahanKelasSyncDeleteSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data detail_nilai_perkuliahan_kelas_syncs dari database
    const detail_nilai_perkuliahan_kelas_syncs = await DetailNilaiPerkuliahanKelasSync.findAll({
      where: {
        status: true,
        jenis_singkron: "delete",
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
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Sync Delete Sudah Singkron Success",
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

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedDetailNilaiPerkuliahanKelas = await Promise.all(
      detail_nilai_perkuliahan_kelas_syncs.map(async (detail_nilai) => {
        if (detail_nilai.jenis_singkron === "get") {
          // Mendapatkan data detail nilai perkuliahan kelas dari feeder berdasarkan ID
          const detailNilaiPerkuliahanKelasFeeder = await getDetailNilaiPerkuliahanKelasFromFeederByFilter(detail_nilai.id_kelas_kuliah_feeder, detail_nilai.id_registrasi_mahasiswa_feeder);

          if (!detailNilaiPerkuliahanKelasFeeder) {
            throw new Error(`Data Detail nilai perkuliahan kelas Feeder With ID ${detail_nilai.id_feeder} Not Found`);
          }

          // Menambahkan properti DetailNilaiPerkuliahanKelasFeeder ke dalam objek detail_nilai
          detail_nilai = {
            ...detail_nilai.dataValues, // Membawa semua properti asli
            DetailNilaiPerkuliahanKelasFeeder: detailNilaiPerkuliahanKelasFeeder, // Properti tambahan
          };
        }
        return detail_nilai;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Sync Belum Singkron By Filter Success",
      jumlahData: updatedDetailNilaiPerkuliahanKelas.length,
      data: updatedDetailNilaiPerkuliahanKelas,
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

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedDetailNilaiPerkuliahanKelas = await Promise.all(
      detail_nilai_perkuliahan_kelas_syncs.map(async (detail_nilai) => {
        if (detail_nilai.jenis_singkron === "get") {
          // Mendapatkan data detail nilai perkuliahan kelas dari feeder berdasarkan ID
          const detailNilaiPerkuliahanKelasFeeder = await getDetailNilaiPerkuliahanKelasFromFeederByFilter(detail_nilai.id_kelas_kuliah_feeder, detail_nilai.id_registrasi_mahasiswa_feeder);

          if (!detailNilaiPerkuliahanKelasFeeder) {
            throw new Error(`Data Detail nilai perkuliahan kelas Feeder With ID ${detail_nilai.id_feeder} Not Found`);
          }

          // Menambahkan properti DetailNilaiPerkuliahanKelasFeeder ke dalam objek detail_nilai
          detail_nilai = {
            ...detail_nilai.dataValues, // Membawa semua properti asli
            DetailNilaiPerkuliahanKelasFeeder: detailNilaiPerkuliahanKelasFeeder, // Properti tambahan
          };
        }
        return detail_nilai;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Sync Sudah Singkron By Filter Success",
      jumlahData: updatedDetailNilaiPerkuliahanKelas.length,
      data: updatedDetailNilaiPerkuliahanKelas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetailNilaiPerkuliahanKelasSyncBelumSingkron,
  getAllDetailNilaiPerkuliahanKelasSyncSudahSingkron,
  getAllDetailNilaiPerkuliahanKelasSyncGetBelumSingkron,
  getAllDetailNilaiPerkuliahanKelasSyncGetSudahSingkron,
  getAllDetailNilaiPerkuliahanKelasSyncDeleteBelumSingkron,
  getAllDetailNilaiPerkuliahanKelasSyncDeleteSudahSingkron,
  getAllDetailNilaiPerkuliahanKelasSyncBelumSingkronByFilter,
  getAllDetailNilaiPerkuliahanKelasSyncSudahSingkronByFilter,
};
