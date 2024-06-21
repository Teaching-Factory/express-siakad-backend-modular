const { RuangPerkuliahan } = require("../../models");

const getAllRuangPerkuliahan = async (req, res, next) => {
  try {
    // Ambil semua data ruang_perkuliahan dari database
    const ruang_perkuliahan = await RuangPerkuliahan.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Ruang Perkuliahan Success",
      jumlahData: ruang_perkuliahan.length,
      data: ruang_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const getRuangPerkuliahanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const ruangPerkuliahanId = req.params.id;

    if (!ruangPerkuliahanId) {
      return res.status(400).json({
        message: "Ruang Perkuliahan ID is required",
      });
    }

    // Cari data ruang_perkuliahan berdasarkan ID di database
    const ruang_perkuliahan = await RuangPerkuliahan.findByPk(ruangPerkuliahanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!ruang_perkuliahan) {
      return res.status(404).json({
        message: `<===== Ruang Perkuliahan With ID ${ruangPerkuliahanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Ruang Perkuliahan By ID ${ruangPerkuliahanId} Success:`,
      data: ruang_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const createRuangPerkuliahan = async (req, res, next) => {
  const { id_ruang, nama_ruang_perkuliahan, lokasi } = req.body;

  if (!id_ruang) {
    return res.status(400).json({ message: "id_ruang is required" });
  }
  if (!nama_ruang_perkuliahan) {
    return res.status(400).json({ message: "nama_ruang_perkuliahan is required" });
  }
  if (!lokasi) {
    return res.status(400).json({ message: "lokasi is required" });
  }

  try {
    // Gunakan metode create untuk membuat data ruang perkuliahan baru
    const newRuangPerkuliahan = await RuangPerkuliahan.create({ id_ruang, nama_ruang_perkuliahan, lokasi });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Ruang Perkuliahan Success",
      data: newRuangPerkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const updateRuangPerkuliahanById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { id_ruang, nama_ruang_perkuliahan, lokasi } = req.body;

  if (!id_ruang) {
    return res.status(400).json({ message: "id_ruang is required" });
  }
  if (!nama_ruang_perkuliahan) {
    return res.status(400).json({ message: "nama_ruang_perkuliahan is required" });
  }
  if (!lokasi) {
    return res.status(400).json({ message: "lokasi is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const ruangPerkuliahanId = req.params.id;

    if (!ruangPerkuliahanId) {
      return res.status(400).json({
        message: "Ruang Perkuliahan ID is required",
      });
    }

    // Cari data ruang_perkuliahan berdasarkan ID di database
    let ruang_perkuliahan = await RuangPerkuliahan.findByPk(ruangPerkuliahanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!ruang_perkuliahan) {
      return res.status(404).json({
        message: `<===== Ruang Perkuliahan With ID ${ruangPerkuliahanId} Not Found:`,
      });
    }

    // Update data ruang_perkuliahan
    ruang_perkuliahan.id_ruang = id_ruang;
    ruang_perkuliahan.nama_ruang_perkuliahan = nama_ruang_perkuliahan;
    ruang_perkuliahan.lokasi = lokasi;

    // Simpan perubahan ke dalam database
    await ruang_perkuliahan.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Ruang Perkuliahan With ID ${ruangPerkuliahanId} Success:`,
      data: ruang_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRuangPerkuliahanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const ruangPerkuliahanId = req.params.id;

    if (!ruangPerkuliahanId) {
      return res.status(400).json({
        message: "Ruang Perkuliahan ID is required",
      });
    }

    // Cari data ruang_perkuliahan berdasarkan ID di database
    let ruang_perkuliahan = await RuangPerkuliahan.findByPk(ruangPerkuliahanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!ruang_perkuliahan) {
      return res.status(404).json({
        message: `<===== Ruang Perkuliahan With ID ${ruangPerkuliahanId} Not Found:`,
      });
    }

    // Hapus data ruang_perkuliahan dari database
    await ruang_perkuliahan.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Ruang Perkuliahan With ID ${ruangPerkuliahanId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRuangPerkuliahan,
  getRuangPerkuliahanById,
  createRuangPerkuliahan,
  updateRuangPerkuliahanById,
  deleteRuangPerkuliahanById,
};
