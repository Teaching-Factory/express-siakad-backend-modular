const bcrypt = require("bcrypt");
const validator = require("validator");
const { Op } = require("sequelize");
const { User, Dosen, Role, UserRole, Mahasiswa, Angkatan, BiodataMahasiswa, PerguruanTinggi, Agama, Prodi, StatusKeaktifanPegawai, Semester, AdminProdi } = require("../../models");

const getAllUser = async (req, res, next) => {
  try {
    // Ambil semua data user dari database
    const user = await User.findAll({
      include: [{ model: UserRole, include: [{ model: Role }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!user || user.length === 0) {
      return res.status(404).json({
        message: `<===== User Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All User Success",
      jumlahData: user.length,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUserByRoleId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const roleId = req.params.id_role;

    // Periksa apakah ID disediakan
    if (!roleId) {
      return res.status(400).json({
        message: "Role ID is required",
      });
    }

    // Ambil semua data user dari database
    const user = await User.findAll({
      attributes: ["nama", "username", "email", "hints"],
      include: [
        {
          model: UserRole,
          where: {
            id_role: roleId,
          },
          include: [{ model: Role }],
        },
      ],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!user || user.length === 0) {
      return res.status(404).json({
        message: `<===== User Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All User By Role ID ${roleId} Success`,
      jumlahData: user.length,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const UserId = req.params.id;

    // Periksa apakah ID disediakan
    if (!UserId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // Cari data user berdasarkan ID di database
    const user = await User.findByPk(UserId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({
        message: `<===== User With ID ${UserId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET User By ID ${UserId} Success:`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const { nama, username, password, email, status, id_role } = req.body;

  // validasi required
  if (!nama) {
    return res.status(400).json({ message: "nama is required" });
  }
  if (!username) {
    return res.status(400).json({ message: "username is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "password is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }
  if (!id_role) {
    return res.status(400).json({ message: "id_role is required" });
  }

  // valiasi tipe data
  if (typeof nama !== "string") {
    return res.status(400).json({ message: "nama must be a string" });
  }
  if (typeof username !== "string") {
    return res.status(400).json({ message: "username must be a string" });
  }
  if (typeof password !== "string") {
    return res.status(400).json({ message: "password must be a string" });
  }
  if (typeof email !== "string") {
    return res.status(400).json({ message: "email must be a string" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "email is not valid" });
  }

  try {
    // Hash password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // validasi required
    if (!nama) {
      return res.status(400).json({ message: "nama is required" });
    }
    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }
    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }
    if (!id_role) {
      return res.status(400).json({ message: "id_role is required" });
    }

    // valiasi tipe data
    if (typeof nama !== "string") {
      return res.status(400).json({ message: "nama must be a string" });
    }
    if (typeof username !== "string") {
      return res.status(400).json({ message: "username must be a string" });
    }
    if (typeof password !== "string") {
      return res.status(400).json({ message: "password must be a string" });
    }
    if (typeof email !== "string") {
      return res.status(400).json({ message: "email must be a string" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "email is not valid" });
    }

    const role = await Role.findByPk(id_role);

    // Jika data tidak ditemukan, kirim respons 404
    if (!role) {
      return res.status(404).json({
        message: "<===== Role Not Found:",
      });
    }

    // Buat user baru
    const newUser = await User.create({
      nama: nama,
      username: username,
      password: hashedPassword,
      hints: password,
      email: email,
      status: status,
    });

    const newUserRole = await UserRole.create({
      id_role: role.id,
      id_user: newUser.id,
    });

    res.status(201).json({
      message: "<===== GENERATE User Success",
      user: newUser,
      role: newUserRole,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  // Ambil data untuk update dari body permintaan
  const { nama, username, password, email, status, id_role } = req.body;

  // validasi required
  if (!nama) {
    return res.status(400).json({ message: "nama is required" });
  }
  if (!username) {
    return res.status(400).json({ message: "username is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "password is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }
  if (!id_role) {
    return res.status(400).json({ message: "id_role is required" });
  }

  // valiasi tipe data
  if (typeof nama !== "string") {
    return res.status(400).json({ message: "nama must be a string" });
  }
  if (typeof username !== "string") {
    return res.status(400).json({ message: "username must be a string" });
  }
  if (typeof password !== "string") {
    return res.status(400).json({ message: "password must be a string" });
  }
  if (typeof email !== "string") {
    return res.status(400).json({ message: "email must be a string" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "email is not valid" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const userId = req.params.id;

    // Temukan user yang akan diperbarui berdasarkan ID
    const user = await User.findByPk(userId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({
        message: "<===== User Not Found:",
      });
    }

    // Update data user
    user.nama = nama || user.nama;
    user.username = username || user.username;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    user.email = email || user.email;
    user.hints = password || user.password;
    user.status = status || user.status;

    await user.save();

    // get data user role
    const user_role = await UserRole.findOne({
      where: {
        id_user: user.id,
      },
      include: [{ model: User }, { model: Role }],
    });

    if (!user_role) {
      return res.status(404).json({
        message: "<===== User Role Not Found:",
      });
    }

    // Update data user role
    user_role.id_role = id_role;

    // Simpan perubahan ke dalam database
    await user_role.save();

    res.json({
      message: "UPDATE User Success",
      dataUser: user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const userId = req.params.id;

    // Cari data user berdasarkan ID di database
    let user = await User.findByPk(userId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({
        message: `<===== User With ID ${userId} Not Found:`,
      });
    }

    // Hapus data user dari database
    await user.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE User With ID ${userId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

const generateUserByMahasiswa = async (req, res, next) => {
  try {
    const { mahasiswas } = req.body; // Ambil data mahasiswas dari request body

    const users = []; // Simpan data pengguna yang berhasil dibuat di sini
    const role = await Role.findOne({
      where: { nama_role: "mahasiswa" },
    });

    for (const mahasiswa of mahasiswas) {
      const { id_registrasi_mahasiswa } = mahasiswa;

      // Ambil data mahasiswa berdasarkan id_registrasi_mahasiswa
      const data_mahasiswa = await Mahasiswa.findOne({
        where: { id_registrasi_mahasiswa },
      });

      if (!data_mahasiswa) {
        // Jika data mahasiswa tidak ditemukan, lanjutkan ke data mahasiswa berikutnya
        users.push({ message: `Mahasiswa with id ${id_registrasi_mahasiswa} not found` });
        continue;
      }

      const { nama_mahasiswa, nim, tanggal_lahir } = data_mahasiswa;

      // Konversi tanggal_lahir ke format yang diinginkan
      const tanggal_lahir_format = convertTanggal(tanggal_lahir);

      // Enkripsi tanggal_lahir untuk digunakan sebagai password
      const hashedPassword = await bcrypt.hash(tanggal_lahir_format, 10);

      // Simpan data pengguna ke dalam database
      const newUser = await User.create({
        nama: nama_mahasiswa,
        username: nim,
        password: hashedPassword,
        hints: tanggal_lahir_format,
        email: null,
        status: true,
      });

      await UserRole.create({
        id_role: role.id,
        id_user: newUser.id,
      });

      users.push(newUser);
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GENERATE All User Mahasiswa Success",
      jumlahData: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const generateUserByDosen = async (req, res, next) => {
  try {
    const { dosens } = req.body; // Ambil data dosens dari request body

    const users = []; // Simpan data pengguna yang berhasil dibuat di sini
    const role = await Role.findOne({
      where: { nama_role: "dosen" },
    });

    for (const dosen of dosens) {
      const { id_dosen } = dosen;

      // Ambil data dosen berdasarkan id_dosen
      const data_dosen = await Dosen.findOne({
        where: { id_dosen },
      });

      if (!data_dosen) {
        // Jika data dosen tidak ditemukan, lanjutkan ke data dosen berikutnya
        users.push({ message: `Dosen with id ${id_dosen} not found` });
        continue;
      }

      const { nama_dosen, nidn, tanggal_lahir } = data_dosen;

      // Konversi tanggal_lahir ke format yang diinginkan
      const tanggal_lahir_format = convertTanggal(tanggal_lahir);

      // Enkripsi tanggal_lahir untuk digunakan sebagai password
      const hashedPassword = await bcrypt.hash(tanggal_lahir_format, 10);

      // Simpan data pengguna ke dalam database
      const newUser = await User.create({
        nama: nama_dosen,
        username: nidn,
        password: hashedPassword,
        hints: tanggal_lahir_format,
        email: null,
        status: true,
      });

      await UserRole.create({
        id_role: role.id,
        id_user: newUser.id,
      });

      users.push(newUser);
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GENERATE All User Dosen Success",
      jumlahData: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getMahasiswaDontHaveUserByProdiAndAngkatanId = async (req, res, next) => {
  try {
    // Dapatkan ID prodi dan ID angkatan dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const angkatanId = req.params.id_angkatan;

    // Periksa apakah ID disediakan
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!angkatanId) {
      return res.status(400).json({
        message: "Angkatan ID is required",
      });
    }

    // Ambil data angkatan berdasarkan id_angkatan
    const angkatan = await Angkatan.findOne({ where: { id: angkatanId } });

    // Jika data angkatan tidak ditemukan, kirim respons 404
    if (!angkatan) {
      return res.status(404).json({ message: `Angkatan dengan ID ${angkatanId} tidak ditemukan` });
    }

    // Ekstrak tahun dari data angkatan
    const tahunAngkatan = angkatan.tahun;

    // Ambil semua username dari tabel User untuk dibandingkan dengan nim mahasiswa
    const users = await User.findAll({
      attributes: ["username"],
    });

    const userUsernames = users.map((user) => user.username);

    // Cari data mahasiswa berdasarkan id_periode yang ada dalam periodeIdList dan tahun angkatan
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_prodi: prodiId,
        nama_periode_masuk: { [Op.like]: `${tahunAngkatan}/%` },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Prodi }, { model: Semester }],
    });

    // Jika data mahasiswa yang sesuai tidak ditemukan, kirim respons 404
    if (mahasiswas.length === 0) {
      return res.status(404).json({
        message: `Mahasiswa dengan Prodi ID ${prodiId} dan tahun angkatan ${tahunAngkatan} tidak ditemukan`,
      });
    }

    const filteredMahasiswas = mahasiswas.filter((mahasiswa) => !userUsernames.includes(mahasiswa.nim));

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `GET Mahasiswa By Prodi ID ${prodiId} dan Angkatan ID ${angkatanId} Success`,
      jumlahData: filteredMahasiswas.length,
      data: filteredMahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const getDosenDontHaveUser = async (req, res, next) => {
  try {
    // Ambil semua username dari tabel User untuk dibandingkan dengan nip dosen
    const users = await User.findAll({
      attributes: ["username"],
    });

    const userUsernames = users.map((user) => user.username);

    // Ambil semua data dosen dari database
    const dosen = await Dosen.findAll({
      include: [{ model: Agama }, { model: StatusKeaktifanPegawai }],
    });

    // Filter dosen yang nip-nya ada dalam daftar username dari tabel User
    const filteredDosen = dosen.filter((dosen) => !userUsernames.includes(dosen.nidn));

    // Jika data dosen yang sesuai tidak ditemukan, kirim respons 404
    if (filteredDosen.length === 0) {
      return res.status(404).json({
        message: "Tidak ada dosen yang belum memiliki user",
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Dosen Success",
      jumlahData: filteredDosen.length,
      data: filteredDosen,
    });
  } catch (error) {
    next(error);
  }
};

const getUserAdminProdi = async (req, res, next) => {
  try {
    // get data role admin prodi
    const role_admin_prodi = await Role.findOne({
      where: {
        nama_role: "admin-prodi",
      },
    });

    if (!role_admin_prodi) {
      return res.status(400).json({
        message: "Role Admin Prodi not found",
      });
    }

    // get data user role
    const userRoles = await UserRole.findAll({
      where: {
        id_role: role_admin_prodi.id,
      },
      include: [{ model: User }],
    });

    // Ambil semua id_user dari tabel AdminProdi
    const adminProdiIds = await AdminProdi.findAll({
      attributes: ["id_user"], // Hanya ambil kolom id_user
    });

    // Buat set untuk id_user yang sudah terdaftar di tabel AdminProdi
    const adminProdiIdSet = new Set(adminProdiIds.map((ap) => ap.id_user));

    // Filter user roles untuk mendapatkan user admin prodi yang belum terdaftar
    const unregisteredAdminProdiUsers = userRoles.filter((userRole) => !adminProdiIdSet.has(userRole.id_user));

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET User Admin Prodi yang belum terdaftar Success:`,
      data: unregisteredAdminProdiUsers,
    });
  } catch (error) {
    next(error);
  }
};

const checkingAdminProdiUser = async (req, res, next) => {
  try {
    const user = req.user;
    let id_prodi_of_admin = null;
    let nama_prodi = null;

    // get role user active
    const roleAdminProdi = await Role.findOne({
      where: { nama_role: "admin-prodi" },
    });

    if (!roleAdminProdi) {
      return res.status(404).json({
        message: "Role Admin Prodi not found",
      });
    }

    // mengecek apakah user saat ini memiliki role camaba
    const userRole = await UserRole.findOne({
      where: { id_user: user.id, id_role: roleAdminProdi.id },
    });

    if (!userRole) {
      return res.status(404).json({
        message: "User is not Admin Prodi",
      });
    }

    const adminProdi = await AdminProdi.findOne({
      where: {
        id_user: user.id,
      },
      include: [{ model: Prodi }],
    });

    if (!adminProdi) {
      return res.status(404).json({
        message: "Admin Prodi not found",
      });
    } else {
      let prodiAdmin = await Prodi.findByPk(adminProdi.id_prodi);

      if (prodiAdmin) {
        id_prodi_of_admin = adminProdi.id_prodi;
        nama_prodi = adminProdi.Prodi.nama_program_studi;
      }
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== Checking Admin Prodi User Success:`,
      id_prodi_of_admin: id_prodi_of_admin,
      nama_prodi: nama_prodi,
    });
  } catch (error) {
    next(error);
  }
};

// Fungsi untuk mengkonversi tanggal_lahir
const convertTanggal = (tanggal_lahir) => {
  const dateParts = tanggal_lahir.split("-");
  const tanggal = dateParts[2];
  const bulan = dateParts[1];
  const tahun = dateParts[0];
  return `${tanggal}${bulan}${tahun}`;
};

module.exports = {
  getAllUser,
  getAllUserByRoleId,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  generateUserByMahasiswa,
  generateUserByDosen,
  getMahasiswaDontHaveUserByProdiAndAngkatanId,
  getDosenDontHaveUser,
  getUserAdminProdi,
  checkingAdminProdiUser,
};
