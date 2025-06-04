const axios = require("axios");
const { getToken } = require("./get-token");
const { RencanaEvaluasi } = require("../../../../models");

const getRencanaEvaluasi = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder",
      });
    }

    const requestBody = {
      act: "GetListRencanaEvaluasi",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataRencanaEvaluasi = response.data.data;

    // Truncate data
    await RencanaEvaluasi.destroy({
      where: {}, // Hapus semua data
    });

    // Loop untuk menambahkan data ke dalam database
    for (const rencana_evaluasi of dataRencanaEvaluasi) {
      // Periksa apakah data sudah ada di tabel
      const existingRencanaEvaluasi = await RencanaEvaluasi.findOne({
        where: {
          id_rencana_evaluasi: rencana_evaluasi.id_rencana_evaluasi,
        },
      });

      if (!existingRencanaEvaluasi) {
        // Data belum ada, buat entri baru di database
        await RencanaEvaluasi.create({
          id_rencana_evaluasi: rencana_evaluasi.id_rencana_evaluasi,
          nama_evaluasi: rencana_evaluasi.nama_evaluasi,
          deskripsi_indonesia: rencana_evaluasi.deskripsi_indonesia,
          deskrips_inggris: rencana_evaluasi.deskrips_inggris,
          nomor_urut: rencana_evaluasi.nomor_urut,
          bobot_evaluasi: rencana_evaluasi.bobot_evaluasi,
          last_sync: new Date(),
          id_feeder: rencana_evaluasi.id_rencana_evaluasi,
          id_jenis_evaluasi: rencana_evaluasi.id_jenis_evaluasi,
          id_matkul: rencana_evaluasi.id_matkul,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Rencana Evaluasi Success",
      totalData: dataRencanaEvaluasi.length,
      dataRencanaEvaluasi: dataRencanaEvaluasi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRencanaEvaluasi,
};
