// configuration env
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// define express server
const cors = require("cors");
const express = require("express");

// import routes
// route api feeder dikti
const apiFeederRoutes = require("./routes/api-feeder");

// route api local done
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const roleRoutes = require("./routes/role");
const agamaRoutes = require("./routes/agama");
const negaraRoutes = require("./routes/negara");
const wilayahRoutes = require("./routes/wilayah");
const perguruanTinggiRoutes = require("./routes/perguruan_tinggi");
const profilPTRoutes = require("./routes/profil-pt");
const jalurMasukRoutes = require("./routes/jalur-masuk");
const jenisPendaftaranRoutes = require("./routes/jenis-pendaftaran");
const jenisTinggalRoutes = require("./routes/jenis-tinggal");
const alatTransportasiRoutes = require("./routes/alat-transportasi");
const statusMahasiswaRoutes = require("./routes/status-mahasiswa");
const kebutuhanKhususRoutes = require("./routes/kebutuhan-khusus");
const penghasilanRoutes = require("./routes/penghasilan");
const jenisSMSRoutes = require("./routes/jenis-sms");
const lembagaPengangkatanRoutes = require("./routes/lembaga-pengangkatan");
const statusKeaktifanPegawaiRoutes = require("./routes/status-keaktifan-pegawai");
const pangkatGolonganRoutes = require("./routes/pangkat-golongan");
const pekerjaanRoutes = require("./routes/pekerjaan");
const dosenRoutes = require("./routes/dosen");
const biodataDosenRoutes = require("./routes/biodata-dosen");
const jenjangPendidikanRoutes = require("./routes/jenjang-pendidikan");
const prodiRoutes = require("./routes/prodi");
const periodeRoutes = require("./routes/periode");
const jenisSubstansiRoutes = require("./routes/jenis-substansi");
const substansiRoutes = require("./routes/substansi");
const substansiKuliahRoutes = require("./routes/substansi-kuliah");
const mataKuliahRoutes = require("./routes/mata-kuliah");
const tahunAjaranRoutes = require("./routes/tahun-ajaran");
const fakultasRoutes = require("./routes/fakultas");
const semesterRoutes = require("./routes/semester");
const kurikulumRoutes = require("./routes/kurikulum");
const detailKurikulumRoutes = require("./routes/detail-kurikulum");
const penugasanDosenRoutes = require("./routes/penugasan-dosen");
const matkulKurikulumRoutes = require("./routes/matkul-kurikulum");
const kelasKuliahRoutes = require("./routes/kelas-kuliah");
const detailKelasKuliahRoutes = require("./routes/detail-kelas-kuliah");
const perhitunganSKSRoutes = require("./routes/perhitungan-sks");
const biodataMahasiswaRoutes = require("./routes/biodata-mahasiswa");
const mahasiswaRoutes = require("./routes/mahasiswa");
const jenisKeluarRoutes = require("./routes/jenis-keluar");
const pembiayaanRoutes = require("./routes/pembiayaan");
const bidangMinatRoutes = require("./routes/bidang-minat");
const riwayatPendidikanMahasiswaRoutes = require("./routes/riwayat-pendidikan-mahasiswa");
const detailNilaiPerkuliahanKelasRoutes = require("./routes/detail-nilai-perkuliahan-kelas");
const skalaNilaiProdiRoutes = require("./routes/skala-nilai-prodi");
const riwayatNilaiMahasiswaRoutes = require("./routes/riwayat-nilai-mahasiswa");
const pesertaKelasKuliahRoutes = require("./routes/peserta-kelas-kuliah");
const perkuliahanMahasiswaRoutes = require("./routes/perkuliahan-mahasiswa");
const detailPerkuliahanMahasiswaRoutes = require("./routes/detail-perkuliahan-mahasiswa");
const periodePerkuliahanRoutes = require("./routes/periode-perkuliahan");
const detailPeriodePerkuliahanRoutes = require("./routes/detail-periode-perkuliahan");
const krsMahasiswaRoutes = require("./routes/krs-mahasiswa");
const aktivitasKuliahMahasiswaRoutes = require("./routes/aktivitas-kuliah-mahasiswa");
const jenisAktivitasMahasiswaRoutes = require("./routes/jenis-aktivitas-mahasiswa");
const dataLengkapMahasiswaProdiRoutes = require("./routes/data-lengkap-mahasiswa-prodi");
const aktivitasMahasiswaRoutes = require("./routes/aktivitas-mahasiswa");
const anggotaAktivitasMahasiswaRoutes = require("./routes/anggota-aktivitas-mahasiswa");
const konversiKampusMerdekaRoutes = require("./routes/konversi-kampus-merdeka");
const transkripMahasiswaRoutes = require("./routes/transkrip-mahasiswa");
const rekapJumlahMahasiswaRoutes = require("./routes/rekap-jumlah-mahasiswa");
const rekapKHSMahasiswaRoutes = require("./routes/rekap-khs-mahasiswa");
const rekapKRSMahasiswaRoutes = require("./routes/rekap-krs-mahasiswa");
const angkatanRoutes = require("./routes/angkatan");
const jabatanRoutes = require("./routes/jabatan");
const unitJabatanRoutes = require("./routes/unit-jabatan");
const sistemKuliahRoutes = require("./routes/sistem-kuliah");
const sistemKuliahMahasiswaRoutes = require("./routes/sistem-kuliah-mahasiswa");
const tagihanMahasiswaRoutes = require("./routes/tagihan-mahasiswa");
const pembayaranMahasiswaRoutes = require("./routes/pembayaran-mahasiswa");
const unsurPenilaianRoutes = require("./routes/unsur-penilaian");
const bobotPenilaianRoutes = require("./routes/bobot-penilaian");
const ruangPerkuliahanRoutes = require("./routes/ruang-perkuliahan");
const beritaRoutes = require("./routes/berita");
const dosenWaliRoutes = require("./routes/dosen-wali");
const dosenPengajarKelasKuliah = require("./routes/dosen-pengajar-kelas-kuliah");
const pelimpahanMataKuliahRoutes = require("./routes/pelimpahan-mata-kuliah");
const mahasiswaBimbinganDosenRoutes = require("./routes/mahasiswa-bimbingan-dosen");
const ujiMahasiswaRoutes = require("./routes/uji-mahasiswa");
const pertemuanPerkuliahanRoutes = require("./routes/pertemuan-perkuliahan");
const presensiPerkuliahanRoutes = require("./routes/presensi-perkuliahan");

