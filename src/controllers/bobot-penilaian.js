const getAllBobotPenilaians = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all bobot penilaians",
  });
};

const getBobotPenilaianById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const bobotPenilaianId = req.params.id;

  res.json({
    message: "Berhasil mengakses get bobot penilaian by id",
    bobotPenilaianId: bobotPenilaianId,
  });
};

const createBobotPenilaian = (req, res) => {
  res.json({
    message: "Berhasil mengakses create bobot penilaian",
  });
};

const updateBobotPenilaianById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const bobotPenilaianId = req.params.id;

  res.json({
    message: "Berhasil mengakses update bobot penilaian by id",
    bobotPenilaianId: bobotPenilaianId,
  });
};

const deleteBobotPenilaianById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const bobotPenilaianId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete bobot penilaian by id",
    bobotPenilaianId: bobotPenilaianId,
  });
};

module.exports = {
  getAllBobotPenilaians,
  getBobotPenilaianById,
  createBobotPenilaian,
  updateBobotPenilaianById,
  deleteBobotPenilaianById,
};
