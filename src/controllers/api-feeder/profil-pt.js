const axios = require("axios");
const { getToken } = require("./get-token");
const { ProfilPT } = require("../../../models");

const getProfilPT = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetProfilPT",
      token: `${token}`,
      //   filter: "where",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataProfilPT = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const profilPerguruanTinggi of dataProfilPT) {
      // Periksa apakah data sudah ada di tabel
      const existingProfilPT = await ProfilPT.findOne({
        where: {
          id_profil_pt: profilPerguruanTinggi.id_profil_pt,
        },
      });

      if (!existingProfilPT) {
        // Data belum ada, buat entri baru di database
        await ProfilPT.create({
          id_profil_pt: profilPerguruanTinggi.id_profil_pt,
          telepon: profilPerguruanTinggi.telepon,
          faximile: profilPerguruanTinggi.faximile,
          email: profilPerguruanTinggi.email,
          website: profilPerguruanTinggi.website,
          jalan: profilPerguruanTinggi.jalan,
          dusun: profilPerguruanTinggi.dusun,
          rt_rw: profilPerguruanTinggi.rt_rw,
          kelurahan: profilPerguruanTinggi.kelurahan,
          kode_pos: profilPerguruanTinggi.kode_pos,
          lintang_bujur: profilPerguruanTinggi.lintang_bujur,
          bank: profilPerguruanTinggi.bank,
          unit_cabang: profilPerguruanTinggi.unit_cabang,
          nomor_rekening: profilPerguruanTinggi.nomor_rekening,
          mbs: profilPerguruanTinggi.mbs,
          luas_tanah_milik: profilPerguruanTinggi.luas_tanah_milik,
          luas_tanah_bukan_milik: profilPerguruanTinggi.luas_tanah_bukan_milik,
          sk_pendirian: profilPerguruanTinggi.sk_pendirian,
          tanggal_sk_pendirian: profilPerguruanTinggi.tanggal_sk_pendirian,
          id_status_milik: profilPerguruanTinggi.id_status_milik,
          nama_status_milik: profilPerguruanTinggi.nama_status_milik,
          status_perguruan_tinggi: profilPerguruanTinggi.status_perguruan_tinggi,
          sk_izin_operasional: profilPerguruanTinggi.sk_izin_operasional,
          tanggal_izin_operasional: profilPerguruanTinggi.tanggal_izin_operasional,
          id_perguruan_tinggi: profilPerguruanTinggi.id_perguruan_tinggi,
          id_wilayah: profilPerguruanTinggi.id_wilayah,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Profil PT Success",
      totalData: dataProfilPT.length,
      dataProfilPT: dataProfilPT,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfilPT,
};
