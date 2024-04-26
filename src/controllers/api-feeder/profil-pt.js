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
      filter: "id_perguruan_tinggi='0f893db4-cb60-488d-9629-405c729096ae'",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataProfilPT = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const profil_perguruan_tinggi of dataProfilPT) {
      await ProfilPT.create({
        telepon: profil_perguruan_tinggi.telepon,
        faximile: profil_perguruan_tinggi.faximile,
        email: profil_perguruan_tinggi.email,
        website: profil_perguruan_tinggi.website,
        jalan: profil_perguruan_tinggi.jalan,
        dusun: profil_perguruan_tinggi.dusun,
        rt_rw: profil_perguruan_tinggi.rt_rw,
        kelurahan: profil_perguruan_tinggi.kelurahan,
        kode_pos: profil_perguruan_tinggi.kode_pos,
        lintang_bujur: profil_perguruan_tinggi.lintang_bujur,
        bank: profil_perguruan_tinggi.bank,
        unit_cabang: profil_perguruan_tinggi.unit_cabang,
        nomor_rekening: profil_perguruan_tinggi.nomor_rekening,
        mbs: profil_perguruan_tinggi.mbs,
        luas_tanah_milik: profil_perguruan_tinggi.luas_tanah_milik,
        luas_tanah_bukan_milik: profil_perguruan_tinggi.luas_tanah_bukan_milik,
        sk_pendirian: profil_perguruan_tinggi.sk_pendirian,
        tanggal_sk_pendirian: profil_perguruan_tinggi.tanggal_sk_pendirian,
        id_status_milik: profil_perguruan_tinggi.id_status_milik,
        nama_status_milik: profil_perguruan_tinggi.nama_status_milik,
        status_perguruan_tinggi: profil_perguruan_tinggi.status_perguruan_tinggi,
        sk_izin_operasional: profil_perguruan_tinggi.sk_izin_operasional,
        tanggal_izin_operasional: profil_perguruan_tinggi.tanggal_izin_operasional,
        id_perguruan_tinggi: profil_perguruan_tinggi.id_perguruan_tinggi,
        id_wilayah: profil_perguruan_tinggi.id_wilayah,
      });
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
