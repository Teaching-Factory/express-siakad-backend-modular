const { JenisBerkas } = require("../../../models");

const getAllJenisBerkas = async (req, res, next) => {
  try {
    // Ambil semua data jenis_berkas dari database
    const jenis_berkas = await JenisBerkas.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Jenis Berkas Success",
      jumlahData: jenis_berkas.length,
      data: jenis_berkas
    });
  } catch (error) {
    next(error);
  }
};

const getJenisBerkasById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const jenisBerkasId = req.params.id;

    if (!jenisBerkasId) {
      return res.status(400).json({
        message: "Jenis Berkas ID is required"
      });
    }

    // Cari data jenis_berkas berdasarkan ID di database
    const jenis_berkas = await JenisBerkas.findByPk(jenisBerkasId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_berkas) {
      return res.status(404).json({
        message: `<===== Jenis Berkas With ID ${jenisBerkasId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Jenis Berkas By ID ${jenisBerkasId} Success:`,
      data: jenis_berkas
    });
  } catch (error) {
    next(error);
  }
};

const createJenisBerkas = async (req, res, next) => {
  const { nama_berkas, keterangan_singkat, jumlah, wajib, upload } = req.body;

  if (!nama_berkas) {
    return res.status(400).json({ message: "nama_berkas is required" });
  }
  if (!jumlah) {
    return res.status(400).json({ message: "jumlah is required" });
  }

  try {
    // Gunakan metode create untuk membuat data jenis berkas baru
    const jenisBerkas = await JenisBerkas.create({ nama_berkas, keterangan_singkat, jumlah, wajib, upload });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Jenis Berkas Success",
      data: jenisBerkas
    });
  } catch (error) {
    next(error);
  }
};

const updateJenisBerkasById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nama_berkas, keterangan_singkat, jumlah, wajib, upload } = req.body;

  if (!nama_berkas) {
    return res.status(400).json({ message: "nama_berkas is required" });
  }
  if (!jumlah) {
    return res.status(400).json({ message: "jumlah is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const jenisBerkasId = req.params.id;

    if (!jenisBerkasId) {
      return res.status(400).json({
        message: "Jenis Berkas ID is required"
      });
    }

    // Cari data jenis_berkas berdasarkan ID di database
    let jenis_berkas = await JenisBerkas.findByPk(jenisBerkasId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_berkas) {
      return res.status(404).json({
        message: `<===== Jenis Berkas With ID ${jenisBerkasId} Not Found:`
      });
    }

    // Update data jenis_berkas
    jenis_berkas.nama_berkas = nama_berkas;
    jenis_berkas.keterangan_singkat = keterangan_singkat;
    jenis_berkas.jumlah = jumlah;
    jenis_berkas.wajib = wajib;
    jenis_berkas.upload = upload;

    // Simpan perubahan ke dalam database
    await jenis_berkas.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Jenis Berkas With ID ${jenisBerkasId} Success:`,
      data: jenis_berkas
    });
  } catch (error) {
    next(error);
  }
};

const deleteJenisBerkasById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const jenisBerkasId = req.params.id;

    if (!jenisBerkasId) {
      return res.status(400).json({
        message: "Jenis Berkas ID is required"
      });
    }

    // Cari data jenis_berkas berdasarkan ID di database
    let jenis_berkas = await JenisBerkas.findByPk(jenisBerkasId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!jenis_berkas) {
      return res.status(404).json({
        message: `<===== Jenis Berkas With ID ${jenisBerkasId} Not Found:`
      });
    }

    // Hapus data jenis_berkas dari database
    await jenis_berkas.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Jenis Berkas With ID ${jenisBerkasId} Success:`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJenisBerkas,
  getJenisBerkasById,
  createJenisBerkas,
  updateJenisBerkasById,
  deleteJenisBerkasById
};
