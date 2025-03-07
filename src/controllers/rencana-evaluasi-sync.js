const { RencanaEvaluasiSync, MataKuliah, Prodi, JenisEvaluasi, RencanaEvaluasi } = require("../../models");
const { getToken } = require("./api-feeder/get-token");
const axios = require("axios");

async function getRencanaEvaluasiFromFeederByID(id_rencana_evaluasi, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListRencanaEvaluasi",
      token: token,
      filter: `id_rencana_evaluasi='${id_rencana_evaluasi}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

const getAllRencanaEvaluasiSyncBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data rencana_evaluasis dari database
    const rencana_evaluasis = await RencanaEvaluasiSync.findAll({
      where: {
        status: false,
      },
      include: [
        {
          model: RencanaEvaluasi,
          attributes: ["nomor_urut", "nama_evaluasi", "deskripsi_indonesia", "bobot_evaluasi"],
          include: [
            { model: JenisEvaluasi, attributes: ["id_jenis_evaluasi", "nama_jenis_evaluasi"] },
            { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"], include: [{ model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] }] },
          ],
        },
      ],
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedRencanaEvaluasi = await Promise.all(
      rencana_evaluasis.map(async (rencana_evaluasi) => {
        if (rencana_evaluasi.jenis_singkron === "get") {
          // Mendapatkan data rencana evaluasi dari feeder berdasarkan ID
          const rencanaEvaluasiFeeder = await getRencanaEvaluasiFromFeederByID(rencana_evaluasi.id_feeder);

          if (!rencanaEvaluasiFeeder) {
            throw new Error(`Data Rencana Evaluasi Feeder With ID ${rencana_evaluasi.id_feeder} Not Found`);
          }

          // Menambahkan properti RencanaEvaluasiFeeder ke dalam objek rencana_evaluasi
          rencana_evaluasi = {
            ...rencana_evaluasi.dataValues, // Membawa semua properti asli
            RencanaEvaluasiFeeder: rencanaEvaluasiFeeder, // Properti tambahan
          };
        }
        return rencana_evaluasi;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rencana Evaluasi Sync Belum Singkron Success",
      jumlahData: updatedRencanaEvaluasi.length,
      data: updatedRencanaEvaluasi,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRencanaEvaluasiSyncSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data rencana_evaluasis dari database
    const rencana_evaluasis = await RencanaEvaluasiSync.findAll({
      where: {
        status: true,
      },
      include: [
        {
          model: RencanaEvaluasi,
          attributes: ["nomor_urut", "nama_evaluasi", "deskripsi_indonesia", "bobot_evaluasi"],
          include: [
            { model: JenisEvaluasi, attributes: ["id_jenis_evaluasi", "nama_jenis_evaluasi"] },
            { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"], include: [{ model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] }] },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rencana Evaluasi Sync Sudah Singkron Success",
      jumlahData: rencana_evaluasis.length,
      data: rencana_evaluasis,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRencanaEvaluasiSyncBelumSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: false };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data rencana_evaluasis berdasarkan kondisi
    const rencana_evaluasis = await RencanaEvaluasiSync.findAll({
      where: whereCondition,
      include: [
        {
          model: RencanaEvaluasi,
          attributes: ["nomor_urut", "nama_evaluasi", "deskripsi_indonesia", "bobot_evaluasi"],
          include: [
            { model: JenisEvaluasi, attributes: ["id_jenis_evaluasi", "nama_jenis_evaluasi"] },
            { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"], include: [{ model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] }] },
          ],
        },
      ],
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedRencanaEvaluasi = await Promise.all(
      rencana_evaluasis.map(async (rencana_evaluasi) => {
        if (rencana_evaluasi.jenis_singkron === "get") {
          // Mendapatkan data rencana evaluasi dari feeder berdasarkan ID
          const rencanaEvaluasiFeeder = await getRencanaEvaluasiFromFeederByID(rencana_evaluasi.id_feeder);

          if (!rencanaEvaluasiFeeder) {
            throw new Error(`Data Rencana Evaluasi Kelas Feeder With ID ${rencana_evaluasi.id_feeder} Not Found`);
          }

          // Menambahkan properti RencanaEvaluasiFeeder ke dalam objek rencana_evaluasi
          rencana_evaluasi = {
            ...rencana_evaluasi.dataValues, // Membawa semua properti asli
            RencanaEvaluasiFeeder: rencanaEvaluasiFeeder, // Properti tambahan
          };
        }
        return rencana_evaluasi;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rencana Evaluasi Kelas Sync Belum Singkron By Filter Success",
      jumlahData: updatedRencanaEvaluasi.length,
      data: updatedRencanaEvaluasi,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRencanaEvaluasiSyncSudahSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: true };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data rencana_evaluasis berdasarkan kondisi
    const rencana_evaluasis = await RencanaEvaluasiSync.findAll({
      where: whereCondition,
      include: [
        {
          model: RencanaEvaluasi,
          attributes: ["nomor_urut", "nama_evaluasi", "deskripsi_indonesia", "bobot_evaluasi"],
          include: [
            { model: JenisEvaluasi, attributes: ["id_jenis_evaluasi", "nama_jenis_evaluasi"] },
            { model: MataKuliah, attributes: ["kode_mata_kuliah", "nama_mata_kuliah"], include: [{ model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"] }] },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rencana Evaluasi Sync Sudah Singkron By Filter Success",
      jumlahData: rencana_evaluasis.length,
      data: rencana_evaluasis,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRencanaEvaluasiSyncBelumSingkron,
  getAllRencanaEvaluasiSyncSudahSingkron,
  getAllRencanaEvaluasiSyncBelumSingkronByFilter,
  getAllRencanaEvaluasiSyncSudahSingkronByFilter,
};
