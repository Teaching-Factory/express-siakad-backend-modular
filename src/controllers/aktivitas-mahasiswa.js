const ExcelJS = require("exceljs");
const fs = require("fs").promises;
const { AktivitasMahasiswa, Prodi, JenisAktivitasMahasiswa, Semester } = require("../../models");

const getAllAktivitasMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data aktivitas_mahasiswa dari database
    const aktivitas_mahasiswa = await AktivitasMahasiswa.findAll({ include: [{ model: JenisAktivitasMahasiswa }, { model: Prodi }, { model: Semester }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Aktivitas Mahasiswa Success",
      jumlahData: aktivitas_mahasiswa.length,
      data: aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAktivitasMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const AktivitasMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!AktivitasMahasiswaId) {
      return res.status(400).json({
        message: "Aktivitas Mahasiswa ID is required",
      });
    }

    // Cari data aktivitas_mahasiswa berdasarkan ID di database
    const aktivitas_mahasiswa = await AktivitasMahasiswa.findByPk(AktivitasMahasiswaId, {
      include: [{ model: JenisAktivitasMahasiswa }, { model: Prodi }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!aktivitas_mahasiswa) {
      return res.status(404).json({
        message: `<===== Aktivitas Mahasiswa With ID ${AktivitasMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Aktivitas Mahasiswa By ID ${AktivitasMahasiswaId} Success:`,
      data: aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const importAktivitasMahasiswas = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error("Worksheet not found in the Excel file");
    }

    let promises = []; // Array untuk menyimpan promise

    // Iterasi setiap baris di worksheet
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
        const kode_prodi = row.getCell(4).value;
        const jenis_aktivitas_mahasiswa = row.getCell(5).value;
        const judul_aktivitas_mahasiswa = row.getCell(7).value;
        const sk_tugas = row.getCell(21).value;
        const tanggal_sk_tugas = row.getCell(22).value;
        const jenis_anggota = row.getCell(23).value;
        const lokasi = row.getCell(24).value;

        // Log the extracted data for debugging
        console.log(`Row ${rowNumber}:`, {
          kode_prodi,
          jenis_aktivitas_mahasiswa,
          judul_aktivitas_mahasiswa,
          sk_tugas,
          tanggal_sk_tugas,
          jenis_anggota,
          lokasi,
        });

        let nama_jenis_anggota = null;
        let untuk_kampus_merdeka = true;

        // Mengambil data prodi
        const prodiPromise = Prodi.findOne({ where: { kode_program_studi: kode_prodi } });
        // Mengambil data jenis aktivitas mahasiswa
        const jenisAktivitasPromise = JenisAktivitasMahasiswa.findOne({ where: { id_jenis_aktivitas_mahasiswa: jenis_aktivitas_mahasiswa } });
        // Mengambil data semester
        const currentYear = new Date().getFullYear().toString();
        const id_semester = currentYear + "1";
        const semesterPromise = Semester.findOne({ where: { id_semester: id_semester } });

        // Push promises ke dalam array
        promises.push(
          Promise.all([prodiPromise, jenisAktivitasPromise, semesterPromise]).then(([prodi, jenis_aktivitas_mahasiswa_data, semester]) => {
            // Mengkondisikan nama jenis anggota
            nama_jenis_anggota = jenis_anggota == 0 ? "Personal" : "Kelompok";

            // Buat data aktivitas mahasiswa
            return AktivitasMahasiswa.create({
              jenis_anggota: jenis_anggota,
              nama_jenis_anggota: nama_jenis_anggota,
              judul: judul_aktivitas_mahasiswa,
              keterangan: null,
              lokasi: lokasi,
              sk_tugas: sk_tugas,
              tanggal_sk_tugas: tanggal_sk_tugas,
              untuk_kampus_merdeka: untuk_kampus_merdeka,
              id_jenis_aktivitas: jenis_aktivitas_mahasiswa_data ? jenis_aktivitas_mahasiswa_data.id_jenis_aktivitas_mahasiswa : null,
              id_prodi: prodi ? prodi.id_prodi : null,
              id_semester: semester ? semester.id_semester : null,
            });
          })
        );
      }
    });

    // Tunggu semua promise selesai
    const aktivitasMahasiswaData = await Promise.all(promises);

    // Hapus file ketika berhasil melakukan import data
    await fs.unlink(filePath);

    res.status(200).json({
      message: "Upload and Import Data Aktivitas Mahasiswa Success",
      jumlahData: aktivitasMahasiswaData.length,
      data: aktivitasMahasiswaData,
    });
  } catch (error) {
    next(error);
  }
};

const getAllAktivitasMahasiswaByProdiSemesterAndJenisAktivitasId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;
    const jenisAktivitasMahasiswaId = req.params.id_jenis_aktivitas;

    // Periksa apakah ID disediakan
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }
    if (!jenisAktivitasMahasiswaId) {
      return res.status(400).json({
        message: "Jenis Aktivitas Mahasiswa ID is required",
      });
    }

    // Ambil semua data aktivitas_mahasiswa dari database berdasarkan filter
    const aktivitas_mahasiswa = await AktivitasMahasiswa.findAll({
      where: {
        id_prodi: prodiId,
        id_semester: semesterId,
        id_jenis_aktivitas: jenisAktivitasMahasiswaId,
      },
      include: [{ model: JenisAktivitasMahasiswa }, { model: Prodi }, { model: Semester }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Aktivitas Mahasiswa By Prodi, Semester and Jenis Aktivitas Mahasiswa Id Success",
      jumlahData: aktivitas_mahasiswa.length,
      data: aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const updateAktivitasMahasiswaById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { id_prodi, id_jenis_aktivitas, judul, lokasi, sk_tugas, tanggal_sk_tugas, jenis_anggota, keterangan, untuk_kampus_merdeka } = req.body;

  // validasi required
  if (!jenis_anggota) {
    return res.status(400).json({ message: "jenis_anggota is required" });
  }
  if (!judul) {
    return res.status(400).json({ message: "judul is required" });
  }
  if (!id_jenis_aktivitas) {
    return res.status(400).json({ message: "id_jenis_aktivitas is required" });
  }
  if (!id_prodi) {
    return res.status(400).json({ message: "id_prodi is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const aktivitasMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!aktivitasMahasiswaId) {
      return res.status(400).json({
        message: "Aktivitas Mahasiswa ID is required",
      });
    }

    // Cari data aktivitas_mahasiswa berdasarkan ID di database
    let aktivitas_mahasiswa = await AktivitasMahasiswa.findByPk(aktivitasMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!aktivitas_mahasiswa) {
      return res.status(404).json({
        message: `<===== Aktivitas Mahasiswa With ID ${aktivitasMahasiswaId} Not Found:`,
      });
    }

    let nama_jenis_anggota = null;
    nama_jenis_anggota = jenis_anggota == 0 ? "Personal" : "Kelompok";

    // Update data aktivitas_mahasiswa
    aktivitas_mahasiswa.id_prodi = id_prodi;
    aktivitas_mahasiswa.id_jenis_aktivitas = id_jenis_aktivitas;
    aktivitas_mahasiswa.judul = judul;
    aktivitas_mahasiswa.lokasi = lokasi;
    aktivitas_mahasiswa.sk_tugas = sk_tugas;
    aktivitas_mahasiswa.tanggal_sk_tugas = tanggal_sk_tugas;
    aktivitas_mahasiswa.jenis_anggota = jenis_anggota;
    aktivitas_mahasiswa.nama_jenis_anggota = nama_jenis_anggota;
    aktivitas_mahasiswa.keterangan = keterangan;
    aktivitas_mahasiswa.untuk_kampus_merdeka = untuk_kampus_merdeka;

    // Simpan perubahan ke dalam database
    await aktivitas_mahasiswa.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Aktivitas Mahasiswa With ID ${aktivitasMahasiswaId} Success:`,
      data: aktivitas_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAktivitasMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const aktivitasMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!aktivitasMahasiswaId) {
      return res.status(400).json({
        message: "Aktivitas Mahasiswa ID is required",
      });
    }

    // Cari data aktivitas_mahasiswa berdasarkan ID di database
    let aktivitas_mahasiswa = await AktivitasMahasiswa.findByPk(aktivitasMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!aktivitas_mahasiswa) {
      return res.status(404).json({
        message: `<===== Aktivitas Mahasiswa With ID ${aktivitasMahasiswaId} Not Found:`,
      });
    }

    // Hapus data aktivitas_mahasiswa dari database
    await aktivitas_mahasiswa.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Aktivitas Mahasiswa With ID ${aktivitasMahasiswaId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAktivitasMahasiswa,
  getAktivitasMahasiswaById,
  importAktivitasMahasiswas,
  getAllAktivitasMahasiswaByProdiSemesterAndJenisAktivitasId,
  updateAktivitasMahasiswaById,
  deleteAktivitasMahasiswaById,
};
