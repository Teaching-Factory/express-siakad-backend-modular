const axios = require("axios");
const { getToken } = require("../../api-feeder/data-feeder/get-token");

const GetKRSMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;
    const registrasiMahasiswaId = req.params.id_registrasi_mahasiswa;
    const periodeId = req.params.id_periode;

    const requestBodyKelasKuliah = {
      act: "GetListKelasKuliah",
      token: token,
      filter: `id_prodi = '${prodiId}' AND id_semester = '${semesterId}'`,
      order: "id_kelas_kuliah",
    };

    const requestBodyKrsMahasiswa = {
      act: "GetKRSMahasiswa",
      token: token,
      filter: `id_registrasi_mahasiswa = '${registrasiMahasiswaId}' AND id_periode = '${periodeId}'`,
      order: "id_kelas_kuliah",
    };

    // Menggunakan token untuk mengambil data
    const response_kelas_kuliah = await axios.post(url_feeder, requestBodyKelasKuliah);
    const response_krs_mahasiswa = await axios.post(url_feeder, requestBodyKrsMahasiswa);

    // Tanggapan dari API
    const dataKelasKuliah = response_kelas_kuliah.data.data || [];
    const dataKrsMahasiswa = response_krs_mahasiswa.data.data || [];

    // Kirim data sebagai respons
    res.status(200).json({
      messageOne: `Get List Kelas Kuliah By Prodi ID ${prodiId} And Semester ID ${semesterId} Success`,
      messageTwo: `Get KRS Mahasiswa By Registrasi Mahasiswa ID ${registrasiMahasiswaId} And Periode ID ${periodeId} Success`,
      totalDataKelasKuliah: dataKelasKuliah.length,
      totalDataKrsMahasiswa: dataKrsMahasiswa.length,
      dataKelasKuliah: dataKelasKuliah,
      dataKrsMahasiswa: dataKrsMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  GetKRSMahasiswa,
};
