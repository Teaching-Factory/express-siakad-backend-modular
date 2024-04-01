// all method users
const getAllUsers = (req, res) => {
  res.json({
    message: "GET users success",
  });
};

const createNewUser = (req, res) => {
  res.json({
    message: "CREATE users success",
  });
};

// export all method
module.exports = {
  getAllUsers,
  createNewUser,
};
