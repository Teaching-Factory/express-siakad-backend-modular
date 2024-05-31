const { PesertaKelasKuliah, Angkatan, Mahasiswa, KelasKuliah, DetailNilaiPerkuliahanKelas } = require("../../models");

const getAllPesertaKelasKuliah = async (req, res) => {
  try {
    // Ambil semua data peserta_kelas_kuliah dari database
    const peserta_kelas_kuliah = await PesertaKelasKuliah.findAll({ include: [{ model: KelasKuliah }, { model: Mahasiswa }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Peserta Kelas Kuliah Success",
      jumlahData: peserta_kelas_kuliah.length,
      data: peserta_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getPesertaKelasKuliahById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const PesertaKelasKuliahId = req.params.id;

    // Cari data peserta_kelas_kuliah berdasarkan ID di database
    const peserta_kelas_kuliah = await PesertaKelasKuliah.findByPk(PesertaKelasKuliahId, {
      include: [{ model: KelasKuliah }, { model: Mahasiswa }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!peserta_kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Peserta Kelas Kuliah With ID ${PesertaKelasKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Peserta Kelas Kuliah By ID ${PesertaKelasKuliahId} Success:`,
      data: peserta_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const createPesertaKelasByAngkatanAndKelasKuliahId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;
    const angkatanId = req.params.id_angkatan;

    const { mahasiswas } = req.body; // Ambil data mahasiswas dari request body
    const peserta_kelas = []; // Simpan data yang berhasil dibuat di sini

    // ambil data angkatan
    let angkatan = await Angkatan.findByPk(angkatanId);

    for (const mahasiswa of mahasiswas) {
      const { id_registrasi_mahasiswa } = mahasiswa;

      // Ambil data mahasiswa berdasarkan id_registrasi_mahasiswa
      const data_mahasiswa = await Mahasiswa.findOne({
        where: { id_registrasi_mahasiswa },
      });

      if (!data_mahasiswa) {
        // Jika data mahasiswa tidak ditemukan, lanjutkan ke data mahasiswa berikutnya
        peserta_kelas.push({ message: `Mahasiswa with id ${id_registrasi_mahasiswa} not found` });
        continue;
      }

      const newPesertaKelas = await PesertaKelasKuliah.create({
        angkatan: angkatan.tahun,
        id_registrasi_mahasiswa: data_mahasiswa.id_registrasi_mahasiswa,
        id_kelas_kuliah: kelasKuliahId,
      });

      peserta_kelas.push(newPesertaKelas);
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== CREATE Peserta Kelas Kuliah Success",
      jumlahData: peserta_kelas.length,
      data: peserta_kelas,
    });
  } catch (error) {
    next(error);
  }
};

const getPesertaKelasKuliahByKelasKuliahId = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    // Cari data peserta_kelas_kuliah berdasarkan ID kelas kuliah di database
    const peserta_kelas_kuliah = await PesertaKelasKuliah.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      include: [{ model: KelasKuliah }, { model: Mahasiswa }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!peserta_kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Peserta Kelas Kuliah With ID ${kelasKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Peserta Kelas Kuliah By ID ${kelasKuliahId} Success:`,
      jumlahData: peserta_kelas_kuliah.length,
      data: peserta_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getPesertaKelasWithDetailNilai = async (req, res, next) => {
  try {
    const idKelasKuliah = req.params.id_kelas_kuliah;

    // Ambil data peserta kelas berdasarkan id_kelas_kuliah
    const pesertaKelas = await PesertaKelasKuliah.findAll({
      where: {
        id_kelas_kuliah: idKelasKuliah,
      },
      include: {
        model: Mahasiswa, // Include Mahasiswa untuk mendapatkan informasi detail mahasiswa
      },
    });

    // Ambil data nilai perkuliahan berdasarkan id_kelas_kuliah
    const detailNilaiPerkuliahan = await DetailNilaiPerkuliahanKelas.findAll({
      where: {
        id_kelas_kuliah: idKelasKuliah,
      },
    });

    // Gabungkan data peserta kelas dan nilai perkuliahan berdasarkan id_registrasi_mahasiswa
    const hasilGabungan = pesertaKelas.map((peserta) => {
      const nilai = detailNilaiPerkuliahan.find((nilai) => nilai.id_registrasi_mahasiswa === peserta.id_registrasi_mahasiswa);

      return {
        ...peserta.toJSON(), // Konversi objek Sequelize ke plain object
        DetailNilaiPerkuliahanKelas: nilai ? nilai.toJSON() : null, // Sertakan data nilai jika ada, jika tidak null
      };
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Peserta Kelas With Detail Nilai By Kelas ID ${idKelasKuliah} Success =====>`,
      jumlahData: hasilGabungan.length,
      data: hasilGabungan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPesertaKelasKuliah,
  getPesertaKelasKuliahById,
  createPesertaKelasByAngkatanAndKelasKuliahId,
  getPesertaKelasKuliahByKelasKuliahId,
  getPesertaKelasWithDetailNilai,
};
