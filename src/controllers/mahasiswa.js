const { Mahasiswa, Periode, Angkatan, StatusMahasiswa } = require("../../models");

const getAllMahasiswa = async (req, res) => {
  try {
    // Ambil semua data mahasiswa dari database
    const mahasiswa = await Mahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa Success",
      jumlahData: mahasiswa.length,
      data: mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const MahasiswaId = req.params.id;

    // Cari data mahasiswa berdasarkan ID di database
    const mahasiswa = await Mahasiswa.findByPk(MahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!mahasiswa) {
      return res.status(404).json({
        message: `<===== Mahasiswa With ID ${MahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Mahasiswa By ID ${MahasiswaId} Success:`,
      data: mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaByProdiId = async (req, res, next) => {
  try {
    // Dapatkan ID prodi dari parameter permintaan
    const prodiId = req.params.id_prodi;

    // Cari semua periode yang memiliki id_prodi sesuai dengan id_prodi yang diberikan
    const periodeIds = await Periode.findAll({
      where: { id_prodi: prodiId },
      attributes: ["id_periode"], // Ambil hanya kolom id_prodi
    });

    // Ekstrak id periode dari hasil pencarian
    const periodeIdList = periodeIds.map((periode) => periode.id_periode);

    // Cari data mahasiswa berdasarkan id_periode yang ada dalam periodeIdList
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_periode: periodeIdList,
      },
    });

    // Jika data mahasiswa tidak ditemukan, kirim respons 404
    if (!mahasiswas || mahasiswas.length === 0) {
      return res.status(404).json({
        message: `<===== Mahasiswa With Prodi ID ${prodiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Mahasiswa By Prodi ID ${prodiId} Success:`,
      jumlahData: mahasiswas.length,
      data: mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaByAngkatanId = async (req, res, next) => {
  try {
    // Dapatkan ID angkatan dari parameter permintaan
    const angkatanId = req.params.id_angkatan;

    // Ambil data angkatan berdasarkan id_angkatan
    const angkatan = await Angkatan.findOne({
      where: {
        id: angkatanId,
      },
    });

    // Jika data angkatan tidak ditemukan, kirim respons 404
    if (!angkatan) {
      return res.status(404).json({
        message: `Angkatan dengan ID ${angkatanId} tidak ditemukan`,
      });
    }

    // Ekstrak tahun dari data angkatan
    const tahunAngkatan = angkatan.tahun;

    // Ambil semua data mahasiswa
    const mahasiswas = await Mahasiswa.findAll();

    // Filter data mahasiswa berdasarkan tahun angkatan yang dicocokkan dengan nama_periode_masuk
    const filteredMahasiswas = mahasiswas.filter((mahasiswa) => {
      const [tahunAwal] = mahasiswa.nama_periode_masuk.split("/");
      return tahunAwal === tahunAngkatan;
    });

    // Jika data mahasiswa yang sesuai tidak ditemukan, kirim respons 404
    if (filteredMahasiswas.length === 0) {
      return res.status(404).json({
        message: `Mahasiswa dengan tahun angkatan ${tahunAngkatan} tidak ditemukan`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `GET Mahasiswa By Angkatan ID ${angkatanId} Success`,
      jumlahData: filteredMahasiswas.length,
      data: filteredMahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaByStatusMahasiswaId = async (req, res, next) => {
  try {
    // Dapatkan ID status mahasiswa dari parameter permintaan
    const statusMahasiswaId = req.params.id_status_mahasiswa;

    // Temukan status mahasiswa berdasarkan ID
    const status_mahasiswa = await StatusMahasiswa.findOne({
      where: {
        id_status_mahasiswa: statusMahasiswaId,
      },
    });

    // Jika status mahasiswa tidak ditemukan, kirim respons 404
    if (!status_mahasiswa) {
      return res.status(404).json({
        message: `Status Mahasiswa dengan ID ${statusMahasiswaId} tidak ditemukan`,
      });
    }

    // Cari data mahasiswa berdasarkan nama_status_mahasiswa yang sesuai
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        nama_status_mahasiswa: status_mahasiswa.nama_status_mahasiswa,
      },
    });

    // Jika data mahasiswa tidak ditemukan, kirim respons 404
    if (!mahasiswas || mahasiswas.length === 0) {
      return res.status(404).json({
        message: `Mahasiswa dengan status mahasiswa ${status_mahasiswa.nama_status_mahasiswa} tidak ditemukan`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `GET Mahasiswa By Status Mahasiswa ${status_mahasiswa.nama_status_mahasiswa} Success`,
      jumlahData: mahasiswas.length,
      data: mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMahasiswa,
  getMahasiswaById,
  getMahasiswaByProdiId,
  getMahasiswaByAngkatanId,
  getMahasiswaByStatusMahasiswaId,
};
