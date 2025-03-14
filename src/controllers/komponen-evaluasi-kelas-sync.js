const { KomponenEvaluasiKelasSync, KelasKuliah, Semester, MataKuliah, Prodi, JenisEvaluasi, KomponenEvaluasiKelas } = require("../../models");
const { getToken } = require("./api-feeder/get-token");
const axios = require("axios");
const { Op } = require("sequelize");

async function getKomponenEvaluasiKelasFromFeederByID(id_komponen_evaluasi, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListKomponenEvaluasiKelas",
      token: token,
      filter: `id_komponen_evaluasi='${id_komponen_evaluasi}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// khusus create dan update yang belum singkron
const getAllKomponenEvaluasiKelasSyncBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data komponen_evaluasi_kelas_syncs dari database
    const komponen_evaluasi_kelas_syncs = await KomponenEvaluasiKelasSync.findAll({
      where: {
        status: false,
        jenis_singkron: {
          [Op.in]: ["create", "update"],
        },
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

// khusus create dan update yang sudah singkron
const getAllKomponenEvaluasiKelasSyncSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data komponen_evaluasi_kelas_syncs dari database
    const komponen_evaluasi_kelas_syncs = await KomponenEvaluasiKelasSync.findAll({
      where: {
        status: true,
        jenis_singkron: {
          [Op.in]: ["create", "update"],
        },
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

// khusus get yang belum singkron
const getAllKomponenEvaluasiKelasSyncGetBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data komponen_evaluasi_kelas_syncs dari database
    const komponen_evaluasi_kelas_syncs = await KomponenEvaluasiKelasSync.findAll({
      where: {
        status: false,
        jenis_singkron: "get",
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

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedKomponenEvaluasiKelas = await Promise.all(
      komponen_evaluasi_kelas_syncs.map(async (komponen_evaluasi) => {
        if (komponen_evaluasi.jenis_singkron === "get") {
          // Mendapatkan data komponen evaluasi kelas dari feeder berdasarkan ID
          const komponenEvaluasiKelasFeeder = await getKomponenEvaluasiKelasFromFeederByID(komponen_evaluasi.id_feeder);

          if (!komponenEvaluasiKelasFeeder) {
            throw new Error(`Data Komponen Evaluasi Kelas Feeder With ID ${komponen_evaluasi.id_feeder} Not Found`);
          }

          // Menambahkan properti KomponenEvaluasiKelasFeeder ke dalam objek komponen_evaluasi
          komponen_evaluasi = {
            ...komponen_evaluasi.dataValues, // Membawa semua properti asli
            KomponenEvaluasiKelasFeeder: komponenEvaluasiKelasFeeder, // Properti tambahan
          };
        }
        return komponen_evaluasi;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Komponen Evaluasi Kelas Sync Get Belum Singkron Success",
      jumlahData: updatedKomponenEvaluasiKelas.length,
      data: updatedKomponenEvaluasiKelas,
    });
  } catch (error) {
    next(error);
  }
};

// khusus get yang sudah singkron
const getAllKomponenEvaluasiKelasSyncGetSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data komponen_evaluasi_kelas_syncs dari database
    const komponen_evaluasi_kelas_syncs = await KomponenEvaluasiKelasSync.findAll({
      where: {
        status: true,
        jenis_singkron: "get",
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

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedKomponenEvaluasiKelas = await Promise.all(
      komponen_evaluasi_kelas_syncs.map(async (komponen_evaluasi) => {
        if (komponen_evaluasi.jenis_singkron === "get") {
          // Mendapatkan data komponen evaluasi kelas dari feeder berdasarkan ID
          const komponenEvaluasiKelasFeeder = await getKomponenEvaluasiKelasFromFeederByID(komponen_evaluasi.id_feeder);

          if (!komponenEvaluasiKelasFeeder) {
            throw new Error(`Data Komponen Evaluasi Kelas Feeder With ID ${komponen_evaluasi.id_feeder} Not Found`);
          }

          // Menambahkan properti KomponenEvaluasiKelasFeeder ke dalam objek komponen_evaluasi
          komponen_evaluasi = {
            ...komponen_evaluasi.dataValues, // Membawa semua properti asli
            KomponenEvaluasiKelasFeeder: komponenEvaluasiKelasFeeder, // Properti tambahan
          };
        }
        return komponen_evaluasi;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Komponen Evaluasi Kelas Sync Get Sudah Singkron Success",
      jumlahData: updatedKomponenEvaluasiKelas.length,
      data: updatedKomponenEvaluasiKelas,
    });
  } catch (error) {
    next(error);
  }
};

// khusus delete yang belum singkron
const getAllKomponenEvaluasiKelasSyncDeleteBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data komponen_evaluasi_kelas_syncs dari database
    const komponen_evaluasi_kelas_syncs = await KomponenEvaluasiKelasSync.findAll({
      where: {
        status: false,
        jenis_singkron: "delete",
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
      message: "<===== GET All Komponen Evaluasi Kelas Sync Delete Belum Singkron Success",
      jumlahData: komponen_evaluasi_kelas_syncs.length,
      data: komponen_evaluasi_kelas_syncs,
    });
  } catch (error) {
    next(error);
  }
};

// khusus delete yang sudah singkron
const getAllKomponenEvaluasiKelasSyncDeleteSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data komponen_evaluasi_kelas_syncs dari database
    const komponen_evaluasi_kelas_syncs = await KomponenEvaluasiKelasSync.findAll({
      where: {
        status: true,
        jenis_singkron: "delete",
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
      message: "<===== GET All Komponen Evaluasi Kelas Sync Delete Sudah Singkron Success",
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

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedKomponenEvaluasiKelas = await Promise.all(
      komponen_evaluasi_kelas_syncs.map(async (komponen_evaluasi) => {
        if (komponen_evaluasi.jenis_singkron === "get") {
          // Mendapatkan data komponen evaluasi kelas dari feeder berdasarkan ID
          const komponenEvaluasiKelasFeeder = await getKomponenEvaluasiKelasFromFeederByID(komponen_evaluasi.id_feeder);

          if (!komponenEvaluasiKelasFeeder) {
            throw new Error(`Data Komponen Evaluasi Kelas Feeder With ID ${komponen_evaluasi.id_feeder} Not Found`);
          }

          // Menambahkan properti KomponenEvaluasiKelasFeeder ke dalam objek komponen_evaluasi
          komponen_evaluasi = {
            ...komponen_evaluasi.dataValues, // Membawa semua properti asli
            KomponenEvaluasiKelasFeeder: komponenEvaluasiKelasFeeder, // Properti tambahan
          };
        }
        return komponen_evaluasi;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Komponen Evaluasi Kelas Sync Belum Singkron By Filter Success",
      jumlahData: updatedKomponenEvaluasiKelas.length,
      data: updatedKomponenEvaluasiKelas,
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

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedKomponenEvaluasiKelas = await Promise.all(
      komponen_evaluasi_kelas_syncs.map(async (komponen_evaluasi) => {
        if (komponen_evaluasi.jenis_singkron === "get") {
          // Mendapatkan data komponen evaluasi kelas dari feeder berdasarkan ID
          const komponenEvaluasiKelasFeeder = await getKomponenEvaluasiKelasFromFeederByID(komponen_evaluasi.id_feeder);

          if (!komponenEvaluasiKelasFeeder) {
            throw new Error(`Data Komponen Evaluasi Kelas Feeder With ID ${komponen_evaluasi.id_feeder} Not Found`);
          }

          // Menambahkan properti KomponenEvaluasiKelasFeeder ke dalam objek komponen_evaluasi
          komponen_evaluasi = {
            ...komponen_evaluasi.dataValues, // Membawa semua properti asli
            KomponenEvaluasiKelasFeeder: komponenEvaluasiKelasFeeder, // Properti tambahan
          };
        }
        return komponen_evaluasi;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Komponen Evaluasi Kelas Sync Sudah Singkron By Filter Success",
      jumlahData: updatedKomponenEvaluasiKelas.length,
      data: updatedKomponenEvaluasiKelas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKomponenEvaluasiKelasSyncBelumSingkron,
  getAllKomponenEvaluasiKelasSyncSudahSingkron,
  getAllKomponenEvaluasiKelasSyncGetBelumSingkron,
  getAllKomponenEvaluasiKelasSyncGetSudahSingkron,
  getAllKomponenEvaluasiKelasSyncDeleteBelumSingkron,
  getAllKomponenEvaluasiKelasSyncDeleteSudahSingkron,
  getAllKomponenEvaluasiKelasSyncBelumSingkronByFilter,
  getAllKomponenEvaluasiKelasSyncSudahSingkronByFilter,
};
