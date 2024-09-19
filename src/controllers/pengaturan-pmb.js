const { PengaturanPMB } = require("../../models");

const getAllPengaturanPMB = async (req, res, next) => {
  try {
    // Ambil semua data pengaturan_pmbs dari database
    const pengaturan_pmbs = await PengaturanPMB.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Pengaturan PMB Success",
      jumlahData: pengaturan_pmbs.length,
      data: pengaturan_pmbs
    });
  } catch (error) {
    next(error);
  }
};

const getPengaturanPMBId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const pengaturanPMBId = req.params.id;

    if (!pengaturanPMBId) {
      return res.status(400).json({
        message: "Pengaturan PMB ID is required"
      });
    }

    // Cari data pengaturan_pmb berdasarkan ID di database
    const pengaturan_pmb = await PengaturanPMB.findByPk(pengaturanPMBId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!pengaturan_pmb) {
      return res.status(404).json({
        message: `<===== Pengaturan PMB With ID ${pengaturanPMBId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Pengaturan PMB By ID ${pengaturanPMBId} Success:`,
      data: pengaturan_pmb
    });
  } catch (error) {
    next(error);
  }
};

const getPengaturanPMBActive = async (req, res, next) => {
  try {
    // Ambil semua data pengaturan_pmb_active dari database
    const pengaturan_pmb_active = await PengaturanPMB.findOne({
      where: {
        status: true
      }
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET Pengaturan PMB Active Success",
      data: pengaturan_pmb_active
    });
  } catch (error) {
    next(error);
  }
};

const createPengaturanPMB = async (req, res, next) => {
  const { upload_bukti_transfer, nama_bank, nomor_rekening, nama_pemilik_rekening, status } = req.body;

  if (!upload_bukti_transfer) {
    return res.status(400).json({ message: "upload_bukti_transfer is required" });
  }
  if (!nama_bank) {
    return res.status(400).json({ message: "nama_bank is required" });
  }
  if (!nomor_rekening) {
    return res.status(400).json({ message: "nomor_rekening is required" });
  }
  if (!nama_pemilik_rekening) {
    return res.status(400).json({ message: "nama_pemilik_rekening is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  try {
    // Gunakan metode create untuk membuat data pengaturan pmb baru
    const newPengaturanPMB = await PengaturanPMB.create({ upload_bukti_transfer, nama_bank, nomor_rekening, nama_pemilik_rekening, status });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Pengaturan PMB Success",
      data: newPengaturanPMB
    });
  } catch (error) {
    next(error);
  }
};

const updatePengaturanPMBActive = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { upload_bukti_transfer, nama_bank, nomor_rekening, nama_pemilik_rekening } = req.body;

  if (!upload_bukti_transfer) {
    return res.status(400).json({ message: "upload_bukti_transfer is required" });
  }
  if (!nama_bank) {
    return res.status(400).json({ message: "nama_bank is required" });
  }
  if (!nomor_rekening) {
    return res.status(400).json({ message: "nomor_rekening is required" });
  }
  if (!nama_pemilik_rekening) {
    return res.status(400).json({ message: "nama_pemilik_rekening is required" });
  }
  try {
    // Cari data pengaturan pmb active=
    let pengaturan_pmb = await PengaturanPMB.findOne({
      where: {
        status: true
      }
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!pengaturan_pmb) {
      return res.status(404).json({
        message: `<===== Pengaturan PMB Active Not Found:`
      });
    }

    // Update data pengaturan_pmb
    pengaturan_pmb.upload_bukti_transfer = upload_bukti_transfer;
    pengaturan_pmb.nama_bank = nama_bank;
    pengaturan_pmb.nomor_rekening = nomor_rekening;
    pengaturan_pmb.nama_pemilik_rekening = nama_pemilik_rekening;

    // Simpan perubahan ke dalam database
    await pengaturan_pmb.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Pengaturan PMB Active Success:`,
      data: pengaturan_pmb
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPengaturanPMB,
  getPengaturanPMBId,
  getPengaturanPMBActive,
  createPengaturanPMB,
  updatePengaturanPMBActive
};
