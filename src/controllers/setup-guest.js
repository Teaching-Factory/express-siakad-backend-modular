const bcrypt = require("bcrypt");
const { exec } = require("child_process");
const { User, Role, UserRole, sequelize, SeederStatus } = require("../../models");
const { doLogin } = require("../controllers/auth");
const RoleSeeder = require("../../seeders/20240509025858-seed-role");

const setupSeeder = async (req, res, next) => {
  try {
    // Menjalankan perintah migrasi
    await new Promise((resolve, reject) => {
      exec("npx sequelize-cli db:migrate", (error, stdout, stderr) => {
        if (error) {
          console.error(`Migration error: ${error.message}`);
          reject(error);
        } else {
          console.log(`Migration output: ${stdout}`);
          resolve();
        }
      });
    });

    // Cek apakah sudah pernah dijalankan
    const [seederStatus] = await SeederStatus.findOrCreate({
      where: { id: 1 }, // Gunakan ID tetap untuk record status
      defaults: { is_seeded: false },
    });

    if (seederStatus.is_seeded) {
      return res.status(403).json({
        message: "Seeder has already been run. Access denied.",
      });
    }

    // melakukan seeder data role, permission dan role permission
    await RoleSeeder.up(sequelize.getQueryInterface(), sequelize);
    // seeder permission dan role permission menunggu

    // Update status seeder
    seederStatus.is_seeded = true;
    await seederStatus.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Setup Seeder Success",
    });
  } catch (error) {
    next(error);
  }
};

const createUserSuperAdmin = async (req, res, next) => {
  const { nama, email, username, password } = req.body;

  // validasi required
  if (!nama) {
    return res.status(400).json({ message: "nama is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }
  if (!username) {
    return res.status(400).json({ message: "username is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "password is required" });
  }

  try {
    // validasi required
    if (!nama) {
      return res.status(400).json({ message: "nama is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }

    // get role super admin
    const role_super_admin = await Role.findOne({
      where: {
        nama_role: "admin",
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!role_super_admin) {
      return res.status(404).json({
        message: "<===== Role Super Admin Not Found:",
      });
    }

    // mengecek apakah user super admin sudah ada atau belum
    const userSuperAdmin = await User.findOne({
      include: [
        {
          model: UserRole,
          include: [
            {
              model: Role,
              where: {
                nama_role: "admin",
              },
            },
          ],
        },
      ],
    });

    if (!userSuperAdmin) {
      // Hash password sebelum disimpan ke database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Buat user super admin baru
      const newUserSuperAdmin = await User.create({
        nama: nama,
        username: username,
        password: hashedPassword,
        hints: password,
        email: email,
        status: true,
      });

      const newUserSuperAdminRole = await UserRole.create({
        id_role: role_super_admin.id,
        id_user: newUserSuperAdmin.id,
      });

      // Login otomatis setelah membuat user super admin
      const loginRequest = {
        body: {
          username,
          password,
        },
        headers: {
          "user-agent": "Postman", // Atur user-agent jika diperlukan
        },
      };

      await doLogin(loginRequest, res, next);
    } else {
      return res.status(409).json({
        message: "<===== User Super Admin Already Exist:",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  setupSeeder,
  createUserSuperAdmin,
};
