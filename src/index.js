// configuration env
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// define express server
const cors = require("cors");
const express = require("express");
const path = require("path");
const helmet = require("helmet");

// const apiSyncFeederRoutes = require("./routes/api-sync-feeder");

// import routes
// kumpulan route api v1 (local)
const routeRegister = require("../routes");

// import middleware
const middlewareLogRequest = require("./middlewares/logs");
const middlewareDatabaseConnection = require("./middlewares/database");
const errHandler = require("./middlewares/error-handler");
// const checkBlacklist = require("./middlewares/checkBlacklist"); // not used

// running express server
const app = express();

// Penggunaan Helmet, dengan konfigurasi lengkap
app.use(
  helmet({
    contentSecurityPolicy: false, // Menonaktifkan CSP agar gambar/file bisa dipanggil dari frontend
    crossOriginResourcePolicy: false, // Mengizinkan akses resource dari domain berbeda (misal: frontend di localhost:5173)
  })
);

// Tambahan header manual untuk memastikan file bisa diakses lintas origin
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Middleware untuk melayani file statis
app.use("/src/storage", express.static(path.join(__dirname, "storage")));

// Import cronjob blacklisted token
const schedule = require("node-schedule");

// const cleanExpiredTokens = require("./cronjobs/cronjobScheduler"); // not used

// cronjob (GET)
// const singkronDosen = require("./cronjobs/singkron-get/singkron-dosen-feeder");
// const singkronProdi = require("./cronjobs/singkron-get/singkron-prodi-feeder");
// const singkronSubstansi = require("./cronjobs/singkron-get/singkron-substansi-feeder");
// const singkronMataKuliah = require("./cronjobs/singkron-get/singkron-mata-kuliah-feeder");
// const singkronTahunAjaran = require("./cronjobs/singkron-get/singkron-tahun-ajaran-feeder");
// const singkronSemester = require("./cronjobs/singkron-get/singkron-semester-feeder");
// const singkronKurikulum = require("./cronjobs/singkron-get/singkron-kurikulum-feeder");
// const singkronDetailKurikulum = require("./cronjobs/singkron-get/detail-kurikulum-feeder");
// const singkronPenugasanDosen = require("./cronjobs/singkron-get/penugasan-dosen-feeder");
// const singkronMatkulKurikulum = require("./cronjobs/singkron-get/matkul-kurikulum-feeder");
// const singkronAktivitasKuliahMahasiswa = require("./cronjobs/singkron-get/aktivitas-kuliah-mahasiswa-feeder");
// const singkronPeriodePerkuliahan = require("./cronjobs/singkron-get/periode-perkuliahan-feeder");
// const singkronMahasiswaLulusDO = require("./cronjobs/singkron-get/mahasiswa-lulus-do-feeder");
// const singkronSekolah = require("./cronjobs/singkron-get/singkron-sekolah");

// cronjob (CRUD)
const singkronRencanaEvaluasi = require("./cronjobs/singkron-get/singkron-rencana-evaluasi-feeder");
const singkronKelasKuliah = require("./cronjobs/singkron-get/singkron-kelas-kuliah-feeder");
const singkronKomponenEvaluasiKelas = require("./cronjobs/singkron-get/komponen-evaluasi-kelas-feeder");
const singkronDosenPengajarKelasKuliah = require("./cronjobs/singkron-get/dosen-pengajar-kelas-kuliah-feeder");
const singkronBiodataMahasiswa = require("./cronjobs/singkron-get/biodata-mahasiswa-feeder");
const singkronRiwayatPendidikanMahasiswa = require("./cronjobs/singkron-get/riwayat-pendidikan-mahasiswa-feeder");
const singkronPesertaKelasKuliah = require("./cronjobs/singkron-get/peserta-kelas-kuliah-feeder");
const singkronDetailNilaiPerkuliahanKelas = require("./cronjobs/singkron-get/detail-nilai-perkuliahan-kelas-feeder");
const singkronPerkuliahanMahasiswa = require("./cronjobs/singkron-get/perkuliahan-mahasiswa-feeder");

