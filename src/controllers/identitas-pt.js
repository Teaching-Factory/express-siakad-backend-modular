const getPT = (req, res) => {
  res.json({
    message: "Berhasil mengakses get pt",
  });
};

const updatePT = (req, res) => {
  res.json({
    message: "Berhasil mengakses update pt",
  });
};

module.exports = {
  getPT,
  updatePT,
};
