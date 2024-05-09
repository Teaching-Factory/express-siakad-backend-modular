const { UserRole, Role } = require("../../models");

const checkRole = (allowedRoles) => async (req, res, next) => {
  try {
    // Dapatkan id pengguna dari token JWT atau dari sesi
    const userId = req.user.id;

    // Dapatkan role pengguna dari database berdasarkan id pengguna
    const userRoles = await UserRole.findAll({
      where: { id_user: userId },
      include: [{ model: Role, attributes: ["nama_role"] }],
    });

    console.log(userRoles);

    if (!userRoles || userRoles.length === 0) {
      return res.status(403).json({ message: "Anda tidak memiliki izin untuk mengakses endpoint ini" });
    }

    const roles = userRoles.map((userRole) => userRole.Role.nama_role);
    console.log(roles);

    // Cek apakah role pengguna termasuk dalam roles yang diizinkan
    if (!allowedRoles.some((role) => roles.includes(role))) {
      return res.status(403).json({ message: "Anda tidak memiliki izin untuk mengakses endpoint ini" });
    }

    // Jika pengguna memiliki peran yang sesuai, lanjutkan ke rute selanjutnya
    next();
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan saat memeriksa izin" });
  }
};

module.exports = checkRole;
