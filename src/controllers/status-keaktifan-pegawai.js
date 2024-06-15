const { StatusKeaktifanPegawai } = require("../../models");

const getAllStatusKeaktifanPegawai = async (req, res, next) => {
  try {
    // Ambil semua data status_keaktifan_pegawai dari database
    const status_keaktifan_pegawai = await StatusKeaktifanPegawai.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Status Keaktifan Pegawai Success",
      jumlahData: status_keaktifan_pegawai.length,
      data: status_keaktifan_pegawai,
    });
  } catch (error) {
    next(error);
  }
};

const getStatusKeaktifanPegawaiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const StatusKeaktifanPegawaiId = req.params.id;

    // Periksa apakah ID disediakan
    if (!StatusKeaktifanPegawaiId) {
      return res.status(400).json({
        message: "Status Keaktifan Pegawai ID is required",
      });
    }

    // Cari data status_keaktifan_pegawai berdasarkan ID di database
    const status_keaktifan_pegawai = await StatusKeaktifanPegawai.findByPk(StatusKeaktifanPegawaiId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!status_keaktifan_pegawai) {
      return res.status(404).json({
        message: `<===== Status Keaktifan Pegawai With ID ${StatusKeaktifanPegawaiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Status Keaktifan Pegawai By ID ${StatusKeaktifanPegawaiId} Success:`,
      data: status_keaktifan_pegawai,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStatusKeaktifanPegawai,
  getStatusKeaktifanPegawaiById,
};
