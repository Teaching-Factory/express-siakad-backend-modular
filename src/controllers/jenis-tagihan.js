const { JenisTagihan } = require("../../models");

const getAllJenisTagihan = async (req, res, next) => {
  try {
    // Ambil semua data jenis_tagihans dari database
    const jenis_tagihans = await JenisTagihan.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenis Tagihan Success",
      jumlahData: jenis_tagihans.length,
      data: jenis_tagihans,
    });
  } catch (error) {
    next(error);
  }
};

const getAllJenisTagihanActive = async (req, res, next) => {
  try {
    // Ambil semua data jenis_tagihans dari database
    const jenis_tagihans = await JenisTagihan.findAll({
      where: {
        status: true,
      },
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenis Tagihan Active Success",
      jumlahData: jenis_tagihans.length,
      data: jenis_tagihans,
    });
  } catch (error) {
    next(error);
  }
};

const getJenisTagihanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const jenisTagihanId = req.params.id;

    if (!jenisTagihanId) {
      return res.status(400).json({
        message: "Jenis Tagihan ID is required",
      });
    }

    // Cari data jenis_tagihan berdasarkan ID di database
    const jenis_tagihan = await JenisTagihan.findByPk(jenisTagihanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_tagihan) {
      return res.status(404).json({
        message: `<===== Jenis Tagihan With ID ${jenisTagihanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jenis Tagihan By ID ${jenisTagihanId} Success:`,
      data: jenis_tagihan,
    });
  } catch (error) {
    next(error);
  }
};

const createJenisTagihan = async (req, res, next) => {
  const { nama_jenis_tagihan, status } = req.body;

  if (!nama_jenis_tagihan) {
    return res.status(400).json({ message: "nama_jenis_tagihan is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  try {
    // Gunakan metode create untuk membuat data jenis tagihan baru
    const newJenisTagihan = await JenisTagihan.create({ nama_jenis_tagihan, status });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Jenis Tagihan Success",
      data: newJenisTagihan,
    });
  } catch (error) {
    next(error);
  }
};

const updateJenisTagihanById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nama_jenis_tagihan, status } = req.body;

  if (!nama_jenis_tagihan) {
    return res.status(400).json({ message: "nama_jenis_tagihan is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }
  try {
    // Dapatkan ID dari parameter permintaan
    const jenisTagihanId = req.params.id;

    if (!jenisTagihanId) {
      return res.status(400).json({
        message: "Jenis Tagihan ID is required",
      });
    }

    // Cari data jenis_tagihan berdasarkan ID di database
    let jenis_tagihan = await JenisTagihan.findByPk(jenisTagihanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_tagihan) {
      return res.status(404).json({
        message: `<===== Jenis Tagihan With ID ${jenisTagihanId} Not Found:`,
      });
    }

    // Update data jenis_tagihan
    jenis_tagihan.nama_jenis_tagihan = nama_jenis_tagihan;

    // Simpan perubahan ke dalam database
    await jenis_tagihan.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Jenis Tagihan With ID ${jenisTagihanId} Success:`,
      data: jenis_tagihan,
    });
  } catch (error) {
    next(error);
  }
};

const deleteJenisTagihanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const jenisTagihanId = req.params.id;

    if (!jenisTagihanId) {
      return res.status(400).json({
        message: "Jenis Tagihan ID is required",
      });
    }

    // Cari data jenis_tagihan berdasarkan ID di database
    let jenis_tagihan = await JenisTagihan.findByPk(jenisTagihanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_tagihan) {
      return res.status(404).json({
        message: `<===== Jenis Tagihan With ID ${jenisTagihanId} Not Found:`,
      });
    }

    // Hapus data jenis_tagihan dari database
    await jenis_tagihan.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Jenis Tagihan With ID ${jenisTagihanId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJenisTagihan,
  getAllJenisTagihanActive,
  getJenisTagihanById,
  createJenisTagihan,
  updateJenisTagihanById,
  deleteJenisTagihanById,
};