// cronjob (Delete)
// const deleteBiodataMahasiswaSyncs = require("./cronjobs/delete-syncs/delete-biodata-mahasiswa-syncs");
// const deleteDetailNilaiPerkuliahanKelasSyncs = require("./cronjobs/delete-syncs/delete-detail-nilai-perkuliahan-kelas-syncs");
// const deleteDosenPengajarKelasKuliahSyncs = require("./cronjobs/delete-syncs/delete-dosen-pengajar-kelas-kuliah-syncs");
// const deleteKelasKuliahSyncs = require("./cronjobs/delete-syncs/delete-kelas-kuliah-syncs");
// const deleteKomponenEvaluasiKelasSyncs = require("./cronjobs/delete-syncs/delete-komponen-evaluasi-kelas-syncs");
// const deletePerkuliahanMahasiswaSyncs = require("./cronjobs/delete-syncs/delete-perkuliahan-mahasiswa-syncs");
// const deletePesertaKelasKuliahSyncs = require("./cronjobs/delete-syncs/delete-peserta-kelas-kuliah-syncs");
// const deleteRencanaEvaluasiSyncs = require("./cronjobs/delete-syncs/delete-rencana-evaluasi-syncs");
// const deleteRiwayatPendidikanMahasiswaSyncs = require("./cronjobs/delete-syncs/delete-riwayat-pendidikan-mahasiswa-syncs");

const rule = new schedule.RecurrenceRule();
// cronjob dijalankan ketika jam 0.00
// rule.hour = 0;
// rule.minute = 0;

// cronjob dijalankan setiap 3 jam sekali
rule.minute = 0; // Jalankan tepat di menit 00
rule.hour = new schedule.Range(0, 23, 3); // Setiap 3 jam (00:00, 03:00, 06:00, dst.)

// Atur penjadwalan tugas
schedule.scheduleJob(rule, async function () {
  try {
    // Cronjob dijalankan di jam 00:00
    // await cleanExpiredTokens();

    // Singkron Feeder Get
    // await singkronDosen();
    // await singkronProdi();
    // await singkronSubstansi();
    // await singkronMataKuliah();
    // await singkronTahunAjaran();
    // await singkronSemester();
    // await singkronKurikulum();
    // await singkronDetailKurikulum();
    // await singkronPenugasanDosen();
    // await singkronMatkulKurikulum();
    // await singkronAktivitasKuliahMahasiswa();
    // await singkronSekolah();
    // await singkronPeriodePerkuliahan();
    // await singkronMahasiswaLulusDO(); // (id_semester_aktif)

    // Singkron Feeder (Create ke feeder)
    // await singkronRencanaEvaluasi(); // (seluruh prodi)
    // await singkronKelasKuliah(); // (id_semester_krs)
    // await singkronKomponenEvaluasiKelas(); // (id_semester_aktif)
    // await singkronDosenPengajarKelasKuliah(); // (id_semester_krs)
    // await singkronBiodataMahasiswa(); // (id_semester_krs)
    // await singkronRiwayatPendidikanMahasiswa(); // (id_semester_krs)
    // await singkronPesertaKelasKuliah(); // (id_angkatan dari id_semester_krs)
    // await singkronDetailNilaiPerkuliahanKelas(); // (id_semester_nilai)
    // await singkronPerkuliahanMahasiswa(); // (id_semester_nilai)

    console.log("Semua Cronjob selesai dijalankan.");
  } catch (error) {
    console.error("Error during cronjob execution:", error);
  }
});

// cronjob setiap jam 1 malam (menghapus seluruh data singkron sementara yang berhasil di singkron ke feeder)
const ruleAt1AM = new schedule.RecurrenceRule();
ruleAt1AM.hour = 1;
ruleAt1AM.minute = 0;

schedule.scheduleJob(ruleAt1AM, async function () {
  try {
    console.log("Menjalankan cronjob pembersihan pada pukul 01.00...");

    // cronjob delete singkron sementara
    await deleteBiodataMahasiswaSyncs();
    await deleteDetailNilaiPerkuliahanKelasSyncs();
    await deleteDosenPengajarKelasKuliahSyncs();
    await deleteKelasKuliahSyncs();
    await deleteKomponenEvaluasiKelasSyncs();
    await deletePerkuliahanMahasiswaSyncs();
    await deletePesertaKelasKuliahSyncs();
    await deleteRencanaEvaluasiSyncs();
    await deleteRiwayatPendidikanMahasiswaSyncs();

    console.log("Cronjob Pembersihan data selesai.");
  } catch (error) {
    console.error("Error pada cronjob 01.00:", error);
  }
});

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Sesuaikan dengan domain frontend Anda
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Mengaktifkan cookies dan kredensial lainnya
};

app.use(cors(corsOptions));

// middleware log request
app.use(middlewareLogRequest);

// Uji koneksi ke database saat aplikasi dimulai
middlewareDatabaseConnection
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// middleware request json from client
app.use(express.json());

// route api feeder dikti
// app.use("/sync-feeder", checkToken, apiSyncFeederRoutes);

// modular routes call (local)
app.use("/", routeRegister);

app.use(errHandler);

// runnning at port 4000 on localhost
app.listen(PORT, () => {
  const currentTime = new Date().toLocaleString();
  console.log(`Server berhasil running di port ${PORT} [${currentTime}]`);
});
