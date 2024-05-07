// configuration env
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// define express server
const express = require("express");

// import routes
// route api local done
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const rolePermissionRoutes = require("./routes/role-permission");
const agamaRoutes = require("./routes/agama");
const negaraRoutes = require("./routes/negara");
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

// route api local not done yet
const wilayahRoutes = require("./routes/wilayah");
const angkatanRoutes = require("./routes/angkatan");
const jabatanRoutes = require("./routes/jabatan");
const unitJabatanRoutes = require("./routes/unit-jabatan");
const ruangPerkuliahanRoutes = require("./routes/ruang-perkuliahan");
const settingGlobalRoutes = require("./routes/setting-global");
const settingWSRoutes = require("./routes/setting-ws");
const identitasPTRoutes = require("./routes/identitas-pt");
const kelasDanJadwalRoutes = require("./routes/kelas-dan-jadwal");
const dosenWaliRoutes = require("./routes/dosen-wali");
const sistemKuliahRoutes = require("./routes/sistem-kuliah");
const sistemKuliahMahasiswaRoutes = require("./routes/sistem-kuliah-mahasiswa");
const krsValidasiRoutes = require("./routes/krs-validasi");
const matkulKrsRoutes = require("./routes/matkul-krs");
const unsurPenilaianRoutes = require("./routes/unsur-penilaian");
const bobotPenilaianRoutes = require("./routes/bobot-penilaian");
const aktivitasMahasiswaRoutes = require("./routes/aktivitas-mahasiswa");
const tagihanMahasiswaRoutes = require("./routes/tagihan-mahasiswa");
const pembayaranMahasiswaRoutes = require("./routes/pembayaran-mahasiswa");
const pertemuanPerkuliahanRoutes = require("./routes/pertemuan-perkuliahan");
const presensiPerkuliahanRoutes = require("./routes/presensi-perkuliahan");
const nilaiPerkuliahanRoutes = require("./routes/nilai-perkuliahan");
const khsMahasiswaRoutes = require("./routes/khs-mahasiswa");
const transkripNilaiRoutes = require("./routes/transkrip-nilai");
const apiFeederRoutes = require("./routes/api-feeder");

// import middleware
const middlewareLogRequest = require("./middlewares/logs");
const middlewareDatabaseConnection = require("./middlewares/database");
const errHandler = require("./middlewares/error-handler");

// running express server
const app = express();

// middleware request
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

