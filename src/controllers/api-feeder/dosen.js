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
    for (const dosens of dataDosen) {
      // Periksa apakah data sudah ada di tabel
      const existingDosen = await Dosen.findOne({
        where: {
          id_dosen: dosens.id_dosen,
        },
      });

      if (!existingDosen) {
        // Data belum ada, buat entri baru di database
        const dateParts = dosens.tanggal_lahir.split("-"); // Membagi tanggal menjadi bagian-bagian
        const tanggal_lahir = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Format tanggal

        await Dosen.create({
          id_dosen: dosens.id_dosen,
          nama_dosen: dosens.nama_dosen,
          nidn: dosens.nidn,
          nip: dosens.nip,
          jenis_kelamin: dosens.jenis_kelamin,
          tanggal_lahir: tanggal_lahir,
          id_agama: dosens.id_agama,
          id_status_aktif: dosens.id_status_aktif,
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
