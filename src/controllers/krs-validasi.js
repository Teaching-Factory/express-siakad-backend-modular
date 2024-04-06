const validasiKrsAccept = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const krsId = req.params.id;

  res.json({
    message: "Berhasil mengakses validasi krs accept by id",
    krsId: krsId,
  });
};

module.exports = {
  validasiKrsAccept,
};
