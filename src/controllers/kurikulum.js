const { Kurikulum } = require("../../models");

const getAllKurikulum = async (req, res) => {
  try {
    // Ambil semua data kurikulum dari database
    const kurikulum = await Kurikulum.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kurikulum Success",
      jumlahData: kurikulum.length,
      data: kurikulum,
    });
  } catch (error) {
    next(error);
  }
};

const getKurikulumById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const KurikulumId = req.params.id;

    // Cari data kurikulum berdasarkan ID di database
    const kurikulum = await Kurikulum.findByPk(KurikulumId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!kurikulum) {
      return res.status(404).json({
        message: `<===== Kurikulum With ID ${KurikulumId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Kurikulum By ID ${KurikulumId} Success:`,
      data: kurikulum,
    });
  } catch (error) {
    next(error);
  }
};

// const createKurikulum = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses create kurikulum",
//   });
// };

// const updateKurikulumById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const kurikulumId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses update kurikulum by id",
//     kurikulumId: kurikulumId,
//   });
// };

// const deleteKurikulumById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const kurikulumId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses delete kurikulum by id",
//     kurikulumId: kurikulumId,
//   });
// };

module.exports = {
  getAllKurikulum,
  getKurikulumById,
  // createKurikulum,
  // updateKurikulumById,
  // deleteKurikulumById,
};
