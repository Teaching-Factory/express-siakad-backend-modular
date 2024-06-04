const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, UserRole, Role, BlacklistedToken } = require("../../models");

// Fungsi untuk membuat token JWT
async function generateToken(user) {
  try {
    // Dapatkan peran pengguna dari tabel UserRole
    const userRoles = await UserRole.findAll({
      where: { id_user: user.id },
      include: [{ model: Role }],
    });

    // Ambil nama peran dari setiap objek userRole
    const dataRoles = userRoles.map((userRole) => userRole.Role.nama_role);

    // Cek apakah pengguna memiliki peran
    if (dataRoles.length === 0) {
      throw new Error("Pengguna tidak memiliki peran");
    }

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        data_roles: dataRoles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
  } catch (error) {
    throw error;
  }
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
    const token = await generateToken(user);
    console.log(token);

    // Kirim token sebagai respons
    res.json({ message: "Login berhasil", token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
};

const doLogout = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res.status(400).json({ message: "Token tidak ditemukan" });
    }

    const blacklistToken = await BlacklistedToken.findOne({
      where: {
        token: token,
      },
    });

    // mengecek apakah data blacklist token ada
    if (blacklistToken) {
      return res.status(400).json({ message: "Token Sudah Expired" });
    }

    // Tambahkan token ke dalam blacklist
    await BlacklistedToken.create({
      token,
    });

    // Hapus token dari sisi klien
    res.clearCookie("token");

    res.json({
      message: "Anda baru saja logout",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  doLogin,
  doLogout,
};
