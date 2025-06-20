const express = require("express");

const router = express.Router();

// import middleware
const checkRole = require("../../middlewares/check-role");

// import controllers
const AgamaController = require("./data-feeder/agama");
const NegaraController = require("./data-feeder/negara");
const WilayahController = require("./data-feeder/wilayah");
const PerguruanTinggiController = require("./data-feeder/perguruan-tinggi");
const ProfilPTController = require("./data-feeder/profil-pt");
const JalurMasukController = require("./data-feeder/jalur-masuk");
const JenisPendaftaranController = require("./data-feeder/jenis-pendaftaran");
const JenisTinggalController = require("./data-feeder/jenis-tinggal");
const AlatTransportasiController = require("./data-feeder/alat-transportasi");
const StatusMahasiswaController = require("./data-feeder/status-mahasiswa");
const KebutuhanKhususController = require("./data-feeder/kebutuhan-khusus");
const PenghasilanController = require("./data-feeder/penghasilan");
const JenisSMSController = require("./data-feeder/jenis-sms");
const LembagaPengangkatanController = require("./data-feeder/lembaga-pengangkatan");
const StatusKeaktifanPegawaiController = require("./data-feeder/status-keaktifan-pegawai");
const PangkatGolonganController = require("./data-feeder/pangkat-golongan");
const PekerjaanController = require("./data-feeder/pekerjaan");
const DosenController = require("./data-feeder/dosen");
const BiodataDosenController = require("./data-feeder/biodata-dosen");
const JenjangPendidikanController = require("./data-feeder/jenjang-pendidikan");
const ProdiController = require("./data-feeder/prodi");
const PeriodeController = require("./data-feeder/periode");
const JenisSubstansiController = require("./data-feeder/jenis-substansi");
const SubstansiController = require("./data-feeder/substansi");
const SubstansiKuliahController = require("./data-feeder/substansi-kuliah");
const MataKuliahController = require("./data-feeder/mata-kuliah");
const TahunAjaranController = require("./data-feeder/tahun-ajaran");
const FakultasController = require("./data-feeder/fakultas");
const SemesterController = require("./data-feeder/semester");
const KurikulumController = require("./data-feeder/kurikulum");
const DetailKurikulumController = require("./data-feeder/detail-kurikulum");
const PenugasanDosenController = require("./data-feeder/penugasan-dosen");
const MatkulKurikulumController = require("./data-feeder/matkul-kurikulum");
const KelasKuliahController = require("./data-feeder/kelas-kuliah");
const DetailKelasKuliahController = require("./data-feeder/detail-kelas-kuliah");
const PerhitunganSKSController = require("./data-feeder/perhitungan-sks");
const JenisKeluarController = require("./data-feeder/jenis-keluar");
const PembiayaanController = require("./data-feeder/pembiayaan");
const BidangMinatController = require("./data-feeder/bidang-minat");
const SkalaNilaiProdiController = require("./data-feeder/skala-nilai-prodi");
const PeriodePerkuliahanController = require("./data-feeder/periode-perkuliahan");
const DetailPeriodePerkuliahanController = require("./data-feeder/detail-periode-perkuliahan");
const JenisAktivitasMahasiswaController = require("./data-feeder/jenis-aktivitas-mahasiswa");
const AktivitasMahasiswaController = require("./data-feeder/aktivitas-mahasiswa");
const BiodataMahasiswaController = require("./data-feeder/biodata-mahasiswa");
const MahasiswaController = require("./data-feeder/mahasiswa");
const RiwayatPendidikanMahasiswaController = require("./data-feeder/riwayat-pendidikan-mahasiswa");
const DetailNilaiPerkuliahanKelasController = require("./data-feeder/detail-nilai-perkuliahan-kelas");
const RiwayatNilaiMahasiswaController = require("./data-feeder/riwayat-nilai-mahasiswa");
const PesertaKelasKuliahController = require("./data-feeder/peserta-kelas-kuliah");
const PerkuliahanMahasiswaController = require("./data-feeder/perkuliahan-mahasiswa");
const DetailPerkuliahanMahasiswaController = require("./data-feeder/detail-perkuliahan-mahasiswa");
const KRSMahasiswaController = require("./data-feeder/krs-mahasiswa");
const AktivitasKuliahMahasiswaController = require("./data-feeder/aktivitas-kuliah-mahasiswa");
const AnggotaAktivitasMahasiswaController = require("./data-feeder/anggota-aktivitas-mahasiswa");
const KonversiKampusMerdekaController = require("./data-feeder/konversi-kampus-merdeka");
const TranskripMahasiswaController = require("./data-feeder/transkrip-mahasiswa");
const RekapJumlahMahasiswaController = require("./data-feeder/rekap-jumlah-mahasiswa");
const RekapKHSMahasiswaController = require("./data-feeder/rekap-khs-mahasiswa");
const RekapKRSMahasiswaController = require("./data-feeder/rekap-krs-mahasiswa");
const DataLengkapMahasiswaProdiController = require("./data-feeder/data-lengkap-mahasiswa-prodi");
const JenisEvaluasiControllerController = require("./data-feeder/jenis-evaluasi");
const DosenPengajarKelasKuliahController = require("./data-feeder/dosen-pengajar-kelas-kuliah");
const KategoriKegiatanController = require("./data-feeder/kategori-kegiatan");
const MahasiswaBimbinganDosenController = require("./data-feeder/mahasiswa-bimbingan-dosen");
const UjiMahasiswaController = require("./data-feeder/uji-mahasiswa");
const RencanaEvaluasiController = require("./data-feeder/rencana-evaluasi");
const KomponenEvaluasiKelasController = require("./data-feeder/komponen-evaluasi-kelas");
const MahasiswaLulusDOController = require("./data-feeder/mahasiswa-lulus-do");

