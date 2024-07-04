const axios = require("axios");
const { getToken } = require("./get-token");
const { Mahasiswa } = require("../../../models");

const getMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetListMahasiswa",
      token: `${token}`,
      order: "id_registrasi_mahasiswa",
      filter: "id_registrasi_mahasiswa is not null",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_mahasiswa of dataMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingMahasiswa = await Mahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: data_mahasiswa.id_registrasi_mahasiswa,
        },
      });

      if (!existingMahasiswa) {
        // Data belum ada, buat entri baru di database
        const dateParts = data_mahasiswa.tanggal_lahir.split("-"); // Membagi tanggal menjadi bagian-bagian
        const tanggal_lahir = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Format tanggal

        await Mahasiswa.create({
          id_registrasi_mahasiswa: data_mahasiswa.id_registrasi_mahasiswa,
          nama_mahasiswa: data_mahasiswa.nama_mahasiswa,
          jenis_kelamin: data_mahasiswa.jenis_kelamin,
          tanggal_lahir: tanggal_lahir,
          nipd: data_mahasiswa.nipd,
          ipk: data_mahasiswa.ipk,
          total_sks: data_mahasiswa.total_sks,
          nama_status_mahasiswa: data_mahasiswa.nama_status_mahasiswa,
          nim: data_mahasiswa.nim,
          nama_periode_masuk: data_mahasiswa.nama_periode_masuk,
          id_sms: data_mahasiswa.id_sms,
          id_mahasiswa: data_mahasiswa.id_mahasiswa,
          id_perguruan_tinggi: data_mahasiswa.id_perguruan_tinggi,
          id_agama: data_mahasiswa.id_agama,
          id_semester: data_mahasiswa.id_periode,
          id_prodi: data_mahasiswa.id_prodi,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Mahasiswa Success",
      totalData: dataMahasiswa.length,
      dataMahasiswa: dataMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMahasiswa,
};
