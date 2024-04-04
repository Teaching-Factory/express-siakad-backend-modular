const getAllSettingGlobals = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all setting globals",
  });
};

const updateSettingGlobal = (req, res) => {
  res.json({
    message: "Berhasil mengakses update setting global",
  });
};

module.exports = {
  getAllSettingGlobals,
  updateSettingGlobal,
};
