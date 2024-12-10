const { KelasKuliahSync, KelasKuliah, Semester, MataKuliah, Prodi } = require("../../models");
const { getToken } = require("./api-feeder/get-token");
const axios = require("axios");

async function getKelasKuliahFromFeederByID(id_kelas_kuliah, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListKelasKuliah",
      token: token,
      filter: `id_kelas_kuliah='${id_kelas_kuliah}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

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

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedKelasKuliah = await Promise.all(
      kelas_kuliahs.map(async (kelas_kuliah) => {
        if (kelas_kuliah.jenis_singkron === "delete") {
          // Mendapatkan data kelas kuliah dari feeder berdasarkan ID
          const kelasKuliahFeeder = await getKelasKuliahFromFeederByID(kelas_kuliah.id_feeder);

          if (!kelasKuliahFeeder) {
            throw new Error(`Data Kelas Kuliah Feeder With ID ${kelas_kuliah.id_feeder} Not Found`);
          }

          // Menambahkan properti KelasKuliahFeeder ke dalam objek kelas_kuliah
          kelas_kuliah = {
            ...kelas_kuliah.dataValues, // Membawa semua properti asli
            KelasKuliahFeeder: kelasKuliahFeeder, // Properti tambahan
          };
        }
        return kelas_kuliah;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kelas Kuliah Sync Belum Singkron Success",
      jumlahData: updatedKelasKuliah.length,
      data: updatedKelasKuliah,
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

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedKelasKuliah = await Promise.all(
      kelas_kuliahs.map(async (kelas_kuliah) => {
        if (kelas_kuliah.jenis_singkron === "delete") {
          // Mendapatkan data kelas kuliah dari feeder berdasarkan ID
          const kelasKuliahFeeder = await getKelasKuliahFromFeederByID(kelas_kuliah.id_feeder);

          if (!kelasKuliahFeeder) {
            throw new Error(`Data Kelas Kuliah Feeder With ID ${kelas_kuliah.id_feeder} Not Found`);
          }

          // Menambahkan properti KelasKuliahFeeder ke dalam objek kelas_kuliah
          kelas_kuliah = {
            ...kelas_kuliah.dataValues, // Membawa semua properti asli
            KelasKuliahFeeder: kelasKuliahFeeder, // Properti tambahan
          };
        }
        return kelas_kuliah;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kelas Kuliah Sync Belum Singkron By Filter Success",
      jumlahData: updatedKelasKuliah.length,
      data: updatedKelasKuliah,
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
