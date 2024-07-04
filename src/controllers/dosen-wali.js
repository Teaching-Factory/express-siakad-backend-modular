const { Op } = require("sequelize");
const { DosenWali, Prodi, Angkatan, TahunAjaran, Dosen, Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Semester } = require("../../models");

const getAllDosenWaliByDosenAndTahunAjaranId = async (req, res, next) => {
  try {
    const dosenId = req.params.id_dosen;
    const tahunAjaranId = req.params.id_tahun_ajaran;

    // Periksa apakah ID disediakan
    if (!dosenId) {
      return res.status(400).json({
        message: "Dosen ID is required",
      });
    }
    if (!tahunAjaranId) {
      return res.status(400).json({
        message: "Tahun Ajaran ID is required",
      });
    }

    // Ambil semua data dosen_walis dari database
    const dosen_walis = await DosenWali.findAll({
      where: {
        id_dosen: dosenId,
        id_tahun_ajaran: tahunAjaranId,
      },
      include: [{ model: Dosen }, { model: Mahasiswa }, { model: TahunAjaran }],
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

const getDosenWaliByTahunAjaranId = async (req, res, next) => {
  try {
    const tahunAjaranId = req.params.id_tahun_ajaran;

    if (!tahunAjaranId) {
      return res.status(400).json({
        message: "Tahun Ajaran ID is required",
      });
    }

    // Ambil semua data dosen_walis dari database berdasarkan tahun ajaran
    const dosen_walis = await DosenWali.findAll({
      where: {
        id_tahun_ajaran: tahunAjaranId,
      },
      include: [{ model: Mahasiswa }, { model: TahunAjaran }],
    });

    // Ekstrak id_dosen dari data dosen_walis yang didapatkan
    const idDosenSet = new Set(dosen_walis.map((dosen_wali) => dosen_wali.id_dosen));
    const idDosenArray = Array.from(idDosenSet);

    // Ambil data dosen berdasarkan id_dosen yang dikumpulkan
    const dosens = await Dosen.findAll({
      where: {
        id_dosen: idDosenArray,
      },
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Dosen Wali By Tahun Ajaran ID ${tahunAjaranId} Success =====>`,
      jumlahData: dosens.length,
      data: dosens,
    });
  } catch (error) {
    next(error);
  }
};

const getDosenWaliByDosenId = async (req, res, next) => {
  try {
    const dosenId = req.params.id_dosen;

    // Periksa apakah ID disediakan
    if (!dosenId) {
      return res.status(400).json({
        message: "Dosen ID is required",
      });
    }

    // Ambil semua data dosen_walis dari database
    const dosen_walis = await DosenWali.findAll({
      where: {
        id_dosen: dosenId,
      },
      include: [{ model: Dosen }, { model: Mahasiswa }, { model: TahunAjaran }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Mahasiswa Wali By ${dosenId} Success`,
      jumlahData: dosen_walis.length,
      data: dosen_walis,
    });
  } catch (error) {
    next(error);
  }
};

const createDosenWaliSingle = async (req, res, next) => {
  const nim = req.body.nim;

  if (!nim) {
    return res.status(400).json({ message: "nim is required" });
  }

  try {
    const dosenId = req.params.id_dosen;
    const tahunAjaranId = req.params.id_tahun_ajaran;

    if (!dosenId) {
      return res.status(400).json({
        message: "Dosen ID is required",
      });
    }
    if (!tahunAjaranId) {
      return res.status(400).json({
        message: "Tahun Ajaran ID is required",
      });
    }

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

    if (!dosenWaliId) {
      return res.status(400).json({
        message: "Dosen Wali ID is required",
      });
    }

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
    // Dapatkan ID prodi dan ID angkatan dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const angkatanId = req.params.id_angkatan;

    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!angkatanId) {
      return res.status(400).json({
        message: "Angkatan ID is required",
      });
    }

    // Ambil data angkatan berdasarkan id_angkatan
    const angkatan = await Angkatan.findOne({ where: { id: angkatanId } });

    // Jika data angkatan tidak ditemukan, kirim respons 404
    if (!angkatan) {
      return res.status(404).json({ message: `Angkatan dengan ID ${angkatanId} tidak ditemukan` });
    }

    // Ekstrak tahun dari data angkatan
    const tahunAngkatan = angkatan.tahun;

    // Cari data mahasiswa berdasarkan id_periode yang ada dalam periodeIdList dan tahun angkatan
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_prodi: prodiId,
        nama_periode_masuk: { [Op.like]: `${tahunAngkatan}/%` },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    // Jika data mahasiswa yang sesuai tidak ditemukan, kirim respons 404
    if (mahasiswas.length === 0) {
      return res.status(404).json({
        message: `Mahasiswa dengan Prodi ID ${prodiId} dan tahun angkatan ${tahunAngkatan} tidak ditemukan`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `GET Mahasiswa By Prodi ID ${prodiId} dan Angkatan ID ${angkatanId} Success`,
      jumlahData: mahasiswas.length,
      data: mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const createDosenWaliKolektif = async (req, res, next) => {
  try {
    const { mahasiswas } = req.body;
    const dosenId = req.params.id_dosen;

    if (!dosenId) {
      return res.status(400).json({
        message: "Dosen ID is required",
      });
    }

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
  getDosenWaliByTahunAjaranId,
  getDosenWaliByDosenId,
  getAllMahasiswaByProdiAndAngkatanId,
  createDosenWaliSingle,
  deleteDosenWaliById,
  createDosenWaliKolektif,
};
