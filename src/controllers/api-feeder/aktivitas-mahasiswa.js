const axios = require("axios");
const { getToken } = require("./get-token");
const { AktivitasMahasiswa } = require("../../../models");

const getAktivitasMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetListAktivitasMahasiswa",
      token: `${token}`,
      order: "id_aktivitas"
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataAktivitasMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const aktivitas_mahasiswa of dataAktivitasMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingAktivitasMahasiswa = await AktivitasMahasiswa.findOne({
        where: {
          id_aktivitas: aktivitas_mahasiswa.id_aktivitas
        }
      });

      if (!existingAktivitasMahasiswa) {
        // Data belum ada, buat entri baru di database
        let data_tanggal = null; // Deklarasikan variabel di luar blok if

        if (aktivitas_mahasiswa.tanggal_sk_tugas != null) {
          const dateParts = aktivitas_mahasiswa.tanggal_sk_tugas.split("-"); // Membagi tanggal menjadi bagian-bagian
          data_tanggal = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Format tanggal
        }

        await AktivitasMahasiswa.create({
          id_aktivitas: aktivitas_mahasiswa.id_aktivitas,
          jenis_anggota: aktivitas_mahasiswa.jenis_anggota,
          nama_jenis_anggota: aktivitas_mahasiswa.nama_jenis_anggota,
          judul: aktivitas_mahasiswa.judul,
          keterangan: aktivitas_mahasiswa.keterangan,
          lokasi: aktivitas_mahasiswa.lokasi,
          sk_tugas: aktivitas_mahasiswa.sk_tugas,
          tanggal_sk_tugas: data_tanggal,
          untuk_kampus_merdeka: aktivitas_mahasiswa.untuk_kampus_merdeka,
          id_jenis_aktivitas: aktivitas_mahasiswa.id_jenis_aktivitas,
          id_prodi: aktivitas_mahasiswa.id_prodi,
          id_semester: aktivitas_mahasiswa.id_semester
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Aktivitas Mahasiswa Success",
      totalData: dataAktivitasMahasiswa.length,
      dataAktivitasMahasiswa: dataAktivitasMahasiswa
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAktivitasMahasiswa
};
