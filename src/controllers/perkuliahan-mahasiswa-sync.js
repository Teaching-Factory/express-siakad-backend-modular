const { PerkuliahanMahasiswaSync, PerkuliahanMahasiswa, Mahasiswa, RiwayatPendidikanMahasiswa } = require("../../models");
const { getToken } = require("./api-feeder/get-token");
const axios = require("axios");
const { Op } = require("sequelize");

async function getPerkuliahanMahasiswaFromFeederByFilter(id_semester, id_registrasi_mahasiswa, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetListPerkuliahanMahasiswa",
      token: token,
      filter: `id_semester='${id_semester}' and id_registrasi_mahasiswa='${id_registrasi_mahasiswa}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// khusus create dan update yang belum singkron
const getAllPerkuliahanMahasiswaSyncBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data perkuliahan_mahasiswa_syncs dari database
    const perkuliahan_mahasiswa_syncs = await PerkuliahanMahasiswaSync.findAll({
      where: {
        status: false,
        jenis_singkron: {
          [Op.in]: ["create", "update"],
        },
      },
      include: [
        {
          model: PerkuliahanMahasiswa,
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [{ model: RiwayatPendidikanMahasiswa, attributes: ["id_feeder"] }],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Perkuliahan Mahasiswa Sync Belum Singkron Success",
      jumlahData: perkuliahan_mahasiswa_syncs.length,
      data: perkuliahan_mahasiswa_syncs,
    });
  } catch (error) {
    next(error);
  }
};

// khsus create dan update yang sudah singkron
const getAllPerkuliahanMahasiswaSyncSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data perkuliahan_mahasiswa_syncs dari database
    const perkuliahan_mahasiswa_syncs = await PerkuliahanMahasiswaSync.findAll({
      where: {
        status: true,
        jenis_singkron: {
          [Op.in]: ["create", "update"],
        },
      },
      include: [
        {
          model: PerkuliahanMahasiswa,
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [{ model: RiwayatPendidikanMahasiswa, attributes: ["id_feeder"] }],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Perkuliahan Mahasiswa Sync Sudah Singkron Success",
      jumlahData: perkuliahan_mahasiswa_syncs.length,
      data: perkuliahan_mahasiswa_syncs,
    });
  } catch (error) {
    next(error);
  }
};

// khusus get yang belum singkron
const getAllPerkuliahanMahasiswaSyncGetBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data perkuliahan_mahasiswa_syncs dari database
    const perkuliahan_mahasiswa_syncs = await PerkuliahanMahasiswaSync.findAll({
      where: {
        status: false,
        jenis_singkron: "get",
      },
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedPerkuliahanMahasiswa = await Promise.all(
      perkuliahan_mahasiswa_syncs.map(async (perkuliahan_mhs) => {
        if (perkuliahan_mhs.jenis_singkron === "get") {
          // Mendapatkan perkuliahan mahasiswa dari feeder berdasarkan ID
          const PerkuliahanMahasiswaFeeder = await getPerkuliahanMahasiswaFromFeederByFilter(perkuliahan_mhs.id_semester_feeder, perkuliahan_mhs.id_registrasi_mahasiswa_feeder);

          if (!PerkuliahanMahasiswaFeeder) {
            throw new Error(`Data Perkuliahan mahasiswa Feeder With Semester ID ${perkuliahan_mhs.id_semester_feeder} and Mahasiswa ID ${perkuliahan_mhs.id_registrasi_mahasiswa_feeder} Not Found`);
          }

          // Menambahkan properti PerkuliahanMahasiswaFeeder ke dalam objek perkuliahan_mhs
          perkuliahan_mhs = {
            ...perkuliahan_mhs.dataValues, // Membawa semua properti asli
            PerkuliahanMahasiswaFeeder: PerkuliahanMahasiswaFeeder, // Properti tambahan
          };
        }
        return perkuliahan_mhs;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Perkuliahan Mahasiswa Sync Get Belum Singkron Success",
      jumlahData: updatedPerkuliahanMahasiswa.length,
      data: updatedPerkuliahanMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// khsus get yang sudah singkron
const getAllPerkuliahanMahasiswaSyncGetSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data perkuliahan_mahasiswa_syncs dari database
    const perkuliahan_mahasiswa_syncs = await PerkuliahanMahasiswaSync.findAll({
      where: {
        status: true,
        jenis_singkron: "get",
      },
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedPerkuliahanMahasiswa = await Promise.all(
      perkuliahan_mahasiswa_syncs.map(async (perkuliahan_mhs) => {
        if (perkuliahan_mhs.jenis_singkron === "get") {
          // Mendapatkan perkuliahan mahasiswa dari feeder berdasarkan ID
          const PerkuliahanMahasiswaFeeder = await getPerkuliahanMahasiswaFromFeederByFilter(perkuliahan_mhs.id_semester_feeder, perkuliahan_mhs.id_registrasi_mahasiswa_feeder);

          if (!PerkuliahanMahasiswaFeeder) {
            throw new Error(`Data Perkuliahan mahasiswa Feeder With Semester ID ${perkuliahan_mhs.id_semester_feeder} and Mahasiswa ID ${perkuliahan_mhs.id_registrasi_mahasiswa_feeder} Not Found`);
          }

          // Menambahkan properti PerkuliahanMahasiswaFeeder ke dalam objek perkuliahan_mhs
          perkuliahan_mhs = {
            ...perkuliahan_mhs.dataValues, // Membawa semua properti asli
            PerkuliahanMahasiswaFeeder: PerkuliahanMahasiswaFeeder, // Properti tambahan
          };
        }
        return perkuliahan_mhs;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Perkuliahan Mahasiswa Sync Get Sudah Singkron Success",
      jumlahData: updatedPerkuliahanMahasiswa.length,
      data: updatedPerkuliahanMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// khusus delete yang belum singkron
const getAllPerkuliahanMahasiswaSyncDeleteBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data perkuliahan_mahasiswa_syncs dari database
    const perkuliahan_mahasiswa_syncs = await PerkuliahanMahasiswaSync.findAll({
      where: {
        status: false,
        jenis_singkron: "delete",
      },
      include: [
        {
          model: PerkuliahanMahasiswa,
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [{ model: RiwayatPendidikanMahasiswa, attributes: ["id_feeder"] }],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Perkuliahan Mahasiswa Sync Delete Belum Singkron Success",
      jumlahData: perkuliahan_mahasiswa_syncs.length,
      data: perkuliahan_mahasiswa_syncs,
    });
  } catch (error) {
    next(error);
  }
};

// khsus delete yang sudah singkron
const getAllPerkuliahanMahasiswaSyncDeleteSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data perkuliahan_mahasiswa_syncs dari database
    const perkuliahan_mahasiswa_syncs = await PerkuliahanMahasiswaSync.findAll({
      where: {
        status: true,
        jenis_singkron: "delete",
      },
      include: [
        {
          model: PerkuliahanMahasiswa,
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [{ model: RiwayatPendidikanMahasiswa, attributes: ["id_feeder"] }],
            },
          ],
        },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Perkuliahan Mahasiswa Sync Delete Sudah Singkron Success",
      jumlahData: perkuliahan_mahasiswa_syncs.length,
      data: perkuliahan_mahasiswa_syncs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPerkuliahanMahasiswaSyncBelumSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: false };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data perkuliahan_mahasiswa_syncs berdasarkan kondisi
    const perkuliahan_mahasiswa_syncs = await PerkuliahanMahasiswaSync.findAll({
      where: whereCondition,
      include: [
        {
          model: PerkuliahanMahasiswa,
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [{ model: RiwayatPendidikanMahasiswa, attributes: ["id_feeder"] }],
            },
          ],
        },
      ],
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedPerkuliahanMahasiswa = await Promise.all(
      perkuliahan_mahasiswa_syncs.map(async (perkuliahan_mhs) => {
        if (perkuliahan_mhs.jenis_singkron === "get") {
          // Mendapatkan perkuliahan mahasiswa dari feeder berdasarkan ID
          const PerkuliahanMahasiswaFeeder = await getPerkuliahanMahasiswaFromFeederByFilter(perkuliahan_mhs.id_semester_feeder, perkuliahan_mhs.id_registrasi_mahasiswa_feeder);

          if (!PerkuliahanMahasiswaFeeder) {
            throw new Error(`Data Perkuliahan mahasiswa Feeder With Semester ID ${perkuliahan_mhs.id_semester_feeder} and Mahasiswa ID ${perkuliahan_mhs.id_registrasi_mahasiswa_feeder} Not Found`);
          }

          // Menambahkan properti PerkuliahanMahasiswaFeeder ke dalam objek perkuliahan_mhs
          perkuliahan_mhs = {
            ...perkuliahan_mhs.dataValues, // Membawa semua properti asli
            PerkuliahanMahasiswaFeeder: PerkuliahanMahasiswaFeeder, // Properti tambahan
          };
        }
        return perkuliahan_mhs;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Perkuliahan Mahasiswa Sync Belum Singkron By Filter Success",
      jumlahData: updatedPerkuliahanMahasiswa.length,
      data: updatedPerkuliahanMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPerkuliahanMahasiswaSyncSudahSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: true };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data perkuliahan_mahasiswa_syncs berdasarkan kondisi
    const perkuliahan_mahasiswa_syncs = await PerkuliahanMahasiswaSync.findAll({
      where: whereCondition,
      include: [
        {
          model: PerkuliahanMahasiswa,
          include: [
            {
              model: Mahasiswa,
              attributes: ["nama_mahasiswa", "nim", "nama_periode_masuk"],
              include: [{ model: RiwayatPendidikanMahasiswa, attributes: ["id_feeder"] }],
            },
          ],
        },
      ],
    });

    // Menggunakan Promise.all untuk memastikan semua data diolah secara paralel
    const updatedPerkuliahanMahasiswa = await Promise.all(
      perkuliahan_mahasiswa_syncs.map(async (perkuliahan_mhs) => {
        if (perkuliahan_mhs.jenis_singkron === "get") {
          // Mendapatkan perkuliahan mahasiswa dari feeder berdasarkan ID
          const PerkuliahanMahasiswaFeeder = await getPerkuliahanMahasiswaFromFeederByFilter(perkuliahan_mhs.id_semester_feeder, perkuliahan_mhs.id_registrasi_mahasiswa_feeder);

          if (!PerkuliahanMahasiswaFeeder) {
            throw new Error(`Data Perkuliahan mahasiswa Feeder With Semester ID ${perkuliahan_mhs.id_semester_feeder} and Mahasiswa ID ${perkuliahan_mhs.id_registrasi_mahasiswa_feeder} Not Found`);
          }

          // Menambahkan properti PerkuliahanMahasiswaFeeder ke dalam objek perkuliahan_mhs
          perkuliahan_mhs = {
            ...perkuliahan_mhs.dataValues, // Membawa semua properti asli
            PerkuliahanMahasiswaFeeder: PerkuliahanMahasiswaFeeder, // Properti tambahan
          };
        }
        return perkuliahan_mhs;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Perkuliahan Mahasiswa Sync Sudah Singkron By Filter Success",
      jumlahData: updatedPerkuliahanMahasiswa.length,
      data: updatedPerkuliahanMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPerkuliahanMahasiswaSyncBelumSingkron,
  getAllPerkuliahanMahasiswaSyncSudahSingkron,
  getAllPerkuliahanMahasiswaSyncGetBelumSingkron,
  getAllPerkuliahanMahasiswaSyncGetSudahSingkron,
  getAllPerkuliahanMahasiswaSyncDeleteBelumSingkron,
  getAllPerkuliahanMahasiswaSyncDeleteSudahSingkron,
  getAllPerkuliahanMahasiswaSyncBelumSingkronByFilter,
  getAllPerkuliahanMahasiswaSyncSudahSingkronByFilter,
};
