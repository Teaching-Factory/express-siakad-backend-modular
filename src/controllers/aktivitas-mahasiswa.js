const ExcelJS = require("exceljs");
const fs = require("fs").promises;
const { AktivitasMahasiswa, Prodi, JenisAktivitasMahasiswa, Semester } = require("../../models");

const getAllAktivitasMahasiswa = async (req, res) => {
  try {
    // Ambil semua data aktivitas_mahasiswa dari database
    const aktivitas_mahasiswa = await AktivitasMahasiswa.findAll();

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

const getAktivitasMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const AktivitasMahasiswaId = req.params.id;

    // Cari data aktivitas_mahasiswa berdasarkan ID di database
    const aktivitas_mahasiswa = await AktivitasMahasiswa.findByPk(AktivitasMahasiswaId);

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

// const createAktivitasMahasiswa = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses create aktivitas mahasiswa",
//   });
// };

// const updateAktivitasMahasiswaById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const aktivitasMahasiswaId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses update aktivitas mahasiswa by id",
//     aktivitasMahasiswaId: aktivitasMahasiswaId,
//   });
// };

// const deleteAktivitasMahasiswaById = (req, res) => {
//   // Dapatkan ID dari parameter permintaan
//   const aktivitasMahasiswaId = req.params.id;

//   res.json({
//     message: "Berhasil mengakses delete aktivitas mahasiswa by id",
//     aktivitasMahasiswaId: aktivitasMahasiswaId,
//   });
// };

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

        let id_jenis_aktivitas_mahasiswa = null;
        let id_prodi = null;
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

module.exports = {
  getAllAktivitasMahasiswa,
  getAktivitasMahasiswaById,
  importAktivitasMahasiswas,
  // createAktivitasMahasiswa,
  // updateAktivitasMahasiswaById,
  // deleteAktivitasMahasiswaById,
};
