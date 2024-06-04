const { BlacklistedToken } = require("../../models");

const checkBlacklist = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const blacklistedToken = await BlacklistedToken.findOne({
    where: {
      token,
    },
  });

  if (blacklistedToken) {
    console.log("Ada");
    return res.status(401).json({ message: "Mohon lakukan re-login dengan kredensial yang Anda miliki" });
  }

  next();
};

module.exports = checkBlacklist;
