const { KelasKuliah, PesertaKelasKuliah } = require("../../../models");
const { Op } = require("sequelize");

const updateJumlahMahasiswaKelasKuliah = async (req, res, next) => {
  try {
    // Ambil parameter angkatan dari query string
    const angkatan = req.query.angkatan;

    // Cek apakah angkatan dikirim dalam bentuk array
    if (!angkatan || angkatan.length === 0) {
      return res.status(400).json({ message: "Parameter angkatan is required" });
    }

    const semesterFilter = Array.isArray(angkatan)
      ? { [Op.or]: angkatan.map((year) => [{ id_semester: `${year}1` }, { id_semester: `${year}2` }, { id_semester: `${year}3` }]).flat() }
      : { [Op.or]: [{ id_semester: `${angkatan}1` }, { id_semester: `${angkatan}2` }, { id_semester: `${angkatan}3` }] };

    // Get seluruh data kelas kuliah dengan filter
    const kelasKuliahs = await KelasKuliah.findAll({
      where: {
        // jumlah_mahasiswa: 0,
        ...semesterFilter, // Gunakan filter LIKE dengan Op
      },
      attributes: ["id_kelas_kuliah"],
    });

    for (const kelas_kuliah of kelasKuliahs) {
      // Get seluruh data peserta kelas kuliah yang berkaitan
      const peserta_kelas_kuliah = await PesertaKelasKuliah.findAll({
        where: {
          id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah, // Perbaikan pemanggilan ID
        },
      });

      // Update kolom jumlah_mahasiswa
      kelas_kuliah.jumlah_mahasiswa = peserta_kelas_kuliah.length;

      // Simpan perubahan ke dalam database
      await kelas_kuliah.save();
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== UPDATE Jumlah Mahasiswa Kelas Kuliah Success",
      jumlahData: kelasKuliahs.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateJumlahMahasiswaKelasKuliah,
};
