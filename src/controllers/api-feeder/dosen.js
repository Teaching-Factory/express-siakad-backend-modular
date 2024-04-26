const axios = require("axios");
const { getToken } = require("./get-token");
const { Dosen } = require("../../../models");

const getDosen = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetListDosen",
      token: `${token}`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataDosen = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_dosen of dataDosen) {
      // Periksa apakah data sudah ada di tabel
      const existingDosen = await Dosen.findOne({
        where: {
          id_dosen: data_dosen.id_dosen,
        },
      });

      if (!existingDosen) {
        // Data belum ada, buat entri baru di database
        const dateParts = data_dosen.tanggal_lahir.split("-"); // Membagi tanggal menjadi bagian-bagian
        const tanggal_lahir = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Format tanggal

        await Dosen.create({
          id_dosen: data_dosen.id_dosen,
          nama_dosen: data_dosen.nama_dosen,
          nidn: data_dosen.nidn,
          nip: data_dosen.nip,
          jenis_kelamin: data_dosen.jenis_kelamin,
          tanggal_lahir: tanggal_lahir,
          id_agama: data_dosen.id_agama,
          id_status_aktif: data_dosen.id_status_aktif,
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Dosen Success",
      totalData: dataDosen.length,
      dataDosen: dataDosen,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDosen,
};
