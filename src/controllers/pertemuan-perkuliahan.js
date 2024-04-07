const getAllPertemuanPerkuliahans = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const kelasDanJadwalId = req.params.id_kelas_dan_jadwal;

  res.json({
    message: "Berhasil mengakses all pertemuan perkuliahans",
    kelasDanJadwalId: kelasDanJadwalId,
  });
};

const getPertemuanPerkuliahanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const pertemuanPerkuliahanId = req.params.id;

  res.json({
    message: "Berhasil mengakses get pertemuan perkuliahan by id",
    pertemuanPerkuliahanId: pertemuanPerkuliahanId,
  });
};

const createPertemuanPerkuliahan = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const kelasDanJadwalId = req.params.id_kelas_dan_jadwal;

  res.json({
    message: "Berhasil mengakses create pertemuan perkuliahan",
    kelasDanJadwalId: kelasDanJadwalId,
  });
};

const updatePertemuanPerkuliahanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const pertemuanPerkuliahanId = req.params.id;

  res.json({
    message: "Berhasil mengakses update pertemuan perkuliahan by id",
    pertemuanPerkuliahanId: pertemuanPerkuliahanId,
  });
};

const deletePertemuanPerkuliahanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const pertemuanPerkuliahanId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete pertemuan perkuliahan by id",
    pertemuanPerkuliahanId: pertemuanPerkuliahanId,
  });
};

module.exports = {
  getAllPertemuanPerkuliahans,
  getPertemuanPerkuliahanById,
  createPertemuanPerkuliahan,
  updatePertemuanPerkuliahanById,
  deletePertemuanPerkuliahanById,
};
