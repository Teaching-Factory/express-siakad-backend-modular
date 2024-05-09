const jwt = require("jsonwebtoken");

const checkToken = async (req, res, next) => {
  try {
    // Dapatkan token JWT dari header Authorization
    const token = req.headers.authorization;

    // Periksa apakah token tersedia
    if (!token) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    // Verifikasi token JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token tidak valid" });
      }

      // Jika token valid, lanjutkan ke rute selanjutnya
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan saat memeriksa izin" });
  }
};

module.exports = checkToken;
