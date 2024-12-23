const { RiwayatPendidikanMahasiswaSync, RiwayatPendidikanMahasiswa, Mahasiswa, Agama, Prodi, JenjangPendidikan } = require("../../models");
const { getToken } = require("./api-feeder/get-token");
const axios = require("axios");

async function getRiwayatPendidikanMahasiswaFromFeederByID(id_registrasi_mahasiswa, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListRiwayatPendidikanMahasiswa",
      token: token,
      filter: `id_registrasi_mahasiswa='${id_registrasi_mahasiswa}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

const getAllRiwayatPendidikanMahasiswaSyncBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data riwayat_pendidikan_mahasiswas dari database
    const riwayat_pendidikan_mahasiswas = await RiwayatPendidikanMahasiswaSync.findAll({
      where: {
        status: false,
      },
      include: [
        {
          model: RiwayatPendidikanMahasiswa,
          attributes: ["tanggal_daftar", "nama_ibu_kandung", "biaya_masuk", "id_feeder"],
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [
                { model: Agama, attributes: ["nama_agama"] },
                { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"], include: [{ model: JenjangPendidikan, attributes: ["nama_jenjang_didik"] }] },
              ],
            },
          ],
        },
      ],
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedRiwayatPendidikanMahasiswa = await Promise.all(
      riwayat_pendidikan_mahasiswas.map(async (riwayat_pendidikan_mahasiswa) => {
        if (riwayat_pendidikan_mahasiswa.jenis_singkron === "delete") {
          // Mendapatkan data riwayat pendidikan mahasiswa dari feeder berdasarkan ID
          const riwayatPendidikanMahasiswaFeeder = await getRiwayatPendidikanMahasiswaFromFeederByID(riwayat_pendidikan_mahasiswa.id_feeder);

          if (!riwayatPendidikanMahasiswaFeeder) {
            throw new Error(`Data Riwayat Pendidikan Mahasiswa Feeder With ID ${riwayat_pendidikan_mahasiswa.id_feeder} Not Found`);
          }

          // Menambahkan properti RiwayatPendidikanMahasiswaFeeder ke dalam objek riwayat_pendidikan_mahasiswa
          riwayat_pendidikan_mahasiswa = {
            ...riwayat_pendidikan_mahasiswa.dataValues, // Membawa semua properti asli
            RiwayatPendidikanMahasiswaFeeder: riwayatPendidikanMahasiswaFeeder, // Properti tambahan
          };
        }
        return riwayat_pendidikan_mahasiswa;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Riwayat Pendidikan Mahasiswa Mahasiswa Sync Belum Singkron Success",
      jumlahData: updatedRiwayatPendidikanMahasiswa.length,
      data: updatedRiwayatPendidikanMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRiwayatPendidikanMahasiswaSyncSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data riwayat_pendidikan_mahasiswas dari database
    const riwayat_pendidikan_mahasiswas = await RiwayatPendidikanMahasiswaSync.findAll({
      where: {
        status: true,
      },
      include: [
        {
          model: RiwayatPendidikanMahasiswa,
          attributes: ["tanggal_daftar", "nama_ibu_kandung", "biaya_masuk", "id_feeder"],
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [
                { model: Agama, attributes: ["nama_agama"] },
                { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"], include: [{ model: JenjangPendidikan, attributes: ["nama_jenjang_didik"] }] },
              ],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Riwayat Pendidikan Mahasiswa Sync Sudah Singkron Success",
      jumlahData: riwayat_pendidikan_mahasiswas.length,
      data: riwayat_pendidikan_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRiwayatPendidikanMahasiswaSyncBelumSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: false };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data riwayat_pendidikan_mahasiswas berdasarkan kondisi
    const riwayat_pendidikan_mahasiswas = await RiwayatPendidikanMahasiswaSync.findAll({
      where: whereCondition,
      include: [
        {
          model: RiwayatPendidikanMahasiswa,
          attributes: ["tanggal_daftar", "nama_ibu_kandung", "biaya_masuk", "id_feeder"],
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [
                { model: Agama, attributes: ["nama_agama"] },
                { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"], include: [{ model: JenjangPendidikan, attributes: ["nama_jenjang_didik"] }] },
              ],
            },
          ],
        },
      ],
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedRiwayatPendidikanMahasiswa = await Promise.all(
      riwayat_pendidikan_mahasiswas.map(async (riwayat_pendidikan_mahasiswa) => {
        if (riwayat_pendidikan_mahasiswa.jenis_singkron === "delete") {
          // Mendapatkan data riwayat pendidikan mahasiswa dari feeder berdasarkan ID
          const riwayatPendidikanMahasiswaFeeder = await getRiwayatPendidikanMahasiswaFromFeederByID(riwayat_pendidikan_mahasiswa.id_feeder);

          if (!riwayatPendidikanMahasiswaFeeder) {
            throw new Error(`Data Riwayat Pendidikan Mahasiswa Feeder With ID ${riwayat_pendidikan_mahasiswa.id_feeder} Not Found`);
          }

          // Menambahkan properti RiwayatPendidikanMahasiswaFeeder ke dalam objek riwayat_pendidikan_mahasiswa
          riwayat_pendidikan_mahasiswa = {
            ...riwayat_pendidikan_mahasiswa.dataValues, // Membawa semua properti asli
            RiwayatPendidikanMahasiswaFeeder: riwayatPendidikanMahasiswaFeeder, // Properti tambahan
          };
        }
        return riwayat_pendidikan_mahasiswa;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Riwayat Pendidikan Mahasiswa Sync Belum Singkron By Filter Success",
      jumlahData: updatedRiwayatPendidikanMahasiswa.length,
      data: updatedRiwayatPendidikanMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRiwayatPendidikanMahasiswaSyncSudahSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: true };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data riwayat_pendidikan_mahasiswas berdasarkan kondisi
    const riwayat_pendidikan_mahasiswas = await RiwayatPendidikanMahasiswaSync.findAll({
      where: whereCondition,
      include: [
        {
          model: RiwayatPendidikanMahasiswa,
          attributes: ["tanggal_daftar", "nama_ibu_kandung", "biaya_masuk", "id_feeder"],
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [
                { model: Agama, attributes: ["nama_agama"] },
                { model: Prodi, attributes: ["kode_program_studi", "nama_program_studi"], include: [{ model: JenjangPendidikan, attributes: ["nama_jenjang_didik"] }] },
              ],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Riwayat Pendidikan Mahasiswa Sync Sudah Singkron By Filter Success",
      jumlahData: riwayat_pendidikan_mahasiswas.length,
      data: riwayat_pendidikan_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRiwayatPendidikanMahasiswaSyncBelumSingkron,
  getAllRiwayatPendidikanMahasiswaSyncSudahSingkron,
  getAllRiwayatPendidikanMahasiswaSyncBelumSingkronByFilter,
  getAllRiwayatPendidikanMahasiswaSyncSudahSingkronByFilter,
};
