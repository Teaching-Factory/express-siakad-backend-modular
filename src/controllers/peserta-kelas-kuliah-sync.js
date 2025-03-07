const { PesertaKelasKuliahSync, PesertaKelasKuliah, Mahasiswa, Agama, Prodi, JenjangPendidikan, KelasKuliah, MataKuliah, Dosen } = require("../../models");
const { getToken } = require("./api-feeder/get-token");
const axios = require("axios");

async function getPesertaKelasKuliahFromFeederByFilter(id_kelas_kuliah, id_registrasi_mahasiswa, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetPesertaKelasKuliah",
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

const getAllPesertaKelasKuliahSyncBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data peserta_kelas_kuliahs dari database
    const peserta_kelas_kuliahs = await PesertaKelasKuliahSync.findAll({
      where: {
        status: false,
      },
      include: [
        {
          model: PesertaKelasKuliah,
          attributes: ["angkatan", "id_kelas_kuliah", "id_registrasi_mahasiswa"],
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
    const updatedPesertaKelasKuliah = await Promise.all(
      peserta_kelas_kuliahs.map(async (peserta_kelas_kuliah) => {
        if (peserta_kelas_kuliah.jenis_singkron === "get") {
          // Mendapatkan data peserta kelas kuliah dari feeder berdasarkan ID
          const pesertaKelasKuliahFeeder = await getPesertaKelasKuliahFromFeederByFilter(peserta_kelas_kuliah.id_kelas_kuliah_feeder, peserta_kelas_kuliah.id_registrasi_mahasiswa_feeder);

          if (!pesertaKelasKuliahFeeder) {
            throw new Error(`Data Peserta Kelas Kuliah Feeder With Kelas Kuliah ID ${peserta_kelas_kuliah.id_kelas_kuliah_feeder} and Mahasiswa ID ${peserta_kelas_kuliah.id_registrasi_mahasiswa_feeder} Not Found`);
          }

          // Menambahkan properti PesertaKelasKuliahFeeder ke dalam objek peserta_kelas_kuliah
          peserta_kelas_kuliah = {
            ...peserta_kelas_kuliah.dataValues, // Membawa semua properti asli
            PesertaKelasKuliahFeeder: pesertaKelasKuliahFeeder, // Properti tambahan
          };
        }
        return peserta_kelas_kuliah;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Peserta Kelas Kuliah Sync Belum Singkron Success",
      jumlahData: updatedPesertaKelasKuliah.length,
      data: updatedPesertaKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPesertaKelasKuliahSyncSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data peserta_kelas_kuliahs dari database
    const peserta_kelas_kuliahs = await PesertaKelasKuliahSync.findAll({
      where: {
        status: true,
      },
      include: [
        {
          model: PesertaKelasKuliah,
          attributes: ["angkatan", "id_kelas_kuliah", "id_registrasi_mahasiswa"],
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
      message: "<===== GET All Peserta Kelas Kuliah Sync Sudah Singkron Success",
      jumlahData: peserta_kelas_kuliahs.length,
      data: peserta_kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPesertaKelasKuliahSyncBelumSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: false };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data peserta_kelas_kuliahs berdasarkan kondisi
    const peserta_kelas_kuliahs = await PesertaKelasKuliahSync.findAll({
      where: whereCondition,
      include: [
        {
          model: PesertaKelasKuliah,
          attributes: ["angkatan", "id_kelas_kuliah", "id_registrasi_mahasiswa"],
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
    const updatedPesertaKelasKuliah = await Promise.all(
      peserta_kelas_kuliahs.map(async (peserta_kelas_kuliah) => {
        if (peserta_kelas_kuliah.jenis_singkron === "get") {
          // Mendapatkan data peserta kelas kuliah dari feeder berdasarkan ID
          const pesertaKelasKuliahFeeder = await getPesertaKelasKuliahFromFeederByFilter(peserta_kelas_kuliah.id_kelas_kuliah_feeder, peserta_kelas_kuliah.id_registrasi_mahasiswa_feeder);

          if (!pesertaKelasKuliahFeeder) {
            throw new Error(`Data Peserta Kelas Kuliah Feeder With ID ${peserta_kelas_kuliah.id_feeder} Not Found`);
          }

          // Menambahkan properti PesertaKelasKuliahaFeeder ke dalam objek peserta_kelas_kuliah
          peserta_kelas_kuliah = {
            ...peserta_kelas_kuliah.dataValues, // Membawa semua properti asli
            PesertaKelasKuliahaFeeder: pesertaKelasKuliahFeeder, // Properti tambahan
          };
        }
        return peserta_kelas_kuliah;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Peserta Kelas Kuliah Sync Belum Singkron By Filter Success",
      jumlahData: updatedPesertaKelasKuliah.length,
      data: updatedPesertaKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPesertaKelasKuliahSyncSudahSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: true };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data peserta_kelas_kuliahs berdasarkan kondisi
    const peserta_kelas_kuliahs = await PesertaKelasKuliahSync.findAll({
      where: whereCondition,
      include: [
        {
          model: PesertaKelasKuliah,
          attributes: ["angkatan", "id_kelas_kuliah", "id_registrasi_mahasiswa"],
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
      message: "<===== GET All Peserta Kelas Kuliah Sync Sudah Singkron By Filter Success",
      jumlahData: peserta_kelas_kuliahs.length,
      data: peserta_kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPesertaKelasKuliahSyncBelumSingkron,
  getAllPesertaKelasKuliahSyncSudahSingkron,
  getAllPesertaKelasKuliahSyncBelumSingkronByFilter,
  getAllPesertaKelasKuliahSyncSudahSingkronByFilter,
};
