const createWebService = (req, res) => {
  res.json({
    message: "Berhasil mengakses create web service",
  });
};

const getWebService = (req, res) => {
  res.json({
    message: "Berhasil mengakses get web service",
  });
};

const updateWebService = (req, res) => {
  res.json({
    message: "Berhasil mengakses update web service",
  });
};

module.exports = {
  createWebService,
  getWebService,
  updateWebService,
};
