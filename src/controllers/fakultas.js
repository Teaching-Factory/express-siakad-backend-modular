const { Fakultas } = require("../../models");

const getAllFakultas = async (req, res) => {
  try {
    // Ambil semua data fakukltas dari database
    const fakukltas = await Fakultas.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Fakultas Success",
      jumlahData: fakukltas.length,
      data: fakukltas,
    });
  } catch (error) {
    next(error);
  }
};

const getFakultasById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const FakultasId = req.params.id;

    // Cari data fakukltas berdasarkan ID di database
    const fakukltas = await Fakultas.findByPk(FakultasId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!fakukltas) {
      return res.status(404).json({
        message: `<===== Fakultas With ID ${FakultasId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Fakultas By ID ${FakultasId} Success:`,
      data: fakukltas,
    });
  } catch (error) {
    next(error);
  }
};

// const createFakultas = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses create fakultas",
//   });
// };

// const updateFakultasById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const fakultasId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses update fakultas by id",
//     fakultasId: fakultasId,
//   });
// };

// const deleteFakultasById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const fakultasId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses delete fakultas by id",
//     fakultasId: fakultasId,
//   });
// };

module.exports = {
  getAllFakultas,
  getFakultasById,
  // createFakultas,
  // updateFakultasById,
  // deleteFakultasById,
};
