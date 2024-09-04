const axios = require("axios");
const { getToken } = require("./get-token");
const { Semester } = require("../../../models");

const getSemester = async (req, res, next) => {
  try {
    // Mendapatkan token dan url_feeder
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      return res.status(500).json({
        message: "Failed to obtain token or URL feeder"
      });
    }

    const requestBody = {
      act: "GetSemester",
      token: `${token}`
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Tanggapan dari API
    const dataSemester = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const data_semester of dataSemester) {
      // Periksa apakah data sudah ada di tabel
      const existingSemester = await Semester.findOne({
        where: {
          id_semester: data_semester.id_semester
        }
      });

      if (!existingSemester) {
        // Data belum ada, buat entri baru di database
        await Semester.create({
          id_semester: data_semester.id_semester,
          nama_semester: data_semester.nama_semester,
          semester: data_semester.semester,
          id_tahun_ajaran: data_semester.id_tahun_ajaran
        });
      }
    }

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Semester Success",
      totalData: dataSemester.length,
      dataSemester: dataSemester
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSemester
};
