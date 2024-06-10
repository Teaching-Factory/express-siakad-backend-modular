const { Dosen, Agama, StatusKeaktifanPegawai } = require("../../models");

const getAllDosen = async (req, res, next) => {
  try {
    // Ambil semua data dosen dari database
    const dosen = await Dosen.findAll({ include: [{ model: Agama }, { model: StatusKeaktifanPegawai }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Dosen Success",
      jumlahData: dosen.length,
      data: dosen,
    });
  } catch (error) {
    next(error);
  }
};

const getDosenById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DosenId = req.params.id;

    // Periksa apakah ID disediakan
    if (!DosenId) {
      return res.status(400).json({
        message: "Dosen ID is required",
      });
    }

    // Cari data dosen berdasarkan ID di database
    const dosen = await Dosen.findByPk(DosenId, {
      include: [{ model: Agama }, { model: StatusKeaktifanPegawai }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!dosen) {
      return res.status(404).json({
        message: `<===== Dosen With ID ${DosenId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Dosen By ID ${DosenId} Success:`,
      data: dosen,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDosen,
  getDosenById,
};
