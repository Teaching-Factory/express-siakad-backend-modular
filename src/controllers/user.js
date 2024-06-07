const bcrypt = require("bcrypt");
const { Mahasiswa } = require("../../models");
const { User, Dosen, Role, UserRole } = require("../../models");

const getAllUser = async (req, res, next) => {
  try {
    // Ambil semua data user dari database
    const user = await User.findAll();

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

const getUserById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const UserId = req.params.id;

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
  try {
    const { nama, username, password, email, status, id_role } = req.body;

    // Hash password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

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
  try {
    // Dapatkan ID dari parameter permintaan
    const userId = req.params.id;

    // Ambil data untuk update dari body permintaan
    const { nama, username, password, email, status, id_role } = req.body;

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
    user.hints = password || user.hints;
    user.email = email || user.email;
    user.status = status || user.status;

    await user.save();

    // Perbarui juga role user jika id_role berbeda
    if (id_role && id_role !== user.id_role) {
      const role = await Role.findByPk(id_role);
      if (!role) {
        return res.status(404).json({
          message: "<===== Role Not Found:",
        });
      }
      await user.update({ id_role: role.id });
    }

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
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  generateUserByMahasiswa,
  generateUserByDosen,
};