// all routes
router.get("/get-agama", checkRole(["admin"]), AgamaController.getAgama);
router.get("/get-negara", checkRole(["admin"]), NegaraController.getNegara);
router.get("/get-wilayah", checkRole(["admin"]), WilayahController.getWilayah);
router.get("/get-all-pt", checkRole(["admin"]), PerguruanTinggiController.getAllPerguruanTinggi);
router.get("/get-profil-pt", checkRole(["admin"]), ProfilPTController.getProfilPT);
router.get("/get-jalur-masuk", checkRole(["admin"]), JalurMasukController.getJalurMasuk);
router.get("/get-jenis-pendaftaran", checkRole(["admin"]), JenisPendaftaranController.getJenisPendaftaran);
router.get("/get-jenis-tinggal", checkRole(["admin"]), JenisTinggalController.getJenisTinggal);
router.get("/get-alat-transportasi", checkRole(["admin"]), AlatTransportasiController.getAlatTransportasi);
router.get("/get-status-mahasiswa", checkRole(["admin"]), StatusMahasiswaController.getStatusMahasiswa);
router.get("/get-kebutuhan-khusus", checkRole(["admin"]), KebutuhanKhususController.getKebutuhanKhusus);
router.get("/get-penghasilan", checkRole(["admin"]), PenghasilanController.getPenghasilan);
router.get("/get-jenis-sms", checkRole(["admin"]), JenisSMSController.getJenisSms);
router.get("/get-lembaga-pengangkatan", checkRole(["admin"]), LembagaPengangkatanController.getLembagaPengangkatan);
router.get("/get-status-keaktifan-pegawai", checkRole(["admin"]), StatusKeaktifanPegawaiController.getStatusKeaktifanPegawai);
router.get("/get-pangkat-golongan", checkRole(["admin"]), PangkatGolonganController.getPangkatGolongan);
router.get("/get-pekerjaan", checkRole(["admin"]), PekerjaanController.getPekerjaan);
router.get("/get-dosen", checkRole(["admin"]), DosenController.getDosen);
router.get("/get-biodata-dosen", checkRole(["admin"]), BiodataDosenController.getBiodataDosen);
router.get("/get-jenjang-pendidikan", checkRole(["admin"]), JenjangPendidikanController.getJenjangPendidikan);
router.get("/get-prodi", checkRole(["admin"]), ProdiController.getProdi);
router.get("/get-periode", checkRole(["admin"]), PeriodeController.getPeriode);
router.get("/get-jenis-substansi", checkRole(["admin"]), JenisSubstansiController.getJenisSubstansi);
router.get("/get-substansi", checkRole(["admin"]), SubstansiController.getSubstansi);
router.get("/get-substansi-kuliah", checkRole(["admin"]), SubstansiKuliahController.getSubstansiKuliah);
router.get("/get-mata-kuliah", checkRole(["admin"]), MataKuliahController.getMataKuliah);
router.get("/get-tahun-ajaran", checkRole(["admin"]), TahunAjaranController.getTahunAjaran);
router.get("/get-fakultas", checkRole(["admin"]), FakultasController.getFakultas);
router.get("/get-semester", checkRole(["admin"]), SemesterController.getSemester);
router.get("/get-kurikulum", checkRole(["admin"]), KurikulumController.getKurikulum);
router.get("/get-detail-kurikulum", checkRole(["admin"]), DetailKurikulumController.getDetailKurikulum);
router.get("/get-penugasan-dosen", checkRole(["admin"]), PenugasanDosenController.getPenugasanDosen);
router.get("/get-matkul-kurikulum", checkRole(["admin"]), MatkulKurikulumController.getMatkulKurikulum);
router.get("/get-kelas-kuliah", checkRole(["admin"]), KelasKuliahController.getKelasKuliah);
router.get("/get-detail-kelas-kuliah", checkRole(["admin"]), DetailKelasKuliahController.getDetailKelasKuliah);
router.get("/get-perhitungan-sks", checkRole(["admin"]), PerhitunganSKSController.getPerhitunganSKS);
router.get("/get-jenis-keluar", checkRole(["admin"]), JenisKeluarController.getJenisKeluar);
router.get("/get-pembiayaan", checkRole(["admin"]), PembiayaanController.getPembiayaan);
router.get("/get-bidang-minat", checkRole(["admin"]), BidangMinatController.getBidangMinat);
router.get("/get-skala-nilai-prodi", checkRole(["admin"]), SkalaNilaiProdiController.getSkalaNilaiProdi);
router.get("/get-periode-perkuliahan", checkRole(["admin"]), PeriodePerkuliahanController.getPeriodePerkuliahan);
router.get("/get-detail-periode-perkuliahan", checkRole(["admin"]), DetailPeriodePerkuliahanController.getDetailPeriodePerkuliahan);
router.get("/get-jenis-aktivitas-mahasiswa", checkRole(["admin"]), JenisAktivitasMahasiswaController.getJenisAktivitasMahasiswa);
router.get("/get-aktivitas-mahasiswa", checkRole(["admin"]), AktivitasMahasiswaController.getAktivitasMahasiswa);
router.get("/get-biodata-mahasiswa", checkRole(["admin"]), BiodataMahasiswaController.getBiodataMahasiswa);
router.get("/get-mahasiswa", checkRole(["admin"]), MahasiswaController.getMahasiswa);
router.get("/get-riwayat-pendidikan-mahasiswa", checkRole(["admin"]), RiwayatPendidikanMahasiswaController.getRiwayatPendidikanMahasiswa);
router.get("/get-detail-nilai-perkuliahan-kelas", checkRole(["admin"]), DetailNilaiPerkuliahanKelasController.getDetailNilaiPerkuliahanKelas);
router.get("/get-riwayat-nilai-mahasiswa", checkRole(["admin"]), RiwayatNilaiMahasiswaController.getRiwayatNilaiMahasiswa);
router.get("/get-peserta-kelas-kuliah", checkRole(["admin"]), PesertaKelasKuliahController.getPesertaKelasKuliah);
router.get("/get-perkuliahan-mahasiswa", checkRole(["admin"]), PerkuliahanMahasiswaController.getPerkuliahanMahasiswa);
router.get("/get-detail-perkuliahan-mahasiswa", checkRole(["admin"]), DetailPerkuliahanMahasiswaController.getDetailPerkuliahanMahasiswa);
router.get("/get-krs-mahasiswa", checkRole(["admin"]), KRSMahasiswaController.getKRSMahasiswa);
router.get("/get-aktivitas-kuliah-mahasiswa", checkRole(["admin"]), AktivitasKuliahMahasiswaController.getAktivitasKuliahMahasiswa);
router.get("/get-anggota-aktivitas-mahasiswa", checkRole(["admin"]), AnggotaAktivitasMahasiswaController.getAnggotaAktivitasMahasiswa);
router.get("/get-konversi-kampus-merdeka", checkRole(["admin"]), KonversiKampusMerdekaController.getKonversiKampusMerdeka);
router.get("/get-transkrip-mahasiswa", checkRole(["admin"]), TranskripMahasiswaController.getTranskripMahasiswa);
router.get("/get-rekap-jumlah-mahasiswa", checkRole(["admin"]), RekapJumlahMahasiswaController.getRekapJumlahMahasiswa);
router.get("/get-rekap-khs-mahasiswa", checkRole(["admin"]), RekapKHSMahasiswaController.getRekapKHSMahasiswa);
router.get("/get-rekap-krs-mahasiswa", checkRole(["admin"]), RekapKRSMahasiswaController.getRekapKRSMahasiswa);
router.get("/get-data-lengkap-mahasiswa-prodi", checkRole(["admin"]), DataLengkapMahasiswaProdiController.getDataLengkapMahasiswaProdi);
router.get("/get-jenis-evaluasi", checkRole(["admin"]), JenisEvaluasiControllerController.getJenisEvaluasi);
router.get("/get-dosen-pengajar-kelas-kuliah", checkRole(["admin"]), DosenPengajarKelasKuliahController.getDosenPengajarKelasKuliah);
router.get("/get-kategori-kegiatan", checkRole(["admin"]), KategoriKegiatanController.getKategoriKegiatan);
router.get("/get-mahasiswa-bimbingan-dosen", checkRole(["admin"]), MahasiswaBimbinganDosenController.getMahasiswaBimbinganDosen);
router.get("/get-uji-mahasiswa", checkRole(["admin"]), UjiMahasiswaController.getUjiMahasiswa);
router.get("/get-rencana-evaluasi", checkRole(["admin"]), RencanaEvaluasiController.getRencanaEvaluasi);
router.get("/get-komponen-evaluasi-kelas", checkRole(["admin"]), KomponenEvaluasiKelasController.getKomponenEvaluasiKelas);
router.get("/get-mahasiswa-lulus-do", checkRole(["admin"]), MahasiswaLulusDOController.getMahasiswaLulusDO);

module.exports = router;
