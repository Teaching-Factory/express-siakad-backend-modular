// define express server
const express = require("express");

// import middleware
const middlewareLogRequest = require("./middlewares/logs");

// import routes
const authRoutes = require("./routes/auth");
const rolePermissionRoutes = require("./routes/role-permission");
const periodeRoutes = require("./routes/periode");
const userRoutes = require("./routes/user");
const agamaRoutes = require("./routes/agama");
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
const statusMahasiswaRoutes = require("./routes/status-mahasiswa");
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

// running express server
const app = express();

// middleware request
app.use(middlewareLogRequest);

app.use("/auth", authRoutes);
app.use("/role-permission", rolePermissionRoutes);
app.use("/periode", periodeRoutes);
app.use("/user", userRoutes);
app.use("/agama", agamaRoutes);
app.use("/wilayah", wilayahRoutes);
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
app.use("/status-mahasiswa", statusMahasiswaRoutes);
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

// runnning at port 4000 on localhost
app.listen(4000, () => {
  console.log("Server berhasil running di port 4000");
});
