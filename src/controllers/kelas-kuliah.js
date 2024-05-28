const { where } = require("sequelize");
const { KelasKuliah, MataKuliah, DetailKelasKuliah } = require("../../models");

const getAllKelasKuliah = async (req, res) => {
  try {
    // Ambil semua data kelas_kuliah dari database
    const kelas_kuliah = await KelasKuliah.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kelas Kuliah Success",
      jumlahData: kelas_kuliah.length,
      data: kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getKelasKuliahById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const KelasKuliahId = req.params.id;

    // Cari data kelas_kuliah berdasarkan ID di database
    const kelas_kuliah = await KelasKuliah.findByPk(KelasKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Kelas Kuliah With ID ${KelasKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Kelas Kuliah By ID ${KelasKuliahId} Success:`,
      data: kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const GetAllKelasKuliahByProdiAndSemesterId = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;

    // Ambil semua data kelas_kuliah dari database
    const kelas_kuliah = await KelasKuliah.findAll({
      where: {
        id_prodi: prodiId,
        id_semester: semesterId,
      },
    });

    // Ambil semua data mata_kuliah dari database
    const mata_kuliah = await MataKuliah.findAll({
      where: {
        id_prodi: prodiId,
      },
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Kelas Kuliah By Prodi and Semester Id Success",
      jumlahDataKelasKuliah: kelas_kuliah.length,
      jumlahDataMataKuliah: mata_kuliah.length,
      dataKelasKuliah: kelas_kuliah,
      dataMataKuliah: mata_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const createKelasKuliah = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;
    const matkulId = req.params.id_matkul;

    // Dapatkan data yang akan diupdate dari body permintaan
    const { nama_kelas_kuliah, kapasitas_peserta_kelas, hari, id_ruang_perkuliahan, id_dosen, jam_mulai, jam_selesai, lingkup, mode_kuliah, tanggal_mulai_efektif, tanggal_akhir_efektif } = req.body;

    // get data matakuliah
    let mata_kuliah = await MataKuliah.findByPk(matkulId);

    // create data kelas kuliah
    let kelas_kuliah = await KelasKuliah.create({
      nama_kelas_kuliah: nama_kelas_kuliah,
      sks: mata_kuliah.sks_mata_kuliah,
      jumlah_mahasiswa: kapasitas_peserta_kelas,
      apa_untuk_pditt: 0,
      lingkup: lingkup,
      mode: mode_kuliah,
      id_prodi: prodiId,
      id_semester: semesterId,
      id_matkul: matkulId,
      id_dosen: id_dosen,
    });

    // create data detail kelas kuliah
    let detail_kelas_kuliah = DetailKelasKuliah.create({
      bahasan: null,
      tanggal_mulai_efektif: tanggal_mulai_efektif,
      tanggal_akhir_efektif: tanggal_akhir_efektif,
      kapasitas: kapasitas_peserta_kelas,
      tanggal_tutup_daftar: null,
      prodi_penyelenggara: null,
      perguruan_tinggi_penyelenggara: null,
      hari: hari,
      jam_mulai: jam_mulai,
      jam_selesai: jam_selesai,
      id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah,
      id_ruang_perkuliahan: id_ruang_perkuliahan,
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== CREATE Kelas Kuliah Success",
      dataKelasKuliah: kelas_kuliah,
      dataDetailKelasKuliah: detail_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const updateKelasKuliahById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    // Dapatkan data yang akan diupdate dari body permintaan
    const { nama_kelas_kuliah, kapasitas_peserta_kelas, hari, id_ruang_perkuliahan, id_dosen, jam_mulai, jam_selesai, lingkup, mode_kuliah, tanggal_mulai_efektif, tanggal_akhir_efektif } = req.body;

    // Cari data kelas kuliah berdasarkan ID di database
    let dataKelasKuliah = await KelasKuliah.findByPk(kelasKuliahId);

    // Update data kelas kuliah
    dataKelasKuliah.nama_kelas_kuliah = nama_kelas_kuliah;
    dataKelasKuliah.jumlah_mahasiswa = kapasitas_peserta_kelas;
    dataKelasKuliah.lingkup = lingkup;
    dataKelasKuliah.mode = mode_kuliah;
    dataKelasKuliah.id_dosen = id_dosen;

    // Simpan perubahan ke dalam database
    await dataKelasKuliah.save();

    // cari data detail kelas kuliah
    let dataDetailKelasKuliah = await DetailKelasKuliah.findOne({
      where: {
        id_kelas_kuliah: dataKelasKuliah.id_kelas_kuliah,
      },
    });

    // update data detail kelas kuliah
    dataDetailKelasKuliah.tanggal_mulai_efektif = tanggal_mulai_efektif;
    dataDetailKelasKuliah.tanggal_akhir_efektif = tanggal_akhir_efektif;
    dataDetailKelasKuliah.kapasitas = kapasitas_peserta_kelas;
    dataDetailKelasKuliah.hari = hari;
    dataDetailKelasKuliah.jam_mulai = jam_mulai;
    dataDetailKelasKuliah.jam_selesai = jam_selesai;
    dataDetailKelasKuliah.id_ruang_perkuliahan = id_ruang_perkuliahan;

    // Simpan perubahan ke dalam database
    await dataDetailKelasKuliah.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== UPDATE Kelas Kuliah Success",
      dataKelasKuliah: dataKelasKuliah,
      dataDetailKelasKuliah: dataDetailKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

const deleteKelasKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    // Cari data kelas_kuliah berdasarkan ID di database
    let kelas_kuliah = await KelasKuliah.findByPk(kelasKuliahId);

    // cari data detail kelas kuliah
    let detail_kelas_kuliah = await DetailKelasKuliah.findOne({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Kelas Kuliah With ID ${kelasKuliahId} Not Found:`,
      });
    }

    // Hapus data detail_kelas_kuliah dan kelas_kuliah dari database
    await detail_kelas_kuliah.destroy();
    await kelas_kuliah.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Kelas Kuliah With ID ${kelasKuliahId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKelasKuliah,
  getKelasKuliahById,
  GetAllKelasKuliahByProdiAndSemesterId,
  createKelasKuliah,
  updateKelasKuliahById,
  deleteKelasKuliahById,
};
