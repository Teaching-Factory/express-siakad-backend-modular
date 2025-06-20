const { KelasKuliah, MataKuliah, DetailKelasKuliah, RuangPerkuliahan, Kuesioner, AspekPenilaianDosen, SkalaPenilaianDosen, Mahasiswa, Prodi, JenjangPendidikan, Dosen, Semester, TahunAjaran } = require("../../../models");

const getKelasKuliahByDosenIdAndSemesterId = async (req, res, next) => {
  const { id_semester, id_dosen } = req.query;

  //   validasi
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }
  if (!id_dosen) {
    return res.status(400).json({ message: "id_dosen is required" });
  }

  try {
    // get data kelas kuliah
    const kelas_kuliah = await KelasKuliah.findAll({
      where: {
        id_dosen: id_dosen,
        id_semester: id_semester,
      },
      include: [{ model: MataKuliah }, { model: DetailKelasKuliah, include: [{ model: RuangPerkuliahan }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!kelas_kuliah || kelas_kuliah.length === 0) {
      return res.status(404).json({
        message: `<===== Kelas Kuliah With Dosen ID ${id_dosen} And Semester ID ${id_semester} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Kelas Kuliah By Dosen ID ${id_dosen} And Semester ID ${id_semester} Success:`,
      jumlahData: kelas_kuliah.length,
      dataKelasKuliah: kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getHasilPenilaianDosenPerKelasByKelasKuliahId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Jabatan ID is required",
      });
    }

    // Cari data kelas kuliah berdasarkan ID di database
    const kelas_kuliah = await KelasKuliah.findByPk(kelasKuliahId, {
      include: [
        { model: MataKuliah },
        { model: Dosen },
        { model: Semester, include: [{ model: TahunAjaran }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
        { model: DetailKelasKuliah, include: [{ model: RuangPerkuliahan }] },
      ],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Kelas Kuliah With ID ${kelasKuliahId} Not Found:`,
      });
    }

    const id_semester = kelas_kuliah.id_semester;
    const id_dosen = kelas_kuliah.id_dosen;

    // Get all aspek penilaian by id_semester
    const aspek_penilaian = await AspekPenilaianDosen.findAll({
      where: { id_semester: id_semester },
    });

    // Get all skala penilaian dosen by id_semester
    const skala_penilaian = await SkalaPenilaianDosen.findAll({
      where: { id_semester: id_semester },
    });

    // Cari data responden kuesioner berdasarkan ID Semester dan Dosen di database
    const respondenKuesioners = await Kuesioner.findAll({
      include: [
        {
          model: KelasKuliah,
          where: {
            id_semester: id_semester,
            id_dosen: id_dosen,
          },
        },
        {
          model: Mahasiswa, // Mahasiswa yang mengisi kuesioner
          attributes: ["id_registrasi_mahasiswa"],
        },
      ],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!respondenKuesioners || respondenKuesioners.length === 0) {
      return res.status(404).json({
        message: `<===== Hasil Kuesioner Dosen With Dosen ID ${id_dosen} And Semester ID ${id_semester} Not Found:`,
      });
    }

    // Untuk menyimpan hasil akhir dari penilaian dosen
    const hasilPenilaian = aspek_penilaian.map((aspek) => {
      // Buat objek untuk menghitung skala penilaian secara dinamis
      const skalaCount = {
        nomor_urut_aspek: aspek.nomor_urut_aspek,
        aspek_penilaian: aspek.aspek_penilaian,
        tipe_aspek_penilaian: aspek.tipe_aspek_penilaian,
        deskripsi_pendek: aspek.deskripsi_pendek,
        jumlah_koresponden: 0, // Untuk menghitung jumlah koresponden yang menilai aspek ini
        nilai_akhir: 0.0,
      };

      // Inisialisasi hitungan skala dinamis berdasarkan variabel skala_penilaian
      skala_penilaian.forEach((skala) => {
        skalaCount[skala.keterangan_skala_penilaian] = 0; // Buat properti dinamis untuk setiap skala
      });

      // Loop untuk menghitung skala penilaian berdasarkan responden kuesioner
      respondenKuesioners.forEach((kuesioner) => {
        if (kuesioner.id_aspek_penilaian_dosen === aspek.id) {
          // Temukan skala penilaian yang cocok dan tingkatkan hitungannya
          const skala = skala_penilaian.find((s) => s.id === kuesioner.id_skala_penilaian_dosen);
          if (skala) {
            skalaCount[skala.keterangan_skala_penilaian] += 1;
          }

          // Tambah jumlah koresponden yang menilai aspek ini
          skalaCount.jumlah_koresponden += 1;
        }
      });

      // Menghitung nilai akhir berdasarkan poin_skala_penilaian
      const totalNilai = skala_penilaian.reduce((total, skala) => {
        return total + skalaCount[skala.keterangan_skala_penilaian] * skala.poin_skala_penilaian;
      }, 0);

      skalaCount.nilai_akhir = totalNilai; // Total dari jumlah_responden * poin_skala_penilaian

      // Return hasil untuk aspek penilaian ini
      return {
        aspekPenilaian: aspek.deskripsi, // Atau kolom lainnya yang relevan
        skalaPenilaian: skalaCount,
      };
    });

    // menghitung rata rata nilai akhir
    let rata_rata_nilai_akhir = 0;

    for (let i = 0; i < hasilPenilaian.length; i++) {
      rata_rata_nilai_akhir += hasilPenilaian[i].skalaPenilaian.nilai_akhir;
    }

    rata_rata_nilai_akhir = rata_rata_nilai_akhir / hasilPenilaian.length;

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Hasil Kuesioner Dosen By Dosen ID ${id_dosen} And Semester ID ${id_semester} Success:`,
      rata_rata_nilai_akhir: rata_rata_nilai_akhir,
      kelas_kuliah: kelas_kuliah,
      skala_penilaian: skala_penilaian,
      hasilPenilaian: hasilPenilaian,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKelasKuliahByDosenIdAndSemesterId,
  getHasilPenilaianDosenPerKelasByKelasKuliahId,
};
