const { DataLengkapMahasiswaProdi, Prodi, Semester, Mahasiswa, Agama, Wilayah, JenisTinggal, AlatTransportasi, JenjangPendidikan, Pekerjaan, Penghasilan, KebutuhanKhusus, PerguruanTinggi } = require("../../../models");

const getAllDataLengkapMahasiswaProdi = async (req, res, next) => {
  try {
    // Ambil semua data data_lengkap_mahasiswa_prodi dari database
    const data_lengkap_mahasiswa_prodi = await DataLengkapMahasiswaProdi.findAll({
      include: [
        { model: Prodi },
        { model: Semester },
        { model: Mahasiswa },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        { model: AlatTransportasi },
        { model: JenjangPendidikan },
        { model: Pekerjaan },
        { model: Penghasilan },
        { model: KebutuhanKhusus },
        { model: PerguruanTinggi },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Data Lengkap Mahasiswa Prodi Success",
      jumlahData: data_lengkap_mahasiswa_prodi.length,
      data: data_lengkap_mahasiswa_prodi,
    });
  } catch (error) {
    next(error);
  }
};

const getDataLengkapMahasiswaProdiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DataLengkapMahasiswaProdiId = req.params.id;

    // Periksa apakah ID disediakan
    if (!DataLengkapMahasiswaProdiId) {
      return res.status(400).json({
        message: "Data Lengkap Mahasiswa Prodi ID is required",
      });
    }

    // Cari data data_lengkap_mahasiswa_prodi berdasarkan ID di database
    const data_lengkap_mahasiswa_prodi = await DataLengkapMahasiswaProdi.findByPk(DataLengkapMahasiswaProdiId, {
      include: [
        { model: Prodi },
        { model: Semester },
        { model: Mahasiswa },
        { model: Agama },
        { model: Wilayah },
        { model: JenisTinggal },
        { model: AlatTransportasi },
        { model: JenjangPendidikan },
        { model: Pekerjaan },
        { model: Penghasilan },
        { model: KebutuhanKhusus },
        { model: PerguruanTinggi },
      ],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!data_lengkap_mahasiswa_prodi) {
      return res.status(404).json({
        message: `<===== Data Lengkap Mahasiswa Prodi With ID ${DataLengkapMahasiswaProdiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Data Lengkap Mahasiswa Prodi By ID ${DataLengkapMahasiswaProdiId} Success:`,
      data: data_lengkap_mahasiswa_prodi,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDataLengkapMahasiswaProdi,
  getDataLengkapMahasiswaProdiById,
};
