const bcrypt = require("bcrypt");
const { Mahasiswa } = require("../../models");
const { User } = require("../../models");
const { Dosen } = require("../../models");

const getAllUser = async (req, res) => {
  try {
    // Ambil semua data user dari database
    const user = await User.findAll();

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

const getUserById = async (req, res) => {
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

// const createUser = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses create user",
//   });
// };

// const updateUserById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const userId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses update user by id",
//     userId: userId,
//   });
// };

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
  // createUser,
  // updateUserById,
  deleteUserById,
  generateUserByMahasiswa,
  generateUserByDosen,
};