// route api local done
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/role-permission", rolePermissionRoutes);
app.use("/agama", agamaRoutes);
app.use("/negara", negaraRoutes);
app.use("/wilayah", wilayahRoutes);
app.use("/perguruan-tinggi", perguruanTinggiRoutes);
app.use("/profil-pt", profilPTRoutes);
app.use("/jalur-masuk", jalurMasukRoutes);
app.use("/jenis-pendaftaran", jenisPendaftaranRoutes);
app.use("/jenis-tinggal", jenisTinggalRoutes);
app.use("/alat-transportasi", alatTransportasiRoutes);
app.use("/status-mahasiswa", statusMahasiswaRoutes);
app.use("/kebutuhan-khusus", kebutuhanKhususRoutes);
app.use("/penghasilan", penghasilanRoutes);
app.use("/jenis-sms", jenisSMSRoutes);
app.use("/lembaga-pengangkatan", lembagaPengangkatanRoutes);
app.use("/status-keaktifan-pegawai", statusKeaktifanPegawaiRoutes);
app.use("/pangkat-golongan", pangkatGolonganRoutes);
app.use("/pekerjaan", pekerjaanRoutes);
app.use("/dosen", dosenRoutes);
app.use("/biodata-dosen", biodataDosenRoutes);
app.use("/jenjang-pendidikan", jenjangPendidikanRoutes);
app.use("/prodi", prodiRoutes);
app.use("/periode", periodeRoutes);
app.use("/jenis-substansi", jenisSubstansiRoutes);
app.use("/substansi", substansiRoutes);
app.use("/substansi-kuliah", substansiKuliahRoutes);
app.use("/mata-kuliah", mataKuliahRoutes);
app.use("/tahun-ajaran", tahunAjaranRoutes);
app.use("/fakultas", fakultasRoutes);
app.use("/semester", semesterRoutes);
app.use("/kurikulum", kurikulumRoutes);
app.use("/detail-kurikulum", detailKurikulumRoutes);
app.use("/penugasan-dosen", penugasanDosenRoutes);
app.use("/matkul-kurikulum", matkulKurikulumRoutes);
app.use("/kelas-kuliah", kelasKuliahRoutes);
app.use("/detail-kelas-kuliah", detailKelasKuliahRoutes);
app.use("/perhitungan-sks", perhitunganSKSRoutes);
app.use("/biodata-mahasiswa", biodataMahasiswaRoutes);
app.use("/mahasiswa", mahasiswaRoutes);
app.use("/jenis-keluar", jenisKeluarRoutes);
app.use("/pembiayaan", pembiayaanRoutes);
app.use("/bidang-minat", bidangMinatRoutes);
app.use("/riwayat-pendidikan-mahasiswa", riwayatPendidikanMahasiswaRoutes);
app.use("/detail-nilai-perkuliahan-kelas", detailNilaiPerkuliahanKelasRoutes);
app.use("/skala-nilai-prodi", skalaNilaiProdiRoutes);
app.use("/riwayat-nilai-mahasiswa", riwayatNilaiMahasiswaRoutes);
app.use("/peserta-kelas-kuliah", pesertaKelasKuliahRoutes);
app.use("/perkuliahan-mahasiswa", perkuliahanMahasiswaRoutes);
app.use("/detail-perkuliahan-mahasiswa", detailPerkuliahanMahasiswaRoutes);
app.use("/periode-perkuliahan", periodePerkuliahanRoutes);
app.use("/detail-periode-perkuliahan", detailPeriodePerkuliahanRoutes);
app.use("/krs-mahasiswa", krsMahasiswaRoutes);

// route api local not done yet
app.use("/angkatan", angkatanRoutes);
app.use("/jabatan", jabatanRoutes);
app.use("/unit-jabatan", unitJabatanRoutes);
app.use("/ruang-perkuliahan", ruangPerkuliahanRoutes);
app.use("/setting/global", settingGlobalRoutes);
app.use("/setting/ws", settingWSRoutes);
app.use("/setting/identitas-pt", identitasPTRoutes);
app.use("/kelas-dan-jadwal", kelasDanJadwalRoutes);
app.use("/dosen-wali", dosenWaliRoutes);
app.use("/sistem-kuliah", sistemKuliahRoutes);
app.use("/sistem-kuliah-mahasiswa", sistemKuliahMahasiswaRoutes);
app.use("/krs/validasi", krsValidasiRoutes);
app.use("/krs/matkul-krs", matkulKrsRoutes);
app.use("/unsur-penilaian", unsurPenilaianRoutes);
app.use("/bobot-penilaian", bobotPenilaianRoutes);
app.use("/aktivitas-mahasiswa", aktivitasMahasiswaRoutes);
app.use("/tagihan-mahasiswa", tagihanMahasiswaRoutes);
app.use("/pembayaran-mahasiswa", pembayaranMahasiswaRoutes);
app.use("/pertemuan-perkuliahan", pertemuanPerkuliahanRoutes);
app.use("/presensi-perkuliahan", presensiPerkuliahanRoutes);
app.use("/nilai-perkuliahan", nilaiPerkuliahanRoutes);
app.use("/khs-mahasiswa", khsMahasiswaRoutes);
app.use("/transkrip-nilai", transkripNilaiRoutes);
app.use("/api-feeder", apiFeederRoutes);

app.use(errHandler);

// runnning at port 4000 on localhost
app.listen(PORT, () => {
  console.log(`Server berhasil running di port ${PORT}`);
});
