const axios = require("axios");
const { getToken } = require("./get-token");
const { RiwayatPendidikanMahasiswa } = require("../../../models");
const { Prodi } = require("../../../models");

const getRiwayatPendidikanMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetListRiwayatPendidikanMahasiswa",
      token: `${token}`,
      order: "id_registrasi_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataRiwayatPendidikanMahasiswa = response.data.data;

    // Truncate data
    await RiwayatPendidikanMahasiswa.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const riwayat_pendidikan_mahasiswa of dataRiwayatPendidikanMahasiswa) {
      let tanggal_daftar;
      let id_prodi_asal = null;

      const prodi = await Prodi.findOne({
        where: {
          id_prodi: riwayat_pendidikan_mahasiswa.id_prodi_asal,
        },
      });

      // Jika ditemukan, simpan nilainya
      if (prodi) {
        id_prodi_asal = riwayat_pendidikan_mahasiswa.id_prodi_asal;
      }

      //   melakukan pengecekan data tanggal
      if (riwayat_pendidikan_mahasiswa.tanggal_daftar != null) {
        const date_start = riwayat_pendidikan_mahasiswa.tanggal_daftar.split("-");
        tanggal_daftar = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
      }

      await RiwayatPendidikanMahasiswa.create({
        tanggal_daftar: tanggal_daftar,
        keterangan_keluar: riwayat_pendidikan_mahasiswa.keterangan_keluar,
        sks_diakui: riwayat_pendidikan_mahasiswa.sks_diakui,
        nama_ibu_kandung: riwayat_pendidikan_mahasiswa.nama_ibu_kandung,
        biaya_masuk: riwayat_pendidikan_mahasiswa.biaya_masuk,
        id_registrasi_mahasiswa: riwayat_pendidikan_mahasiswa.id_registrasi_mahasiswa,
        id_jenis_daftar: riwayat_pendidikan_mahasiswa.id_jenis_daftar,
        id_jalur_masuk: riwayat_pendidikan_mahasiswa.id_jalur_masuk,
        id_periode_masuk: riwayat_pendidikan_mahasiswa.id_periode_masuk,
        id_jenis_keluar: riwayat_pendidikan_mahasiswa.id_jenis_keluar,
        id_prodi: riwayat_pendidikan_mahasiswa.id_prodi,
        id_pembiayaan: riwayat_pendidikan_mahasiswa.id_pembiayaan,
        id_bidang_minat: riwayat_pendidikan_mahasiswa.id_bidang_minat,
        id_perguruan_tinggi_asal: riwayat_pendidikan_mahasiswa.id_perguruan_tinggi_asal,
        id_prodi_asal: id_prodi_asal,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Riwayat Pendidikan Mahasiswa Success",
      totalData: dataRiwayatPendidikanMahasiswa.length,
      dataRiwayatPendidikanMahasiswa: dataRiwayatPendidikanMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRiwayatPendidikanMahasiswa,
};
