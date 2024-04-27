const axios = require("axios");
const { getToken } = require("./get-token");
const { JenisAktivitasMahasiswa } = require("../../../models");

const getJenisAktivitasMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetJenisAktivitasMahasiswa",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataJenisAktivitasMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const jenis_aktivitas_mahasiswa of dataJenisAktivitasMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingJenisAktivitasMahasiswa = await JenisAktivitasMahasiswa.findOne({
        where: {
          id_jenis_aktivitas_mahasiswa: jenis_aktivitas_mahasiswa.id_jenis_aktivitas_mahasiswa,
        },
      });

      if (!existingJenisAktivitasMahasiswa) {
        // Data belum ada, buat entri baru di database
        await JenisAktivitasMahasiswa.create({
          id_jenis_aktivitas_mahasiswa: jenis_aktivitas_mahasiswa.id_jenis_aktivitas_mahasiswa,
          nama_jenis_aktivitas_mahasiswa: jenis_aktivitas_mahasiswa.nama_jenis_aktivitas_mahasiswa,
          untuk_kampus_merdeka: jenis_aktivitas_mahasiswa.untuk_kampus_merdeka,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Jenis Aktivitas Mahasiswa Success",
      totalData: dataJenisAktivitasMahasiswa.length,
      dataJenisAktivitasMahasiswa: dataJenisAktivitasMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJenisAktivitasMahasiswa,
};
