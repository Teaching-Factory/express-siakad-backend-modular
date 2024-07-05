const { BiodataMahasiswa, Wilayah, JenisTinggal, AlatTransportasi, JenjangPendidikan, Pekerjaan, Penghasilan, KebutuhanKhusus, Mahasiswa, PerguruanTinggi, Semester, Prodi, Agama } = require("../../models");

const getAllBiodataMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data biodata_mahasiswa dari database
    const biodata_mahasiswa = await BiodataMahasiswa.findAll({
      include: [{ model: Wilayah }, { model: JenisTinggal }, { model: AlatTransportasi }, { model: JenjangPendidikan }, { model: Pekerjaan }, { model: Penghasilan }, { model: KebutuhanKhusus }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Biodata Mahasiswa Success",
      jumlahData: biodata_mahasiswa.length,
      data: biodata_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getBiodataMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const BiodataMahasiswaId = req.params.id;

    // Cari data biodata_mahasiswa berdasarkan ID di database
    const biodata_mahasiswa = await BiodataMahasiswa.findByPk(BiodataMahasiswaId, {
      include: [{ model: Wilayah }, { model: JenisTinggal }, { model: AlatTransportasi }, { model: JenjangPendidikan }, { model: Pekerjaan }, { model: Penghasilan }, { model: KebutuhanKhusus }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!biodata_mahasiswa) {
      return res.status(404).json({
        message: `<===== Biodata Mahasiswa With ID ${BiodataMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Biodata Mahasiswa By ID ${BiodataMahasiswaId} Success:`,
      data: biodata_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getBiodataMahasiswaByMahasiswaActive = async (req, res, next) => {
  try {
    const user = req.user;

    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: user.username,
      },
      include: [{ model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });

    if (!mahasiswa) {
      return res.status(404).json({
        message: "Mahasiswa not found",
      });
    }

    const biodata_mahasiswa = await BiodataMahasiswa.findOne({
      where: {
        id_mahasiswa: mahasiswa.id_mahasiswa,
      },
      include: [{ model: Wilayah }, { model: JenisTinggal }, { model: AlatTransportasi }, { model: JenjangPendidikan }, { model: Pekerjaan }, { model: Penghasilan }, { model: KebutuhanKhusus }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!biodata_mahasiswa) {
      return res.status(404).json({
        message: `<===== Biodata Mahasiswa Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Biodata Mahasiswa Success:`,
      dataMahasiswa: mahasiswa,
      dataBiodataMahasiswa: biodata_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const updateBiodataMahasiswaByMahasiswaActive = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const {
    tempat_lahir,
    nik,
    nisn,
    npwp,
    kewarganegaraan,
    jalan,
    dusun,
    rt,
    rw,
    kelurahan,
    kode_pos,
    telepon,
    handphone,
    email,
    penerima_kps,
    nomor_kps,
    nik_ayah,
    nama_ayah,
    tanggal_lahir_ayah,
    nik_ibu,
    nama_ibu_kandung,
    tanggal_lahir_ibu,
    nama_wali,
    tanggal_lahir_wali,
    id_jenis_tinggal,
    id_alat_transportasi,
    id_pendidikan_ayah,
    id_pekerjaan_ayah,
    id_penghasilan_ayah,
    id_pendidikan_ibu,
    id_pekerjaan_ibu,
    id_penghasilan_ibu,
    id_pendidikan_wali,
    id_pekerjaan_wali,
    id_penghasilan_wali,
  } = req.body;

  if (!tempat_lahir) {
    return res.status(400).json({ message: "tempat_lahir is required" });
  }
  if (!kewarganegaraan) {
    return res.status(400).json({ message: "kewarganegaraan is required" });
  }
  if (!kelurahan) {
    return res.status(400).json({ message: "kelurahan is required" });
  }
  if (!penerima_kps) {
    return res.status(400).json({ message: "penerima_kps is required" });
  }
  if (!nama_ibu_kandung) {
    return res.status(400).json({ message: "nama_ibu_kandung is required" });
  }

  try {
    const user = req.user;

    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: user.username,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({
        message: "Mahasiswa not found",
      });
    }

    const biodata_mahasiswa = await BiodataMahasiswa.findByPk(mahasiswa.id_mahasiswa);

    // Jika data tidak ditemukan, kirim respons 404
    if (!biodata_mahasiswa) {
      return res.status(404).json({
        message: `<===== Biodata Mahasiswa Not Found:`,
      });
    }

    // Update data biodata mahasiswa
    biodata_mahasiswa.tempat_lahir = tempat_lahir;
    biodata_mahasiswa.nik = nik;
    biodata_mahasiswa.nisn = nisn;
    biodata_mahasiswa.npwp = npwp;
    biodata_mahasiswa.kewarganegaraan = kewarganegaraan;
    biodata_mahasiswa.jalan = jalan;
    biodata_mahasiswa.dusun = dusun;
    biodata_mahasiswa.rt = rt;
    biodata_mahasiswa.rw = rw;
    biodata_mahasiswa.kelurahan = kelurahan;
    biodata_mahasiswa.kode_pos = kode_pos;
    biodata_mahasiswa.telepon = telepon;
    biodata_mahasiswa.handphone = handphone;
    biodata_mahasiswa.email = email;
    biodata_mahasiswa.penerima_kps = penerima_kps;
    biodata_mahasiswa.nomor_kps = nomor_kps;
    biodata_mahasiswa.nik_ayah = nik_ayah;
    biodata_mahasiswa.nama_ayah = nama_ayah;
    biodata_mahasiswa.tanggal_lahir_ayah = tanggal_lahir_ayah;
    biodata_mahasiswa.nik_ibu = nik_ibu;
    biodata_mahasiswa.nama_ibu_kandung = nama_ibu_kandung;
    biodata_mahasiswa.tanggal_lahir_ibu = tanggal_lahir_ibu;
    biodata_mahasiswa.nama_wali = nama_wali;
    biodata_mahasiswa.tanggal_lahir_wali = tanggal_lahir_wali;
    biodata_mahasiswa.id_jenis_tinggal = id_jenis_tinggal;
    biodata_mahasiswa.id_alat_transportasi = id_alat_transportasi;
    biodata_mahasiswa.id_pendidikan_ayah = id_pendidikan_ayah;
    biodata_mahasiswa.id_pekerjaan_ayah = id_pekerjaan_ayah;
    biodata_mahasiswa.id_penghasilan_ayah = id_penghasilan_ayah;
    biodata_mahasiswa.id_pendidikan_ibu = id_pendidikan_ibu;
    biodata_mahasiswa.id_pekerjaan_ibu = id_pekerjaan_ibu;
    biodata_mahasiswa.id_penghasilan_ibu = id_penghasilan_ibu;
    biodata_mahasiswa.id_pendidikan_wali = id_pendidikan_wali;
    biodata_mahasiswa.id_pekerjaan_wali = id_pekerjaan_wali;
    biodata_mahasiswa.id_penghasilan_wali = id_penghasilan_wali;

    // Simpan perubahan ke dalam database
    await biodata_mahasiswa.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Biodata Mahasiswa Success:`,
      data: biodata_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBiodataMahasiswa,
  getBiodataMahasiswaById,
  getBiodataMahasiswaByMahasiswaActive,
  updateBiodataMahasiswaByMahasiswaActive,
};
