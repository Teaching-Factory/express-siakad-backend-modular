const axios = require("axios");
const { getToken } = require("./get-token");
const { AnggotaAktivitasMahasiswa } = require("../../../models");

const getAnggotaAktivitasMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetListAnggotaAktivitasMahasiswa",
      token: `${token}`,
      order: "id_registrasi_mahasiswa"
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataAnggotaAktivitasMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const anggota_kuliah_mahasiswa of dataAnggotaAktivitasMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingAnggotaAktivitasMahasiswa = await AnggotaAktivitasMahasiswa.findOne({
        where: {
          id_anggota: anggota_kuliah_mahasiswa.id_anggota
        }
      });

      if (!existingAnggotaAktivitasMahasiswa) {
        // Data belum ada, buat entri baru di database
        await AnggotaAktivitasMahasiswa.create({
          id_anggota: anggota_kuliah_mahasiswa.id_anggota,
          jenis_peran: anggota_kuliah_mahasiswa.jenis_peran,
          nama_jenis_peran: anggota_kuliah_mahasiswa.nama_jenis_peran,
          id_aktivitas: anggota_kuliah_mahasiswa.id_aktivitas,
          id_registrasi_mahasiswa: anggota_kuliah_mahasiswa.id_registrasi_mahasiswa
        });
      }
    }
    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Anggota Aktivitas Mahasiswa Success",
      totalData: dataAnggotaAktivitasMahasiswa.length,
      dataAnggotaAktivitasMahasiswa: dataAnggotaAktivitasMahasiswa
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnggotaAktivitasMahasiswa
};
