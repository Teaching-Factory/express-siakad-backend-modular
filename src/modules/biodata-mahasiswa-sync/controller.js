const { BiodataMahasiswaSync, BiodataMahasiswa, Mahasiswa, Agama, Prodi, JenjangPendidikan } = require("../../../models");
const { getToken } = require("../api-feeder/data-feeder/get-token");
const axios = require("axios");
const { Op } = require("sequelize");

async function getBiodataMahasiswaFromFeederByID(id_mahasiswa, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    const requestBody = {
      act: "GetBiodataMahasiswa",
      token: token,
      filter: `id_mahasiswa='${id_mahasiswa}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// khusus create dan update yang belum singkron
const getAllBiodataMahasiswaSyncBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data biodata_mahasiswas dari database
    const biodata_mahasiswas = await BiodataMahasiswaSync.findAll({
      where: {
        status: false,
        jenis_singkron: {
          [Op.in]: ["create", "update"],
        },
      },
      include: [
        {
          model: BiodataMahasiswa,
          attributes: ["tempat_lahir", "email", "id_feeder"],
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
      message: "<===== GET All Biodata Mahasiswa Sync Belum Singkron Success",
      jumlahData: biodata_mahasiswas.length,
      data: biodata_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

// khusus create dan update yang sudah singkron
const getAllBiodataMahasiswaSyncSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data biodata_mahasiswas dari database
    const biodata_mahasiswas = await BiodataMahasiswaSync.findAll({
      where: {
        status: true,
        jenis_singkron: {
          [Op.in]: ["create", "update"],
        },
      },
      include: [
        {
          model: BiodataMahasiswa,
          attributes: ["tempat_lahir", "email", "id_feeder"],
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
      message: "<===== GET All Biodata Mahasiswa Sync Sudah Singkron Success",
      jumlahData: biodata_mahasiswas.length,
      data: biodata_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

// khusus get yang belum singkron
const getAllBiodataMahasiswaSyncGetBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data biodata_mahasiswas dari database
    const biodata_mahasiswas = await BiodataMahasiswaSync.findAll({
      where: {
        status: false,
        jenis_singkron: "get",
      },
      include: [
        {
          model: BiodataMahasiswa,
          attributes: ["tempat_lahir", "email", "id_feeder"],
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
    const updatedBiodataMahasiswa = await Promise.all(
      biodata_mahasiswas.map(async (biodata_mahasiswa) => {
        if (biodata_mahasiswa.jenis_singkron === "get") {
          // Mendapatkan data biodata mahasiswa dari feeder berdasarkan ID
          const biodataMahasiswaFeeder = await getBiodataMahasiswaFromFeederByID(biodata_mahasiswa.id_feeder);

          if (!biodataMahasiswaFeeder) {
            throw new Error(`Data Biodata Mahasiswa Feeder With ID ${biodata_mahasiswa.id_feeder} Not Found`);
          }

          // Menambahkan properti BiodataMahasiswaFeeder ke dalam objek biodata_mahasiswa
          biodata_mahasiswa = {
            ...biodata_mahasiswa.dataValues, // Membawa semua properti asli
            BiodataMahasiswaFeeder: biodataMahasiswaFeeder, // Properti tambahan
          };
        }
        return biodata_mahasiswa;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Biodata Mahasiswa Sync Get Belum Singkron Success",
      jumlahData: updatedBiodataMahasiswa.length,
      data: updatedBiodataMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// khusus get yang sudah singkron
const getAllBiodataMahasiswaSyncGetSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data biodata_mahasiswas dari database
    const biodata_mahasiswas = await BiodataMahasiswaSync.findAll({
      where: {
        status: true,
        jenis_singkron: "get",
      },
      include: [
        {
          model: BiodataMahasiswa,
          attributes: ["tempat_lahir", "email", "id_feeder"],
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
    const updatedBiodataMahasiswa = await Promise.all(
      biodata_mahasiswas.map(async (biodata_mahasiswa) => {
        if (biodata_mahasiswa.jenis_singkron === "get") {
          // Mendapatkan data biodata mahasiswa dari feeder berdasarkan ID
          const biodataMahasiswaFeeder = await getBiodataMahasiswaFromFeederByID(biodata_mahasiswa.id_feeder);

          if (!biodataMahasiswaFeeder) {
            throw new Error(`Data Biodata Mahasiswa Feeder With ID ${biodata_mahasiswa.id_feeder} Not Found`);
          }

          // Menambahkan properti BiodataMahasiswaFeeder ke dalam objek biodata_mahasiswa
          biodata_mahasiswa = {
            ...biodata_mahasiswa.dataValues, // Membawa semua properti asli
            BiodataMahasiswaFeeder: biodataMahasiswaFeeder, // Properti tambahan
          };
        }
        return biodata_mahasiswa;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Biodata Mahasiswa Sync Get Sudah Singkron Success",
      jumlahData: updatedBiodataMahasiswa.length,
      data: updatedBiodataMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// khusus delete yang belum singkron
const getAllBiodataMahasiswaSyncDeleteBelumSingkron = async (req, res, next) => {
  try {
    // Ambil semua data biodata_mahasiswas dari database
    const biodata_mahasiswas = await BiodataMahasiswaSync.findAll({
      where: {
        status: false,
        jenis_singkron: "delete",
      },
      include: [
        {
          model: BiodataMahasiswa,
          attributes: ["tempat_lahir", "email", "id_feeder"],
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
      message: "<===== GET All Biodata Mahasiswa Sync Delete Belum Singkron Success",
      jumlahData: biodata_mahasiswas.length,
      data: biodata_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

// khusus delete yang sudah singkron
const getAllBiodataMahasiswaSyncDeleteSudahSingkron = async (req, res, next) => {
  try {
    // Ambil semua data biodata_mahasiswas dari database
    const biodata_mahasiswas = await BiodataMahasiswaSync.findAll({
      where: {
        status: true,
        jenis_singkron: "delete",
      },
      include: [
        {
          model: BiodataMahasiswa,
          attributes: ["tempat_lahir", "email", "id_feeder"],
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
      message: "<===== GET All Biodata Mahasiswa Sync Delete Sudah Singkron Success",
      jumlahData: biodata_mahasiswas.length,
      data: biodata_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBiodataMahasiswaSyncBelumSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: false };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data biodata_mahasiswas berdasarkan kondisi
    const biodata_mahasiswas = await BiodataMahasiswaSync.findAll({
      where: whereCondition,
      include: [
        {
          model: BiodataMahasiswa,
          attributes: ["tempat_lahir", "email", "id_feeder"],
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
    const updatedBiodataMahasiswa = await Promise.all(
      biodata_mahasiswas.map(async (biodata_mahasiswa) => {
        if (biodata_mahasiswa.jenis_singkron === "get") {
          // Mendapatkan data biodata mahasiswa dari feeder berdasarkan ID
          const biodataMahasiswaFeeder = await getBiodataMahasiswaFromFeederByID(biodata_mahasiswa.id_feeder);

          if (!biodataMahasiswaFeeder) {
            throw new Error(`Data Biodata Mahasiswa Feeder With ID ${biodata_mahasiswa.id_feeder} Not Found`);
          }

          // Menambahkan properti BiodataMahasiswaFeeder ke dalam objek biodata_mahasiswa
          biodata_mahasiswa = {
            ...biodata_mahasiswa.dataValues, // Membawa semua properti asli
            BiodataMahasiswaFeeder: biodataMahasiswaFeeder, // Properti tambahan
          };
        }
        return biodata_mahasiswa;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Biodata Mahasiswa Sync Belum Singkron By Filter Success",
      jumlahData: updatedBiodataMahasiswa.length,
      data: updatedBiodataMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBiodataMahasiswaSyncSudahSingkronByFilter = async (req, res, next) => {
  try {
    // Ambil query parameter jenis_singkron
    const { jenis_singkron } = req.query;

    // Siapkan kondisi pencarian untuk jenis_singkron
    const whereCondition = { status: true };

    if (jenis_singkron) {
      whereCondition.jenis_singkron = jenis_singkron; // Tambahkan filter jenis_singkron jika tersedia
    }

    // Ambil semua data biodata_mahasiswas berdasarkan kondisi
    const biodata_mahasiswas = await BiodataMahasiswaSync.findAll({
      where: whereCondition,
      include: [
        {
          model: BiodataMahasiswa,
          attributes: ["tempat_lahir", "email", "id_feeder"],
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
    const updatedBiodataMahasiswa = await Promise.all(
      biodata_mahasiswas.map(async (biodata_mahasiswa) => {
        if (biodata_mahasiswa.jenis_singkron === "get") {
          // Mendapatkan data biodata mahasiswa dari feeder berdasarkan ID
          const biodataMahasiswaFeeder = await getBiodataMahasiswaFromFeederByID(biodata_mahasiswa.id_feeder);

          if (!biodataMahasiswaFeeder) {
            throw new Error(`Data Biodata Mahasiswa Feeder With ID ${biodata_mahasiswa.id_feeder} Not Found`);
          }

          // Menambahkan properti BiodataMahasiswaFeeder ke dalam objek biodata_mahasiswa
          biodata_mahasiswa = {
            ...biodata_mahasiswa.dataValues, // Membawa semua properti asli
            BiodataMahasiswaFeeder: biodataMahasiswaFeeder, // Properti tambahan
          };
        }
        return biodata_mahasiswa;
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Biodata Mahasiswa Sync Sudah Singkron By Filter Success",
      jumlahData: updatedBiodataMahasiswa.length,
      data: updatedBiodataMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBiodataMahasiswaSyncBelumSingkron,
  getAllBiodataMahasiswaSyncSudahSingkron,
  getAllBiodataMahasiswaSyncGetBelumSingkron,
  getAllBiodataMahasiswaSyncGetSudahSingkron,
  getAllBiodataMahasiswaSyncDeleteBelumSingkron,
  getAllBiodataMahasiswaSyncDeleteSudahSingkron,
  getAllBiodataMahasiswaSyncBelumSingkronByFilter,
  getAllBiodataMahasiswaSyncSudahSingkronByFilter,
};
