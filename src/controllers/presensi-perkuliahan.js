const getAllPresensiPerkuliahans = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const pertemuanPerkuliahanId = req.params.id_pertemuan_perkuliahan;

  res.json({
    message: "Berhasil mengakses all presensi perkuliahans",
    pertemuanPerkuliahanId: pertemuanPerkuliahanId,
  });
};

const getPresensiPerkuliahanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const presensiPerkuliahanId = req.params.id;

  res.json({
    message: "Berhasil mengakses get presensi perkuliahan by id",
    presensiPerkuliahanId: presensiPerkuliahanId,
  });
};

const createPresensiPerkuliahan = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const pertemuanPerkuliahanId = req.params.id_pertemuan_perkuliahan;

  res.json({
    message: "Berhasil mengakses create presensi perkuliahan",
    pertemuanPerkuliahanId: pertemuanPerkuliahanId,
  });
};

const updatePresensiPerkuliahanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const presensiPerkuliahanId = req.params.id;

  res.json({
    message: "Berhasil mengakses update presensi perkuliahan by id",
    presensiPerkuliahanId: presensiPerkuliahanId,
  });
};

const deletePresensiPerkuliahanById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const presensiPerkuliahanId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete presensi perkuliahan by id",
    presensiPerkuliahanId: presensiPerkuliahanId,
  });
};

const konfirmasiPresensi = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const pertemuanPerkuliahanId = req.params.id_pertemuan_perkuliahan;

  res.json({
    message: "Berhasil mengakses konfirmasi presensi",
    pertemuanPerkuliahanId: pertemuanPerkuliahanId,
  });
};

module.exports = {
  getAllPresensiPerkuliahans,
  getPresensiPerkuliahanById,
  createPresensiPerkuliahan,
  updatePresensiPerkuliahanById,
  deletePresensiPerkuliahanById,
  konfirmasiPresensi,
};
