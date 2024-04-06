const createMatkulKrs = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const krsId = req.params.id_krs;

  res.json({
    message: "Berhasil mengakses create matkul krs",
    krsId: krsId,
  });
};

module.exports = {
  createMatkulKrs,
};
