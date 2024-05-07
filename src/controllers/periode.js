const { Periode } = require("../../models");

const getAllPeriode = async (req, res) => {
  try {
    // Ambil semua data periode dari database
    const periode = await Periode.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Periode Success",
      jumlahData: periode.length,
      data: periode,
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodeById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PeriodeId = req.params.id;

    // Cari data periode berdasarkan ID di database
    const periode = await Periode.findByPk(PeriodeId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode) {
      return res.status(404).json({
        message: `<===== Periode With ID ${PeriodeId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Periode By ID ${PeriodeId} Success:`,
      data: periode,
    });
  } catch (error) {
    next(error);
  }
};

// const createPeriode = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses create periode",
//   });
// };

// const updatePeriodeById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const periodeId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses update periode by id",
//     periodeId: periodeId,
//   });
// };

// const deletePeriodeById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const periodeId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses delete periode by id",
//     periodeId: periodeId,
//   });
// };

module.exports = {
  getAllPeriode,
  getPeriodeById,
  // createPeriode,
  // updatePeriodeById,
  // deletePeriodeById,
};
