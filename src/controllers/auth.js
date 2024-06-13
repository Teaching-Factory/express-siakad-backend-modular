const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { User, UserRole, Role, BlacklistedToken } = require("../../models");

// Fungsi untuk membuat token JWT
const generateToken = async (user) => {
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
};

const doLogin = async (req, res, next) => {
  // Di sini Anda dapat memverifikasi username dan password
  const { username, password } = req.body;

  // validasi required
  if (!username) {
    return res.status(400).json({ message: "username is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "password is required" });
  }

  // valiasi tipe data
  if (typeof username !== "string") {
    return res.status(400).json({ message: "username must be a string" });
  }
  if (typeof password !== "string") {
    return res.status(400).json({ message: "password must be a string" });
  }

  // validasi input
  if (!validator.isLength(username, { min: 1, max: 12 })) {
    return res.status(400).json({ message: "username must be between 1 and 12 characters" });
  }
  if (!validator.isLength(password, { min: 8, max: 8 })) {
    return res.status(400).json({ message: "password must be 8 characters" });
  }

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

    // Kirim token sebagai respons
    res.json({ message: "Login berhasil", token });
  } catch (error) {
    next(error);
  }
};

// do logout dengan implementasi blacklist token
// const doLogout = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(400).json({ message: "Token tidak ditemukan" });
//     }

//     const blacklistToken = await BlacklistedToken.findOne({
//       where: {
//         token: token,
//       },
//     });

//     // mengecek apakah data blacklist token ada
//     if (blacklistToken) {
//       return res.status(400).json({ message: "Token Sudah Expired" });
//     }

//     // Tambahkan token ke dalam blacklist
//     await BlacklistedToken.create({
//       token,
//     });

//     // Hapus token dari sisi klien
//     res.clearCookie("token");

//     res.json({
//       message: "Anda baru saja logout",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const doLogout = (req, res) => {
  // Hapus token dari sisi klien
  res.clearCookie("token");

  res.json({
    message: "Berhasil mengakses do logout",
    message: "Anda baru saja logout",
  });
};

module.exports = {
  generateToken,
  doLogin,
  doLogout,
};