// route api local not done yet
const settingGlobalRoutes = require("./routes/setting-global");
const settingWSRoutes = require("./routes/setting-ws");
const nilaiPerkuliahanRoutes = require("./routes/nilai-perkuliahan");
const khsMahasiswaRoutes = require("./routes/khs-mahasiswa");
const transkripNilaiRoutes = require("./routes/transkrip-nilai");

// import middleware
const middlewareLogRequest = require("./middlewares/logs");
const middlewareDatabaseConnection = require("./middlewares/database");
const errHandler = require("./middlewares/error-handler");
const checkToken = require("./middlewares/check-token");
const checkBlacklist = require("./middlewares/checkBlacklist");

// running express server
const app = express();

// Import cronjob blacklisted token
const schedule = require("node-schedule");
const cleanExpiredTokens = require("./cronjobs/cronjobScheduler");

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;

// Atur penjadwalan tugas
schedule.scheduleJob(rule, function () {
  // Tambahkan kode untuk tugas yang ingin dijalankan
  cleanExpiredTokens();
});

const corsOptions = {
  origin: "http://127.0.0.1:5173", // Sesuaikan dengan domain frontend Anda
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
app.use("/api-feeder", checkToken, checkBlacklist, apiFeederRoutes);

// route api local done
app.use("/user", checkToken, checkBlacklist, userRoutes);
app.use("/auth", authRoutes);
app.use("/role", checkToken, checkBlacklist, roleRoutes);
app.use("/agama", checkToken, checkBlacklist, checkBlacklist, agamaRoutes);
app.use("/negara", checkToken, checkBlacklist, negaraRoutes);
app.use("/wilayah", checkToken, checkBlacklist, wilayahRoutes);
app.use("/perguruan-tinggi", checkToken, checkBlacklist, perguruanTinggiRoutes);
app.use("/profil-pt", checkToken, checkBlacklist, profilPTRoutes);
app.use("/jalur-masuk", checkToken, checkBlacklist, jalurMasukRoutes);
app.use("/jenis-pendaftaran", checkToken, checkBlacklist, jenisPendaftaranRoutes);
app.use("/jenis-tinggal", checkToken, checkBlacklist, jenisTinggalRoutes);
app.use("/alat-transportasi", checkToken, checkBlacklist, alatTransportasiRoutes);
app.use("/status-mahasiswa", checkToken, checkBlacklist, statusMahasiswaRoutes);
app.use("/kebutuhan-khusus", checkToken, checkBlacklist, kebutuhanKhususRoutes);
app.use("/penghasilan", checkToken, checkBlacklist, penghasilanRoutes);
app.use("/jenis-sms", checkToken, checkBlacklist, jenisSMSRoutes);
app.use("/lembaga-pengangkatan", checkToken, checkBlacklist, lembagaPengangkatanRoutes);
app.use("/status-keaktifan-pegawai", checkToken, checkBlacklist, statusKeaktifanPegawaiRoutes);
app.use("/pangkat-golongan", checkToken, checkBlacklist, pangkatGolonganRoutes);
app.use("/pekerjaan", checkToken, checkBlacklist, pekerjaanRoutes);
app.use("/dosen", checkToken, checkBlacklist, dosenRoutes);
app.use("/biodata-dosen", checkToken, checkBlacklist, biodataDosenRoutes);
app.use("/jenjang-pendidikan", checkToken, checkBlacklist, jenjangPendidikanRoutes);
app.use("/prodi", checkToken, checkBlacklist, prodiRoutes);
app.use("/periode", checkToken, checkBlacklist, periodeRoutes);
app.use("/jenis-substansi", checkToken, checkBlacklist, jenisSubstansiRoutes);
app.use("/substansi", checkToken, checkBlacklist, substansiRoutes);
app.use("/substansi-kuliah", checkToken, checkBlacklist, substansiKuliahRoutes);
app.use("/mata-kuliah", checkToken, checkBlacklist, mataKuliahRoutes);
app.use("/tahun-ajaran", checkToken, checkBlacklist, tahunAjaranRoutes);
app.use("/fakultas", checkToken, checkBlacklist, fakultasRoutes);
app.use("/semester", checkToken, checkBlacklist, semesterRoutes);
app.use("/kurikulum", checkToken, checkBlacklist, kurikulumRoutes);
app.use("/detail-kurikulum", checkToken, checkBlacklist, detailKurikulumRoutes);
app.use("/penugasan-dosen", checkToken, checkBlacklist, penugasanDosenRoutes);
app.use("/matkul-kurikulum", checkToken, checkBlacklist, matkulKurikulumRoutes);
app.use("/kelas-kuliah", checkToken, checkBlacklist, kelasKuliahRoutes);
app.use("/detail-kelas-kuliah", checkToken, checkBlacklist, detailKelasKuliahRoutes);
app.use("/perhitungan-sks", checkToken, checkBlacklist, perhitunganSKSRoutes);
app.use("/biodata-mahasiswa", checkToken, checkBlacklist, biodataMahasiswaRoutes);
app.use("/mahasiswa", checkToken, checkBlacklist, mahasiswaRoutes);
app.use("/jenis-keluar", checkToken, checkBlacklist, jenisKeluarRoutes);
app.use("/pembiayaan", checkToken, checkBlacklist, pembiayaanRoutes);
app.use("/bidang-minat", checkToken, checkBlacklist, bidangMinatRoutes);
app.use("/riwayat-pendidikan-mahasiswa", checkToken, checkBlacklist, riwayatPendidikanMahasiswaRoutes);
app.use("/detail-nilai-perkuliahan-kelas", checkToken, checkBlacklist, detailNilaiPerkuliahanKelasRoutes);
app.use("/skala-nilai-prodi", checkToken, checkBlacklist, skalaNilaiProdiRoutes);
app.use("/riwayat-nilai-mahasiswa", checkToken, checkBlacklist, riwayatNilaiMahasiswaRoutes);
app.use("/peserta-kelas-kuliah", checkToken, checkBlacklist, pesertaKelasKuliahRoutes);
app.use("/perkuliahan-mahasiswa", checkToken, checkBlacklist, perkuliahanMahasiswaRoutes);
app.use("/detail-perkuliahan-mahasiswa", checkToken, checkBlacklist, detailPerkuliahanMahasiswaRoutes);
app.use("/periode-perkuliahan", checkToken, checkBlacklist, periodePerkuliahanRoutes);
app.use("/detail-periode-perkuliahan", checkToken, checkBlacklist, detailPeriodePerkuliahanRoutes);
app.use("/krs-mahasiswa", checkToken, checkBlacklist, krsMahasiswaRoutes);
app.use("/aktivitas-kuliah-mahasiswa", checkToken, checkBlacklist, aktivitasKuliahMahasiswaRoutes);
app.use("/jenis-aktivitas-mahasiswa", checkToken, checkBlacklist, jenisAktivitasMahasiswaRoutes);
app.use("/data-lengkap-mahasiswa-prodi", checkToken, checkBlacklist, dataLengkapMahasiswaProdiRoutes);
app.use("/aktivitas-mahasiswa", checkToken, checkBlacklist, aktivitasMahasiswaRoutes);
app.use("/anggota-aktivitas-mahasiswa", checkToken, checkBlacklist, anggotaAktivitasMahasiswaRoutes);
app.use("/konversi-kampus-merdeka", checkToken, checkBlacklist, konversiKampusMerdekaRoutes);
app.use("/transkrip-mahasiswa", checkToken, checkBlacklist, transkripMahasiswaRoutes);
app.use("/rekap-jumlah-mahasiswa", checkToken, checkBlacklist, rekapJumlahMahasiswaRoutes);
app.use("/rekap-khs-mahasiswa", checkToken, checkBlacklist, rekapKHSMahasiswaRoutes);
app.use("/rekap-krs-mahasiswa", checkToken, checkBlacklist, rekapKRSMahasiswaRoutes);
app.use("/angkatan", checkToken, checkBlacklist, angkatanRoutes);
app.use("/jabatan", checkToken, checkBlacklist, jabatanRoutes);
app.use("/unit-jabatan", checkToken, checkBlacklist, unitJabatanRoutes);
app.use("/sistem-kuliah", checkToken, checkBlacklist, sistemKuliahRoutes);
app.use("/sistem-kuliah-mahasiswa", checkToken, checkBlacklist, sistemKuliahMahasiswaRoutes);
app.use("/tagihan-mahasiswa", checkToken, checkBlacklist, tagihanMahasiswaRoutes);
app.use("/pembayaran-mahasiswa", checkToken, checkBlacklist, pembayaranMahasiswaRoutes);
app.use("/unsur-penilaian", checkToken, checkBlacklist, unsurPenilaianRoutes);
app.use("/bobot-penilaian", checkToken, checkBlacklist, bobotPenilaianRoutes);
app.use("/ruang-perkuliahan", checkToken, checkBlacklist, ruangPerkuliahanRoutes);
app.use("/berita", checkToken, checkBlacklist, beritaRoutes);
app.use("/dosen-wali", checkToken, checkBlacklist, dosenWaliRoutes);
app.use("/dosen-pengajar-kelas-kuliah", checkToken, checkBlacklist, dosenPengajarKelasKuliah);
app.use("/pelimpahan-mata-kuliah", checkToken, checkBlacklist, pelimpahanMataKuliahRoutes);
app.use("/mahasiswa-bimbingan-dosen", checkToken, checkBlacklist, mahasiswaBimbinganDosenRoutes);
app.use("/uji-mahasiswa", checkToken, checkBlacklist, ujiMahasiswaRoutes);
app.use("/pertemuan-perkuliahan", checkToken, checkBlacklist, pertemuanPerkuliahanRoutes);
app.use("/presensi-perkuliahan", checkToken, checkBlacklist, presensiPerkuliahanRoutes);

// route api local not done yet
app.use("/setting/global", settingGlobalRoutes);
app.use("/setting/ws", settingWSRoutes);
app.use("/nilai-perkuliahan", nilaiPerkuliahanRoutes);
app.use("/khs-mahasiswa", khsMahasiswaRoutes);
app.use("/transkrip-nilai", transkripNilaiRoutes);

app.use(errHandler);

// runnning at port 4000 on localhost
app.listen(PORT, () => {
  console.log(`Server berhasil running di port ${PORT}`);
});
