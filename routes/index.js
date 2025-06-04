const express = require("express");
const router = express.Router();

// route api local (modular)
const apiFeederRoutes = require("../src/modules/api-feeder");
const apiFeederUpdateRoutes = require("../src/modules/api-feeder-update");
const userRoutes = require("../src/modules/user");
const authRoutes = require("../src/modules/auth");
const roleRoutes = require("../src/modules/role");
const rolePermissionRoutes = require("../src/modules/role-permission");
const agamaRoutes = require("../src/modules/agama");
const negaraRoutes = require("../src/modules/negara");
const wilayahRoutes = require("../src/modules/wilayah");
const perguruanTinggiRoutes = require("../src/modules/perguruan-tinggi");
const profilPTRoutes = require("../src/modules/profil-pt");
const jalurMasukRoutes = require("../src/modules/jalur-masuk");
const jenisPendaftaranRoutes = require("../src/modules/jenis-pendaftaran");
const jenisTinggalRoutes = require("../src/modules/jenis-tinggal");
const alatTransportasiRoutes = require("../src/modules/alat-transportasi");
const statusMahasiswaRoutes = require("../src/modules/status-mahasiswa");
const mahasiswaLulusDORoutes = require("../src/modules/mahasiswa-lulus-do");
const kebutuhanKhususRoutes = require("../src/modules/kebutuhan-khusus");
const penghasilanRoutes = require("../src/modules/penghasilan");
const jenisSMSRoutes = require("../src/modules/jenis-sms");
const lembagaPengangkatanRoutes = require("../src/modules/lembaga-pengangkatan");
const statusKeaktifanPegawaiRoutes = require("../src/modules/status-keaktifan-pegawai");
const pangkatGolonganRoutes = require("../src/modules/pangkat-golongan");
const pekerjaanRoutes = require("../src/modules/pekerjaan");
const dosenRoutes = require("../src/modules/dosen");
const biodataDosenRoutes = require("../src/modules/biodata-dosen");
const jenjangPendidikanRoutes = require("../src/modules/jenjang-pendidikan");
const prodiRoutes = require("../src/modules/prodi");
const prodiGuestRoutes = require("../src/modules/prodi-guest");
const periodeRoutes = require("../src/modules/periode");
const jenisSubstansiRoutes = require("../src/modules/jenis-substansi");
const substansiRoutes = require("../src/modules/substansi");
const substansiKuliahRoutes = require("../src/modules/substansi-kuliah");
// some new routes will be here ...

// import middleware
const checkToken = require("../src/middlewares/check-token");
const checkModuleStatus = require("../src/middlewares/check-module-status");

// endpoint api local (modular)
router.use("/api-feeder", checkToken, checkModuleStatus("api-feeder"), apiFeederRoutes);
router.use("/api-feeder-update", checkToken, checkModuleStatus("api-feeder-update"), apiFeederUpdateRoutes);
router.use("/user", checkToken, checkModuleStatus("user"), userRoutes);
router.use("/auth", checkModuleStatus("auth"), authRoutes);
router.use("/role", checkToken, checkModuleStatus("role"), roleRoutes);
router.use("/role-permission", checkToken, checkModuleStatus("role-permission"), rolePermissionRoutes);
router.use("/agama", checkToken, checkModuleStatus("agama"), agamaRoutes);
router.use("/negara", checkToken, checkModuleStatus("negara"), negaraRoutes);
router.use("/wilayah", checkToken, checkModuleStatus("wilayah"), wilayahRoutes);
router.use("/perguruan-tinggi", checkToken, checkModuleStatus("perguruan-tinggi"), perguruanTinggiRoutes);
router.use("/profil-pt", checkToken, checkModuleStatus("profil-pt"), profilPTRoutes);
router.use("/jalur-masuk", checkToken, checkModuleStatus("jalur-masuk"), jalurMasukRoutes);
router.use("/jenis-pendaftaran", checkToken, checkModuleStatus("jenis-pendaftaran"), jenisPendaftaranRoutes);
router.use("/jenis-tinggal", checkToken, checkModuleStatus("jenis-tinggal"), jenisTinggalRoutes);
router.use("/alat-transportasi", checkToken, checkModuleStatus("alat-transportasi"), alatTransportasiRoutes);
router.use("/status-mahasiswa", checkToken, checkModuleStatus("status-mahasiswa"), statusMahasiswaRoutes);
router.use("/mahasiswa-lulus-do", checkToken, checkModuleStatus("mahasiswa-lulus-do"), mahasiswaLulusDORoutes);
router.use("/kebutuhan-khusus", checkToken, checkModuleStatus("kebutuhan-khusus"), kebutuhanKhususRoutes);
router.use("/penghasilan", checkToken, checkModuleStatus("penghasilan"), penghasilanRoutes);
router.use("/jenis-sms", checkToken, checkModuleStatus("jenis-sms"), jenisSMSRoutes);
router.use("/lembaga-pengangkatan", checkToken, checkModuleStatus("lembaga-pengangkatan"), lembagaPengangkatanRoutes);
router.use("/status-keaktifan-pegawai", checkToken, checkModuleStatus("status-keaktifan-pegawai"), statusKeaktifanPegawaiRoutes);
router.use("/pangkat-golongan", checkToken, checkModuleStatus("pangkat-golongan"), pangkatGolonganRoutes);
router.use("/pekerjaan", checkToken, checkModuleStatus("pekerjaan"), pekerjaanRoutes);
router.use("/dosen", checkToken, checkModuleStatus("dosen"), dosenRoutes);
router.use("/biodata-dosen", checkToken, checkModuleStatus("biodata-dosen"), biodataDosenRoutes);
router.use("/jenjang-pendidikan", checkToken, checkModuleStatus("jenjang-pendidikan"), jenjangPendidikanRoutes);
router.use("/prodi", checkToken, checkModuleStatus("prodi"), prodiRoutes);
router.use("/prodi-guest", checkModuleStatus("prodi-guest"), prodiGuestRoutes);
router.use("/periode", checkToken, checkModuleStatus("periode"), periodeRoutes);
router.use("/jenis-substansi", checkToken, checkModuleStatus("jenis-substansi"), jenisSubstansiRoutes);
router.use("/substansi", checkToken, checkModuleStatus("substansi"), substansiRoutes);
router.use("/substansi-kuliah", checkToken, checkModuleStatus("substansi-kuliah"), substansiKuliahRoutes);
// some new endpoint will be here ...

module.exports = router;
