const getAllUsers = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all users",
  });
};

const getUserById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const userId = req.params.id;

  res.json({
    message: "Berhasil mengakses get user by id",
    userId: userId,
  });
};

const createUser = (req, res) => {
  res.json({
    message: "Berhasil mengakses create user",
  });
};

const updateUserById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const userId = req.params.id;

  res.json({
    message: "Berhasil mengakses update user by id",
    userId: userId,
  });
};

const deleteUserById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const userId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete user by id",
    userId: userId,
  });
};

const importUserByMahasiswa = (req, res) => {
  res.json({
    message: "Berhasil mengakses import user by mahasiswa",
  });
};

const importUserByDosen = (req, res) => {
  res.json({
    message: "Berhasil mengakses import user by dosen",
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  importUserByMahasiswa,
  importUserByDosen,
};
