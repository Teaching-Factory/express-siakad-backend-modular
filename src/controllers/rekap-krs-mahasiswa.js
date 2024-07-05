const { RekapKRSMahasiswa, Prodi, Periode, Mahasiswa, MataKuliah, Semester } = require("../../models");
const axios = require("axios");
const { getToken } = require("././api-feeder/get-token");

const getAllRekapKRSMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data rekap_krs_mahasiswa dari database
    const rekap_krs_mahasiswa = await RekapKRSMahasiswa.findAll({ include: [{ model: Prodi }, { model: Periode }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rekap KRS Mahasiswa Success",
      jumlahData: rekap_krs_mahasiswa.length,
      data: rekap_krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKRSMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const RekapKRSMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!RekapKRSMahasiswaId) {
      return res.status(400).json({
        message: "Rekap KRS Mahasiswa ID is required",
      });
    }

    // Cari data rekap_krs_mahasiswa berdasarkan ID di database
    const rekap_krs_mahasiswa = await RekapKRSMahasiswa.findByPk(RekapKRSMahasiswaId, {
      include: [{ model: Prodi }, { model: Periode }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rekap_krs_mahasiswa) {
      return res.status(404).json({
        message: `<===== Rekap KRS Mahasiswa With ID ${RekapKRSMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rekap KRS Mahasiswa By ID ${RekapKRSMahasiswaId} Success:`,
      data: rekap_krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// filter function rekap krs mahasiswa
const getRekapKRSMahasiswaByFilter = async (req, res, next) => {
  try {
    // memperoleh id
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;
    const mataKuliahId = req.params.id_matkul;
    const mahasiswaId = req.params.id_registrasi_mahasiswa;

    // pengecekan parameter id
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }
    if (!mataKuliahId) {
      return res.status(400).json({
        message: "Mata Kuliah ID is required",
      });
    }
    if (!mahasiswaId) {
      return res.status(400).json({
        message: "Mahasiswa ID is required",
      });
    }

    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetRekapKRSMahasiswa",
      token: `${token}`,
      filter: `id_prodi='${prodiId}' and id_semester='${semesterId}' and id_matkul='${mataKuliahId}' and id_registrasi_mahasiswa='${mahasiswaId}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataRekapKRSMahasiswa = response.data.data;

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Get Rekap KRS Mahasiswa from Feeder Success",
      totalData: dataRekapKRSMahasiswa.length,
      dataRekapKRSMahasiswa: dataRekapKRSMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRekapKRSMahasiswa,
  getRekapKRSMahasiswaById,
  getRekapKRSMahasiswaByFilter,
};
