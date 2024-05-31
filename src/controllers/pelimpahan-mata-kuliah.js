const { PelimpahanMataKuliah, PenugasanDosen, Dosen, MataKuliah, KelasKuliah } = require("../../models");

const getAllPelimpahanMataKuliah = async (req, res, next) => {
  try {
    // Ambil semua data pelimpahan_mata_kuliahs dari database
    const pelimpahan_mata_kuliahs = await PelimpahanMataKuliah.findAll({
      include: [{ model: Dosen }, { model: MataKuliah }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Pelimpahan Mata Kuliah Success",
      jumlahData: pelimpahan_mata_kuliahs.length,
      data: pelimpahan_mata_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

const getPelimpahanMataKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pelimpahanMataKuliahId = req.params.id;

    // Cari data pelimpahan_mata_kuliah berdasarkan ID di database
    const pelimpahan_mata_kuliah = await PelimpahanMataKuliah.findByPk(pelimpahanMataKuliahId, {
      include: [{ model: Dosen }, { model: MataKuliah }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!pelimpahan_mata_kuliah) {
      return res.status(404).json({
        message: `<===== Pelimpahan Mata Kuliah With ID ${pelimpahanMataKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Pelimpahan Mata Kuliah By ID ${pelimpahanMataKuliahId} Success:`,
      data: pelimpahan_mata_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const createPelimpahanMataKuliah = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const penugasanDosenId = req.params.id_registrasi_dosen;
    const kelasKuliahId = req.params.id_kelas_kuliah;

    // get data penugasan dosen dan kelas kuliah
    const penugasan_dosen = await PenugasanDosen.findByPk(penugasanDosenId);
    const kelas_kuliah = await KelasKuliah.findByPk(kelasKuliahId);

    // Gunakan metode create untuk membuat data pelimpahan mata kuliah baru
    const newPelimpahanMataKuliah = await PelimpahanMataKuliah.create({
      id_dosen: penugasan_dosen.id_dosen,
      id_matkul: kelas_kuliah.id_matkul,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Pelimpahan Mata Kuliah Success",
      data: newPelimpahanMataKuliah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPelimpahanMataKuliah,
  getPelimpahanMataKuliahById,
  createPelimpahanMataKuliah,
};
