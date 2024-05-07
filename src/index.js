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

// route api local not done yet
const periodeRoutes = require("./routes/periode");
const wilayahRoutes = require("./routes/wilayah");
const angkatanRoutes = require("./routes/angkatan");
const fakultasRoutes = require("./routes/fakultas");
const prodiRoutes = require("./routes/prodi");
const jabatanRoutes = require("./routes/jabatan");
const unitJabatanRoutes = require("./routes/unit-jabatan");
const ruangPerkuliahanRoutes = require("./routes/ruang-perkuliahan");
const settingGlobalRoutes = require("./routes/setting-global");
const settingWSRoutes = require("./routes/setting-ws");
const identitasPTRoutes = require("./routes/identitas-pt");
const kelasDanJadwalRoutes = require("./routes/kelas-dan-jadwal");
const dosenRoutes = require("./routes/dosen");
const dosenWaliRoutes = require("./routes/dosen-wali");
const mahasiswaRoutes = require("./routes/mahasiswa");
const sistemKuliahRoutes = require("./routes/sistem-kuliah");
const sistemKuliahMahasiswaRoutes = require("./routes/sistem-kuliah-mahasiswa");
const krsValidasiRoutes = require("./routes/krs-validasi");
const krsMahasiswaRoutes = require("./routes/krs-mahasiswa");
const matkulKrsRoutes = require("./routes/matkul-krs");
const unsurPenilaianRoutes = require("./routes/unsur-penilaian");
const bobotPenilaianRoutes = require("./routes/bobot-penilaian");
const kurikulumRoutes = require("./routes/kurikulum");
const mataKuliahRoutes = require("./routes/mata-kuliah");
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

// route api local not done yet
app.use("/periode", periodeRoutes);
app.use("/angkatan", angkatanRoutes);
app.use("/fakultas", fakultasRoutes);
app.use("/prodi", prodiRoutes);
app.use("/jabatan", jabatanRoutes);
app.use("/unit-jabatan", unitJabatanRoutes);
app.use("/ruang-perkuliahan", ruangPerkuliahanRoutes);
app.use("/setting/global", settingGlobalRoutes);
app.use("/setting/ws", settingWSRoutes);
app.use("/setting/identitas-pt", identitasPTRoutes);
app.use("/kelas-dan-jadwal", kelasDanJadwalRoutes);
app.use("/dosen", dosenRoutes);
app.use("/dosen-wali", dosenWaliRoutes);
app.use("/mahasiswa", mahasiswaRoutes);
app.use("/sistem-kuliah", sistemKuliahRoutes);
app.use("/sistem-kuliah-mahasiswa", sistemKuliahMahasiswaRoutes);
app.use("/krs/validasi", krsValidasiRoutes);
app.use("/krs/mahasiswa", krsMahasiswaRoutes);
app.use("/krs/matkul-krs", matkulKrsRoutes);
app.use("/unsur-penilaian", unsurPenilaianRoutes);
app.use("/bobot-penilaian", bobotPenilaianRoutes);
app.use("/kurikulum", kurikulumRoutes);
app.use("/mata-kuliah", mataKuliahRoutes);
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
