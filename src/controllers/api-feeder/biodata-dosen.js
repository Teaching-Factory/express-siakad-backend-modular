const axios = require("axios");
const { getToken } = require("./get-token");
const { BiodataDosen } = require("../../../models");

const getBiodataDosen = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "DetailBiodataDosen",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataBiodataDosen = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const biodata_dosen of dataBiodataDosen) {
      await BiodataDosen.create({
        tempat_lahir: biodata_dosen.tempat_lahir,
        nama_ibu_kandung: biodata_dosen.nama_ibu_kandung,
        nik: biodata_dosen.nik,
        npwp: biodata_dosen.npwp,
        id_jenis_sdm: biodata_dosen.id_jenis_sdm,
        nama_jenis_sdm: biodata_dosen.nama_jenis_sdm,
        no_sk_cpns: biodata_dosen.no_sk_cpns,
        tanggal_sk_cpns: biodata_dosen.tanggal_sk_cpns,
        no_sk_pengangkatan: biodata_dosen.no_sk_pengangkatan,
        mulai_sk_pengangkatan: biodata_dosen.mulai_sk_pengangkatan,
        id_sumber_gaji: biodata_dosen.id_sumber_gaji,
        nama_sumber_gaji: biodata_dosen.nama_sumber_gaji,
        jalan: biodata_dosen.jalan,
        dusun: biodata_dosen.dusun,
        rt: biodata_dosen.rt,
        rw: biodata_dosen.rw,
        ds_kel: biodata_dosen.ds_kel,
        kode_pos: biodata_dosen.kode_pos,
        telepon: biodata_dosen.telepon,
        handphone: biodata_dosen.handphone,
        email: biodata_dosen.email,
        status_pernikahan: biodata_dosen.status_pernikahan,
        nama_suami_istri: biodata_dosen.nama_suami_istri,
        nip_suami_istri: biodata_dosen.nip_suami_istri,
        tanggal_mulai_pns: biodata_dosen.tanggal_mulai_pns,
        id_dosen: biodata_dosen.id_dosen,
        id_lembaga_pengangkatan: biodata_dosen.id_lembaga_pengangkatan,
        id_pangkat_golongan: biodata_dosen.id_pangkat_golongan,
        id_wilayah: biodata_dosen.id_wilayah,
        id_pekerjaan_suami_istri: biodata_dosen.id_pekerjaan_suami_istri,
      });
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Biodata Dosen Success",
      totalData: dataBiodataDosen.length,
      dataBiodataDosen: dataBiodataDosen,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBiodataDosen,
};
