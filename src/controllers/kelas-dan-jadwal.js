const getAllKelasDanJadwals = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all kelas dan jadwals",
  });
};

const getKelasDanJadwalById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const kelasDanJadwalId = req.params.id;

  res.json({
    message: "Berhasil mengakses get kelas dan jadwal by id",
    kelasDanJadwalId: kelasDanJadwalId,
  });
};

const createKelasDanJadwal = (req, res) => {
  res.json({
    message: "Berhasil mengakses create kelas dan jadwal",
  });
};

const updateKelasDanJadwalById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const kelasDanJadwalId = req.params.id;

  res.json({
    message: "Berhasil mengakses update kelas dan jadwal by id",
    kelasDanJadwalId: kelasDanJadwalId,
  });
};

const deleteKelasDanJadwalById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const kelasDanJadwalId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete kelas dan jadwal by id",
    kelasDanJadwalId: kelasDanJadwalId,
  });
};

module.exports = {
  getAllKelasDanJadwals,
  getKelasDanJadwalById,
  createKelasDanJadwal,
  updateKelasDanJadwalById,
  deleteKelasDanJadwalById,
};
