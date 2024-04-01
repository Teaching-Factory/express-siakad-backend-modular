const doLogin = (req, res) => {
  res.json({
    message: "Berhasil mengakses do login",
  });
};

const doLogout = (req, res) => {
  res.json({
    message: "Berhasil mengakses do logout",
  });
};

module.exports = {
  doLogin,
  doLogout,
};
