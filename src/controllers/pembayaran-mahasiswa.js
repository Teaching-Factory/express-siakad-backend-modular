const { PembayaranMahasiswa } = require("../../models");
const fs = require("fs"); // untuk menghapus file

const getAllPembayaranMahasiswaByTagihanId = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const tagihanMahasiswaId = req.params.id_tagihan_mahasiswa;

    // Ambil semua data pembayaran_mahasiswa dari database
    const pembayaran_mahasiswa = await PembayaranMahasiswa.findAll({
      where: {
        id_tagihan_mahasiswa: tagihanMahasiswaId,
      },
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Pembayaran Mahasiswa By Id ${tagihanMahasiswaId} Success`,
      jumlahData: pembayaran_mahasiswa.length,
      data: pembayaran_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getPembayaranMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pembayaranMahasiswaId = req.params.id;

    // Cari data pembayaran_mahasiswa berdasarkan ID di database
    const pembayaran_mahasiswa = await PembayaranMahasiswa.findByPk(pembayaranMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!pembayaran_mahasiswa) {
      return res.status(404).json({
        message: `<===== Pembayaran Mahasiswa With ID ${pembayaranMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Pembayaran Mahasiswa By ID ${pembayaranMahasiswaId} Success:`,
      data: pembayaran_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const createPembayaranMahasiswaByTagihanId = async (req, res, next) => {
  try {
    const tagihanMahasiswaId = req.params.id_tagihan_mahasiswa;

    // Pastikan 'upload_bukti_tf' adalah nama field yang akan digunakan untuk mengirim file
    let upload_bukti_tf = null;

    if (req.file) {
      upload_bukti_tf = req.file.path; // Path file yang di-upload
    }

    // Gunakan metode create untuk membuat data pembayaran_mahasiswa baru
    const newPembayaranMahasiswa = await PembayaranMahasiswa.create({
      upload_bukti_tf,
      status_pembayaran: "Menunggu Konfirmasi",
      id_tagihan_mahasiswa: tagihanMahasiswaId,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Pembayaran Mahasiswa Success",
      data: newPembayaranMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const updatePembayaranMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pembayaranMahasiswaId = req.params.id;

    // Ambil data untuk update dari body permintaan
    const { status_pembayaran } = req.body;

    // Temukan pembayaran_mahasiswa yang akan diperbarui berdasarkan ID
    const pembayaran_mahasiswa = await PembayaranMahasiswa.findByPk(pembayaranMahasiswaId);

    if (!pembayaran_mahasiswa) {
      return res.status(404).json({ message: "Pembayaran Mahasiswa tidak ditemukan" });
    }

    // Update data pembayaran_mahasiswa
    pembayaran_mahasiswa.status_pembayaran = status_pembayaran || pembayaran_mahasiswa.status_pembayaran;

    await pembayaran_mahasiswa.save();

    res.json({
      message: "UPDATE Pembayaran Mahasiswa Success",
      dataPembayaranMahasiswa: pembayaran_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const deletePembayaranMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pembayaranMahasiswaId = req.params.id;

    // Cari data pembayaran_mahasiswa berdasarkan ID di database
    let pembayaran_mahasiswa = await PembayaranMahasiswa.findByPk(pembayaranMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!pembayaran_mahasiswa) {
      return res.status(404).json({
        message: `<===== Pembayaran Mahasiswa With ID ${pembayaranMahasiswaId} Not Found:`,
      });
    }

    // Hapus foto yang telah disimpan
    if (pembayaran_mahasiswa.upload_bukti_tf) {
      fs.unlinkSync(pembayaran_mahasiswa.upload_bukti_tf); // Hapus foto dari sistem file
    }

    // Hapus data pembayaran_mahasiswa dari database
    await pembayaran_mahasiswa.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Pembayaran Mahasiswa With ID ${pembayaranMahasiswaId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPembayaranMahasiswaByTagihanId,
  getPembayaranMahasiswaById,
  createPembayaranMahasiswaByTagihanId,
  updatePembayaranMahasiswaById,
  deletePembayaranMahasiswaById,
};
