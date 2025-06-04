const { MahasiswaLulusDO, Mahasiswa, JenisKeluar, PeriodePerkuliahan } = require("../../../models");

const getAllMahasiswaLulusDO = async (req, res, next) => {
  try {
    // Ambil semua data mahasiswa_lulus_dos dari database
    const mahasiswa_lulus_dos = await MahasiswaLulusDO.findAll({
      include: [{ model: Mahasiswa }, { model: JenisKeluar }, { model: PeriodePerkuliahan }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa Lulus DO Success",
      jumlahData: mahasiswa_lulus_dos.length,
      data: mahasiswa_lulus_dos,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaLulusDOById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const mahasiswaLulusDOId = req.params.id;

    if (!mahasiswaLulusDOId) {
      return res.status(400).json({
        message: "Mahasiswa Lulus DO ID is required",
      });
    }

    // Cari data mahasiswa_lulus_do berdasarkan ID di database
    const mahasiswa_lulus_do = await MahasiswaLulusDO.findByPk(mahasiswaLulusDOId, {
      include: [{ model: Mahasiswa }, { model: JenisKeluar }, { model: PeriodePerkuliahan }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!mahasiswa_lulus_do) {
      return res.status(404).json({
        message: `<===== Mahasiswa Lulus DO With ID ${mahasiswaLulusDOId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Mahasiswa Lulus DO By ID ${mahasiswaLulusDOId} Success:`,
      data: mahasiswa_lulus_do,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMahasiswaLulusDOID = async (req, res, next) => {
  try {
    // Ambil data dengan hanya kolom id_registrasi_mahasiswa
    const mahasiswa_lulus_dos = await MahasiswaLulusDO.findAll({
      where: {
        id_jenis_keluar: 1,
      },
      attributes: ["id_registrasi_mahasiswa"],
    });

    // Ambil hanya ID dan hilangkan duplikat
    const uniqueIds = [...new Set(mahasiswa_lulus_dos.map((item) => item.id_registrasi_mahasiswa))];

    res.status(200).json({
      message: "<===== GET All Mahasiswa Lulus DO ID Success",
      jumlahData: uniqueIds.length,
      data: uniqueIds,
    });
  } catch (error) {
    next(error);
  }
};

const fetchAllMahasiswaLulusDOIds = async () => {
  const mahasiswa_lulus_dos = await MahasiswaLulusDO.findAll({
    where: {
      id_jenis_keluar: 1,
    },
    attributes: ["id_registrasi_mahasiswa"],
    raw: true,
  });

  // Ambil unique ID tanpa duplikat
  const uniqueIds = [...new Set(mahasiswa_lulus_dos.map((mhs) => mhs.id_registrasi_mahasiswa))];
  return uniqueIds;
};

module.exports = {
  getAllMahasiswaLulusDO,
  getMahasiswaLulusDOById,
  getAllMahasiswaLulusDOID,
  fetchAllMahasiswaLulusDOIds,
};
