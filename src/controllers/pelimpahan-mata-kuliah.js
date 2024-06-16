const { PelimpahanMataKuliah, Dosen, MataKuliah, KelasKuliah } = require("../../models");

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

    if (!pelimpahanMataKuliahId) {
      return res.status(400).json({
        message: "Pelimpahan Mata Kuliah ID is required",
      });
    }

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
    const dosenId = req.params.id_dosen;
    const kelasKuliahId = req.params.id_kelas_kuliah;

    if (!dosenId) {
      return res.status(400).json({
        message: "Dosen ID is required",
      });
    }
    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    // get data penugasan dosen dan kelas kuliah
    const dosen = await Dosen.findByPk(dosenId);
    const kelas_kuliah = await KelasKuliah.findByPk(kelasKuliahId);

    // Gunakan metode create untuk membuat data pelimpahan mata kuliah baru
    const newPelimpahanMataKuliah = await PelimpahanMataKuliah.create({
      id_dosen: dosen.id_dosen,
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
