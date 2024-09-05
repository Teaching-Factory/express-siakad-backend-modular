const { LaporanPMB } = require("../../models");

const getAllLaporanPMB = async (req, res, next) => {
  try {
    // Ambil semua data laporan_pmbs dari database
    const laporan_pmbs = await LaporanPMB.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Laporan PMB Success",
      jumlahData: laporan_pmbs.length,
      data: laporan_pmbs
    });
  } catch (error) {
    next(error);
  }
};

const getLaporanPMBById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const laporanPMBId = req.params.id;

    if (!laporanPMBId) {
      return res.status(400).json({
        message: "Laporan PMB ID is required"
      });
    }

    // Cari data laporan_pmb berdasarkan ID di database
    const laporan_pmb = await LaporanPMB.findByPk(laporanPMBId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!laporan_pmb) {
      return res.status(404).json({
        message: `<===== Laporan PMB With ID ${laporanPMBId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Laporan PMB By ID ${laporanPMBId} Success:`,
      data: laporan_pmb
    });
  } catch (error) {
    next(error);
  }
};

const createLaporanPMB = async (req, res, next) => {
  const { jenis_laporan, nama_penandatanganan, nomor_identitas, id_jabatan } = req.body;

  try {
    // Gunakan metode create untuk membuat data jabatan baru
    const newLaporanPMB = await LaporanPMB.create({ jenis_laporan, nama_penandatanganan, nomor_identitas, id_jabatan });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Laporan PMB Success",
      data: newLaporanPMB
    });
  } catch (error) {
    next(error);
  }
};

const updateLaporanPMB = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { jenis_laporan, nama_penandatanganan, nomor_identitas, id_jabatan } = req.body;

  try {
    // Dapatkan ID dari parameter permintaan
    const laporanPMBId = req.params.id;

    if (!laporanPMBId) {
      return res.status(400).json({
        message: "Laporan PMB ID is required"
      });
    }

    // Cari data laporan_pmb berdasarkan ID di database
    let laporan_pmb = await LaporanPMB.findByPk(laporanPMBId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!laporan_pmb) {
      return res.status(404).json({
        message: `<===== Laporan PMB With ID ${laporanPMBId} Not Found:`
      });
    }

    // Update data laporan_pmb
    laporan_pmb.jenis_laporan = jenis_laporan;
    laporan_pmb.nama_penandatanganan = nama_penandatanganan;
    laporan_pmb.nomor_identitas = nomor_identitas;
    laporan_pmb.id_jabatan = id_jabatan;

    // Simpan perubahan ke dalam database
    await laporan_pmb.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Laporan PMB With ID ${laporanPMBId} Success:`,
      data: laporan_pmb
    });
  } catch (error) {
    next(error);
  }
};

const updateLaporanPMBKolektif = async (req, res, next) => {
  // Ambil data laporan_pmb dari body permintaan
  const { laporan_pmbs } = req.body;

  if (!Array.isArray(laporan_pmbs) || laporan_pmbs.length === 0) {
    return res.status(400).json({
      message: "laporan_pmbs is required and must be an array with at least one item"
    });
  }

  try {
    // Proses setiap laporan_pmb dalam array
    for (const laporan of laporan_pmbs) {
      const { id, jenis_laporan, nama_penandatanganan, nomor_identitas, id_jabatan } = laporan;

      if (!id) {
        return res.status(400).json({
          message: "ID is required for each laporan_pmb"
        });
      }

      // Cari data laporan_pmb berdasarkan ID di database
      let laporan_pmb = await LaporanPMB.findByPk(id);

      // Jika data tidak ditemukan, kirim respons 404
      if (!laporan_pmb) {
        return res.status(404).json({
          message: `<===== Laporan PMB With ID ${id} Not Found:`
        });
      }

      // Update data laporan_pmb
      laporan_pmb.jenis_laporan = jenis_laporan || laporan_pmb.jenis_laporan;
      laporan_pmb.nama_penandatanganan = nama_penandatanganan || laporan_pmb.nama_penandatanganan;
      laporan_pmb.nomor_identitas = nomor_identitas || laporan_pmb.nomor_identitas;
      laporan_pmb.id_jabatan = id_jabatan || laporan_pmb.id_jabatan;

      // Simpan perubahan ke dalam database
      await laporan_pmb.save();
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "Update Laporan PMB Success",
      data: laporan_pmbs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLaporanPMB,
  getLaporanPMBById,
  createLaporanPMB,
  updateLaporanPMB,
  updateLaporanPMBKolektif
};
