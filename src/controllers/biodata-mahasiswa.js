const { BiodataMahasiswa, Wilayah, JenisTinggal, AlatTransportasi, JenjangPendidikan, Pekerjaan, Penghasilan, KebutuhanKhusus, Mahasiswa, PerguruanTinggi, Periode, Prodi, Agama } = require("../../models");

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
      include: [{ model: PerguruanTinggi }, { model: Agama }, { model: Periode, include: [{ model: Prodi }] }],
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

// const updateBiodataMahasiswaByMahasiswaActive = async (req, res, next) => {
//   // Dapatkan data yang akan diupdate dari body permintaan
//   const { tempat_lahir, nik, nisn, npwp, kewarganegaraan, jalan, dusun, rt, rw, kelurahan, kode_pos, telepon, handphone, email, penerima_kps, nomor_kps, nik_ayah, nama_ayah, tanggal_lahir_ayah, nik_ibu, nama_ibu_kandung, tanggal_lahir_ibu, nama_wali,  } = req.body;

//   if (!nama_jabatan) {
//     return res.status(400).json({ message: "nama_jabatan is required" });
//   }

//   try {
//     const user = req.user;

//     const mahasiswa = await Mahasiswa.findOne({
//       where: {
//         nim: user.username,
//       },
//     });

//     if (!mahasiswa) {
//       return res.status(404).json({
//         message: "Mahasiswa not found",
//       });
//     }

//     const biodata_mahasiswa = await BiodataMahasiswa.findByPk(mahasiswa.id_mahasiswa);

//     // Jika data tidak ditemukan, kirim respons 404
//     if (!biodata_mahasiswa) {
//       return res.status(404).json({
//         message: `<===== Biodata Mahasiswa Not Found:`,
//       });
//     }

//     // Update data biodata mahasiswa
//     biodata_mahasiswa.nama_jabatan = nama_jabatan;

//     // Simpan perubahan ke dalam database
//     await biodata_mahasiswa.save();

//     // Kirim respons JSON jika berhasil
//     res.status(200).json({
//       message: `<===== UPDATE Biodata Mahasiswa Success:`,
//       data: biodata_mahasiswa,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  getAllBiodataMahasiswa,
  getBiodataMahasiswaById,
  getBiodataMahasiswaByMahasiswaActive,
  // updateBiodataMahasiswaByMahasiswaActive,
};
