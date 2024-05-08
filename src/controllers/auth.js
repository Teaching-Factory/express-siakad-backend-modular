const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models");

// Fungsi untuk membuat token JWT
function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

const doLogin = async (req, res) => {
  // Di sini Anda dapat memverifikasi username dan password
  const { username, password } = req.body;

  try {
    // Cari user berdasarkan username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Username tidak ditemukan" });
    }

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Jika username dan password cocok, buat token JWT
    const token = generateToken(user);

    // Kirim token sebagai respons
    res.json({ message: "Login berhasil", token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
};

const doLogout = (req, res) => {
  // Hapus token dari sisi klien
  res.clearCookie("token");

  res.json({
    message: "Anda baru saja logout",
  });
};

module.exports = {
  doLogin,
  doLogout,
};
