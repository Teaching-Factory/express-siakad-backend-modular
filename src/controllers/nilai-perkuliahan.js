const { PesertaKelasKuliah, Mahasiswa, KelasKuliah, Prodi, Semester, MataKuliah, Dosen, DetailKelasKuliah, RuangPerkuliahan, DetailNilaiPerkuliahanKelas, BobotPenilaian } = require("../../models");

const getPesertaKelasKuliahByKelasKuliahId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    // Periksa apakah ID disediakan
    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    const detail_kelas_kuliah = await DetailKelasKuliah.findOne({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah, include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }] }],
    });

    // Cari data peserta_kelas_kuliah berdasarkan ID kelas kuliah di database
    const peserta_kelas_kuliah = await PesertaKelasKuliah.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      include: [{ model: KelasKuliah }, { model: Mahasiswa }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (peserta_kelas_kuliah.length === 0) {
      return res.status(404).json({
        message: `<===== Peserta Kelas Kuliah With ID ${kelasKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Peserta Kelas Kuliah By ID ${kelasKuliahId} Success:`,
      jumlahData: peserta_kelas_kuliah.length,
      dataKelasKuliah: detail_kelas_kuliah,
      data: peserta_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const createPenilaianByKelasKuliahId = async (req, res, next) => {
  try {
    const kelasKuliahId = req.params.id_kelas_kuliah;
    const { penilaians } = req.body;

    if (!kelasKuliahId) {
      return res.status(400).json({ message: "Kelas Kuliah ID is required" });
    }

    if (!penilaians || !Array.isArray(penilaians) || penilaians.length === 0) {
      return res.status(400).json({ message: "Invalid or empty penilaians data" });
    }

    const kelas_kuliah = await KelasKuliah.findByPk(kelasKuliahId);

    const prodi = await Prodi.findOne({
      where: {
        id_prodi: kelas_kuliah.id_prodi,
      },
    });

    // Fetch all bobot_penilaian for the given kelasKuliahId's prodi
    const bobotPenilaians = await BobotPenilaian.findAll({
      where: {
        id_prodi: prodi.id_prodi,
      },
    });

    if (!bobotPenilaians || bobotPenilaians.length === 0) {
      return res.status(404).json({ message: "Bobot Penilaian not found for the given prodi" });
    }

    // Prepare an array to store created detail nilai perkuliahan
    const createdDetails = [];

    // Process each penilaians entry
    for (const penilaian of penilaians) {
      const { id_registrasi_mahasiswa, nilai_bobot } = penilaian;

      let totalNilai = 0;
      let totalBobot = 0;

      // Calculate total nilai based on bobot_penilaian and nilai_bobot
      for (const bobot of nilai_bobot) {
        const bobotPenilaian = await BobotPenilaian.findByPk(bobot.id_bobot);

        if (!bobotPenilaian) {
          return res.status(404).json({ message: `Bobot Penilaian with ID ${bobot.id_bobot} not found` });
        }

        totalNilai += (bobot.nilai * bobotPenilaian.bobot_penilaian) / 100;
        totalBobot += bobotPenilaian.bobot_penilaian;
      }

      // Ensure totalBobot is 100
      if (totalBobot !== 100) {
        return res.status(400).json({ message: "Total bobot penilaian does not equal 100" });
      }

      // Calculate nilai angka divided by 25 to get a value between 0 and 4
      let nilai_angka = (totalNilai / 25).toFixed(2);

      let nilai_huruf;
      let nilai_indeks;

      // Convert nilai_angka to nilai_huruf and nilai_indeks
      if (nilai_angka >= 3.5) {
        nilai_huruf = "A";
        nilai_indeks = 4.0;
      } else if (nilai_angka >= 2.5) {
        nilai_huruf = "B";
        nilai_indeks = 3.0;
      } else if (nilai_angka >= 1.5) {
        nilai_huruf = "C";
        nilai_indeks = 2.0;
      } else if (nilai_angka >= 0.5) {
        nilai_huruf = "D";
        nilai_indeks = 1.0;
      } else {
        nilai_huruf = "E";
        nilai_indeks = 0.0;
      }

      console.log(nilai_huruf, nilai_indeks, nilai_angka);

      // get data mahasiswa
      let mahasiswa = await Mahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: id_registrasi_mahasiswa,
        },
      });

      let angkatan_mahasiswa = mahasiswa.nama_periode_masuk.substring(0, 4);

      // Create entry in DetailNilaiPerkuliahanKelas
      const detailNilai = await DetailNilaiPerkuliahanKelas.create({
        jurusan: prodi.nama_program_studi,
        angkatan: angkatan_mahasiswa,
        nilai_angka: parseFloat(nilai_angka),
        nilai_huruf,
        nilai_indeks,
        id_kelas_kuliah: kelasKuliahId,
        id_registrasi_mahasiswa,
      });

      createdDetails.push(detailNilai);
    }

    res.status(201).json({
      message: "Penilaian created successfully",
      dataJumlah: createdDetails.length,
      data: createdDetails,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPesertaKelasKuliahByKelasKuliahId,
  createPenilaianByKelasKuliahId,
};
