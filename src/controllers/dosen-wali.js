const { Op, where } = require("sequelize");
const { DosenWali, Mahasiswa, Periode, Angkatan, TahunAjaran } = require("../../models");

const getAllDosenWaliByDosenAndTahunAjaranId = async (req, res) => {
  try {
    const dosenId = req.params.id_dosen;
    const tahunAjaranId = req.params.id_tahun_ajaran;

    // Ambil semua data dosen_walis dari database
    const dosen_walis = await DosenWali.findAll({
      where: {
        id_dosen: dosenId,
        id_tahun_ajaran: tahunAjaranId,
      },
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa Wali Success",
      jumlahData: dosen_walis.length,
      data: dosen_walis,
    });
  } catch (error) {
    next(error);
  }
};

const createDosenWaliSingle = async (req, res, next) => {
  try {
    const nim = req.body.nim;
    const dosenId = req.params.id_dosen;
    const tahunAjaranId = req.params.id_tahun_ajaran;

    // Cari data mahasiswa berdasarkan nim
    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: nim,
      },
    });

    // Jika mahasiswa tidak ditemukan, kirim respons JSON dengan pesan error
    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }

    // Gunakan metode create untuk membuat data dosen wali baru
    const newDosenWali = await DosenWali.create({
      id_dosen: dosenId,
      id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      id_tahun_ajaran: tahunAjaranId,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Dosen Wali Single Success =====>",
      data: newDosenWali,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDosenWaliById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const dosenWaliId = req.params.id;

    // Cari data dosen_wali berdasarkan ID di database
    let dosen_wali = await DosenWali.findByPk(dosenWaliId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!dosen_wali) {
      return res.status(404).json({
        message: `<===== Dosen Wali With ID ${dosenWaliId} Not Found:`,
      });
    }

    // Hapus data dosen_wali dari database
    await dosen_wali.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Dosen Wali With ID ${dosenWaliId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMahasiswaByProdiAndAngkatanId = async (req, res, next) => {
  try {
    const prodiId = req.params.id_prodi;
    const angkatanId = req.params.id_angkatan;

    // Ambil data angkatan berdasarkan id_angkatan
    const angkatan = await Angkatan.findOne({
      where: {
        id: angkatanId,
      },
    });

    if (!angkatan) {
      return res.status(404).json({ message: "Angkatan tidak ditemukan" });
    }

    // Ambil semua data mahasiswa yang terkait dengan id_prodi
    const mahasiswas = await Mahasiswa.findAll({
      include: [
        {
          model: Periode,
          where: {
            id_prodi: prodiId,
          },
          attributes: [], // Tidak mengambil kolom dari tabel Periode
        },
      ],
    });

    // Filter data mahasiswa berdasarkan nama_periode_masuk yang sesuai dengan tahun angkatan
    const filteredMahasiswas = mahasiswas.filter((mahasiswa) => {
      const [tahunAwal] = mahasiswa.nama_periode_masuk.split("/");
      return tahunAwal === angkatan.tahun;
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa By Prodi dan Angkatan Success =====>",
      jumlahData: filteredMahasiswas.length,
      data: filteredMahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const createDosenWaliKolektif = async (req, res, next) => {
  try {
    const { mahasiswas } = req.body;
    const dosenId = req.params.id_dosen;

    // Ambil data tahun ajaran yang aktif
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    if (!tahunAjaran) {
      return res.status(404).json({ message: "Tahun ajaran tidak ditemukan" });
    }

    // Array untuk menyimpan data dosen wali baru yang berhasil dibuat
    const createdDosenWalis = [];

    // Perulangan untuk membuat data dosen wali baru berdasarkan array mahasiswas
    for (const mahasiswa of mahasiswas) {
      const newDosenWali = await DosenWali.create({
        id_dosen: dosenId,
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
        id_tahun_ajaran: tahunAjaran.id_tahun_ajaran,
      });
      createdDosenWalis.push(newDosenWali);
    }

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Dosen Wali Kolektif Success =====>",
      data: createdDosenWalis,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDosenWaliByDosenAndTahunAjaranId,
  createDosenWaliSingle,
  deleteDosenWaliById,
  getAllMahasiswaByProdiAndAngkatanId,
  createDosenWaliKolektif,
};
