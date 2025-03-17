const { KelasKuliah, MataKuliah, Prodi, DosenPengajarKelasKuliahSync, DosenPengajarKelasKuliah, PenugasanDosen, Dosen } = require("../../models");
const { getToken } = require("./api-feeder/get-token");
const axios = require("axios");
const { Op } = require("sequelize");

async function getDosenPengajarKelasKuliahFromFeederByID(id_aktivitas_mengajar, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetDosenPengajarKelasKuliah",
      token: token,
      filter: `id_aktivitas_mengajar='${id_aktivitas_mengajar}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// khusus create dan update yang belum singkron
const getAllDosenPengajarKelasKuliahSyncBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data dosen_pengajar_kelas_kuliahs dari database
    const dosen_pengajar_kelas_kuliahs = await DosenPengajarKelasKuliahSync.findAll({
      where: {
        status: false,
        jenis_singkron: {
          [Op.in]: ["create", "update"],
        },
      },
      include: [
        {
          model: DosenPengajarKelasKuliah,
          attributes: ["id_feeder"],
          include: [
            { model: PenugasanDosen, attributes: ["id_registrasi_dosen"], include: [{ model: Dosen, attributes: ["id_dosen", "id_feeder", "nama_dosen", "nidn"] }] },
            { model: KelasKuliah, attributes: ["nama_kelas_kuliah", "id_feeder"], include: [{ model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah"] }] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Dosen Pengajar Kelas Kuliah Sync Belum Singkron Success",
      jumlahData: dosen_pengajar_kelas_kuliahs.length,
      data: dosen_pengajar_kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

// khusus create dan update yang sudah singkron
const getAllDosenPengajarKelasKuliahSyncSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data dosen_pengajar_kelas_kuliahs dari database
    const dosen_pengajar_kelas_kuliahs = await DosenPengajarKelasKuliahSync.findAll({
      where: {
        status: true,
        jenis_singkron: {
          [Op.in]: ["create", "update"],
        },
      },
      include: [
        {
          model: DosenPengajarKelasKuliah,
          attributes: ["id_feeder"],
          include: [
            { model: PenugasanDosen, attributes: ["id_registrasi_dosen"], include: [{ model: Dosen, attributes: ["id_dosen", "id_feeder", "nama_dosen", "nidn"] }] },
            { model: KelasKuliah, attributes: ["nama_kelas_kuliah", "id_feeder"], include: [{ model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah"] }] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Dosen Pengajar Kelas Kuliah Sync Sudah Singkron Success",
      jumlahData: dosen_pengajar_kelas_kuliahs.length,
      data: dosen_pengajar_kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

// khusus get yang belum singkron
const getAllDosenPengajarKelasKuliahSyncGetBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data dosen_pengajar_kelas_kuliahs dari database
    const dosen_pengajar_kelas_kuliahs = await DosenPengajarKelasKuliahSync.findAll({
      where: {
        status: false,
        jenis_singkron: "get",
      },
      include: [
        {
          model: DosenPengajarKelasKuliah,
          attributes: ["id_feeder"],
          include: [
            { model: PenugasanDosen, attributes: ["id_registrasi_dosen"], include: [{ model: Dosen, attributes: ["id_dosen", "id_feeder", "nama_dosen", "nidn"] }] },
            { model: KelasKuliah, attributes: ["nama_kelas_kuliah", "id_feeder"], include: [{ model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah"] }] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedDosenPengajarKelasKuliah = await Promise.all(
      dosen_pengajar_kelas_kuliahs.map(async (dosen_pengajar) => {
        if (dosen_pengajar.jenis_singkron === "get") {
          // Mendapatkan data dosen pengajar kelas kuliah dari feeder berdasarkan ID
          const dosenPengajarKelasKuliahFeeder = await getDosenPengajarKelasKuliahFromFeederByID(dosen_pengajar.id_feeder);

          if (!dosenPengajarKelasKuliahFeeder) {
            throw new Error(`Data Dosen PengajarKelas Kuliah Feeder With ID ${dosen_pengajar.id_feeder} Not Found`);
          }

          // Menambahkan properti DosenPengajarKelasKuliahFeeder ke dalam objek dosen_pengajar
          dosen_pengajar = {
            ...dosen_pengajar.dataValues, // Membawa semua properti asli
            DosenPengajarKelasKuliahFeeder: dosenPengajarKelasKuliahFeeder, // Properti tambahan
          };
        }
        return dosen_pengajar;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Dosen Pengajar Kelas Kuliah Sync Get Belum Singkron Success",
      jumlahData: updatedDosenPengajarKelasKuliah.length,
      data: updatedDosenPengajarKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

// khusus get yang sudah singkron
const getAllDosenPengajarKelasKuliahSyncGetSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data dosen_pengajar_kelas_kuliahs dari database
    const dosen_pengajar_kelas_kuliahs = await DosenPengajarKelasKuliahSync.findAll({
      where: {
        status: true,
        jenis_singkron: "get",
      },
      include: [
        {
          model: DosenPengajarKelasKuliah,
          attributes: ["id_feeder"],
          include: [
            { model: PenugasanDosen, attributes: ["id_registrasi_dosen"], include: [{ model: Dosen, attributes: ["id_dosen", "id_feeder", "nama_dosen", "nidn"] }] },
            { model: KelasKuliah, attributes: ["nama_kelas_kuliah", "id_feeder"], include: [{ model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah"] }] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedDosenPengajarKelasKuliah = await Promise.all(
      dosen_pengajar_kelas_kuliahs.map(async (dosen_pengajar) => {
        if (dosen_pengajar.jenis_singkron === "get") {
          // Mendapatkan data dosen pengajar kelas kuliah dari feeder berdasarkan ID
          const dosenPengajarKelasKuliahFeeder = await getDosenPengajarKelasKuliahFromFeederByID(dosen_pengajar.id_feeder);

          if (!dosenPengajarKelasKuliahFeeder) {
            throw new Error(`Data Dosen PengajarKelas Kuliah Feeder With ID ${dosen_pengajar.id_feeder} Not Found`);
          }

          // Menambahkan properti DosenPengajarKelasKuliahFeeder ke dalam objek dosen_pengajar
          dosen_pengajar = {
            ...dosen_pengajar.dataValues, // Membawa semua properti asli
            DosenPengajarKelasKuliahFeeder: dosenPengajarKelasKuliahFeeder, // Properti tambahan
          };
        }
        return dosen_pengajar;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Dosen Pengajar Kelas Kuliah Sync Get Sudah Singkron Success",
      jumlahData: updatedDosenPengajarKelasKuliah.length,
      data: updatedDosenPengajarKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

// khusus delete yang belum singkron
const getAllDosenPengajarKelasKuliahSyncDeleteBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data dosen_pengajar_kelas_kuliahs dari database
    const dosen_pengajar_kelas_kuliahs = await DosenPengajarKelasKuliahSync.findAll({
      where: {
        status: false,
        jenis_singkron: "delete",
      },
      include: [
        {
          model: DosenPengajarKelasKuliah,
          attributes: ["id_feeder"],
          include: [
            { model: PenugasanDosen, attributes: ["id_registrasi_dosen"], include: [{ model: Dosen, attributes: ["id_dosen", "id_feeder", "nama_dosen", "nidn"] }] },
            { model: KelasKuliah, attributes: ["nama_kelas_kuliah", "id_feeder"], include: [{ model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah"] }] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Dosen Pengajar Kelas Kuliah Sync Delete Belum Singkron Success",
      jumlahData: dosen_pengajar_kelas_kuliahs.length,
      data: dosen_pengajar_kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

// khusus delete yang sudah singkron
const getAllDosenPengajarKelasKuliahSyncDeleteSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data dosen_pengajar_kelas_kuliahs dari database
    const dosen_pengajar_kelas_kuliahs = await DosenPengajarKelasKuliahSync.findAll({
      where: {
        status: true,
        jenis_singkron: "delete",
      },
      include: [
        {
          model: DosenPengajarKelasKuliah,
          attributes: ["id_feeder"],
          include: [
            { model: PenugasanDosen, attributes: ["id_registrasi_dosen"], include: [{ model: Dosen, attributes: ["id_dosen", "id_feeder", "nama_dosen", "nidn"] }] },
            { model: KelasKuliah, attributes: ["nama_kelas_kuliah", "id_feeder"], include: [{ model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah"] }] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Dosen Pengajar Kelas Kuliah Sync Delete Sudah Singkron Success",
      jumlahData: dosen_pengajar_kelas_kuliahs.length,
      data: dosen_pengajar_kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDosenPengajarKelasKuliahSyncBelumSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: false };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data dosen_pengajar_kelas_kuliahs berdasarkan kondisi
    const dosen_pengajar_kelas_kuliahs = await DosenPengajarKelasKuliahSync.findAll({
      where: whereCondition,
      include: [
        {
          model: DosenPengajarKelasKuliah,
          attributes: ["id_feeder"],
          include: [
            { model: PenugasanDosen, attributes: ["id_registrasi_dosen"], include: [{ model: Dosen, attributes: ["id_dosen", "id_feeder", "nama_dosen", "nidn"] }] },
            { model: KelasKuliah, attributes: ["nama_kelas_kuliah", "id_feeder"], include: [{ model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah"] }] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedDosenPengajarKelasKuliah = await Promise.all(
      dosen_pengajar_kelas_kuliahs.map(async (dosen_pengajar) => {
        if (dosen_pengajar.jenis_singkron === "get") {
          // Mendapatkan data dosen pengajar kelas kuliah dari feeder berdasarkan ID
          const dosenPengajarKelasKuliahFeeder = await getDosenPengajarKelasKuliahFromFeederByID(dosen_pengajar.id_feeder);

          if (!dosenPengajarKelasKuliahFeeder) {
            throw new Error(`Data Dosen PengajarKelas Kuliah Feeder With ID ${dosen_pengajar.id_feeder} Not Found`);
          }

          // Menambahkan properti DosenPengajarKelasKuliahFeeder ke dalam objek dosen_pengajar
          dosen_pengajar = {
            ...dosen_pengajar.dataValues, // Membawa semua properti asli
            DosenPengajarKelasKuliahFeeder: dosenPengajarKelasKuliahFeeder, // Properti tambahan
          };
        }
        return dosen_pengajar;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Dosen Pengajar Kelas Kuliah Sync Belum Singkron By Filter Success",
      jumlahData: updatedDosenPengajarKelasKuliah.length,
      data: updatedDosenPengajarKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDosenPengajarKelasKuliahSyncSudahSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: true };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data dosen_pengajar_kelas_kuliahs berdasarkan kondisi
    const dosen_pengajar_kelas_kuliahs = await DosenPengajarKelasKuliahSync.findAll({
      where: whereCondition,
      include: [
        {
          model: DosenPengajarKelasKuliah,
          attributes: ["id_feeder"],
          include: [
            { model: PenugasanDosen, attributes: ["id_registrasi_dosen"], include: [{ model: Dosen, attributes: ["id_dosen", "id_feeder", "nama_dosen", "nidn"] }] },
            { model: KelasKuliah, attributes: ["nama_kelas_kuliah", "id_feeder"], include: [{ model: MataKuliah, attributes: ["nama_mata_kuliah", "kode_mata_kuliah"] }] },
            { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] },
          ],
        },
      ],
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedDosenPengajarKelasKuliah = await Promise.all(
      dosen_pengajar_kelas_kuliahs.map(async (dosen_pengajar) => {
        if (dosen_pengajar.jenis_singkron === "get") {
          // Mendapatkan data dosen pengajar kelas kuliah dari feeder berdasarkan ID
          const dosenPengajarKelasKuliahFeeder = await getDosenPengajarKelasKuliahFromFeederByID(dosen_pengajar.id_feeder);

          if (!dosenPengajarKelasKuliahFeeder) {
            throw new Error(`Data Dosen PengajarKelas Kuliah Feeder With ID ${dosen_pengajar.id_feeder} Not Found`);
          }

          // Menambahkan properti DosenPengajarKelasKuliahFeeder ke dalam objek dosen_pengajar
          dosen_pengajar = {
            ...dosen_pengajar.dataValues, // Membawa semua properti asli
            DosenPengajarKelasKuliahFeeder: dosenPengajarKelasKuliahFeeder, // Properti tambahan
          };
        }
        return dosen_pengajar;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Dosen Pengajar Kelas Kuliah Sync Sudah Singkron By Filter Success",
      jumlahData: updatedDosenPengajarKelasKuliah.length,
      data: updatedDosenPengajarKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDosenPengajarKelasKuliahSyncBelumSingkron,
  getAllDosenPengajarKelasKuliahSyncSudahSingkron,
  getAllDosenPengajarKelasKuliahSyncGetBelumSingkron,
  getAllDosenPengajarKelasKuliahSyncGetSudahSingkron,
  getAllDosenPengajarKelasKuliahSyncDeleteBelumSingkron,
  getAllDosenPengajarKelasKuliahSyncDeleteSudahSingkron,
  getAllDosenPengajarKelasKuliahSyncBelumSingkronByFilter,
  getAllDosenPengajarKelasKuliahSyncSudahSingkronByFilter,
};
