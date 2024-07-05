const { Op } = require("sequelize");

const { SistemKuliah, SistemKuliahMahasiswa, Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Semester, Prodi } = require("../../models");

const createSistemKuliahMahasiswaBySistemKuliahId = async (req, res, next) => {
  try {
    const { mahasiswas } = req.body; // Ambil data mahasiswas dari request body

    const sistem_kuliah_id = req.params.id_sistem_kuliah;

    // Periksa apakah ID disediakan
    if (!sistem_kuliah_id) {
      return res.status(400).json({
        message: "Sistem Kuliah ID is required",
      });
    }

    const sistem_kuliah_mahasiswa = []; // Simpan data sistem_kuliah_mahasiswa yang berhasil dibuat di sini

    // Cari data sistem_kuliah berdasarkan ID di database
    const sistem_kuliah = await SistemKuliah.findByPk(sistem_kuliah_id);

    // Jika data tidak ditemukan, kirim respons 404
    if (!sistem_kuliah) {
      return res.status(404).json({
        message: `<===== Sistem Kuliah With ID ${sistem_kuliah_id} Not Found:`,
      });
    }

    for (const mahasiswa of mahasiswas) {
      const { id_registrasi_mahasiswa } = mahasiswa;

      // Simpan data pengguna ke dalam database
      const newSistemKuliahMahasiswa = await SistemKuliahMahasiswa.create({
        id_sistem_kuliah: sistem_kuliah_id,
        id_registrasi_mahasiswa: id_registrasi_mahasiswa,
      });

      sistem_kuliah_mahasiswa.push(newSistemKuliahMahasiswa);
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GENERATE Sistem Kuliah Mahasiswa ${sistem_kuliah.nama_sk} Success`,
      jumlahData: sistem_kuliah_mahasiswa.length,
      data: sistem_kuliah_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaNotHaveSistemKuliah = async (req, res, next) => {
  try {
    // Ambil semua id_registrasi_mahasiswa dari tabel SistemKuliahMahasiswa
    const idRegistrasiMahasiswaInSistemKuliah = await SistemKuliahMahasiswa.findAll({
      attributes: ["id_registrasi_mahasiswa"],
    });

    // Ubah hasil query menjadi array berisi id_registrasi_mahasiswa
    const idArray = idRegistrasiMahasiswaInSistemKuliah.map((item) => item.id_registrasi_mahasiswa);

    // Cari data mahasiswa yang id_registrasi_mahasiswa tidak ada di array idArray
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: {
          [Op.notIn]: idArray,
        },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Mahasiswa Not Have Sistem Kuliah Success:`,
      jumlahData: mahasiswas.length,
      data: mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const createSistemKuliahMahasiswa = async (req, res, next) => {
  try {
    const { mahasiswas } = req.body; // Ambil data mahasiswas dari request body

    const sistem_kuliah_mahasiswa = []; // Simpan data sistem_kuliah_mahasiswa yang berhasil dibuat di sini

    for (const mahasiswa of mahasiswas) {
      const { id_registrasi_mahasiswa, id_sistem_kuliah } = mahasiswa;

      // Cari data sistem_kuliah berdasarkan ID di database
      const sistem_kuliah = await SistemKuliah.findByPk(id_sistem_kuliah);

      // Jika data tidak ditemukan, kirim respons 404
      if (!sistem_kuliah) {
        return res.status(404).json({
          message: `<===== Sistem Kuliah With ID ${id_sistem_kuliah} Not Found:`,
        });
      }

      // Simpan data pengguna ke dalam database
      const newSistemKuliahMahasiswa = await SistemKuliahMahasiswa.create({
        id_sistem_kuliah,
        id_registrasi_mahasiswa,
      });

      sistem_kuliah_mahasiswa.push(newSistemKuliahMahasiswa);
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GENERATE Sistem Kuliah Mahasiswa Success`,
      jumlahData: sistem_kuliah_mahasiswa.length,
      data: sistem_kuliah_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSistemKuliahMahasiswaBySistemKuliahId,
  getMahasiswaNotHaveSistemKuliah,
  createSistemKuliahMahasiswa,
};
