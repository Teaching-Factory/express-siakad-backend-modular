const { BobotPenilaian, Prodi, UnsurPenilaian } = require("../../models");

const getAllBobotPenilaian = async (req, res) => {
  try {
    // Ambil semua data bobot_penilaian dari database
    const bobot_penilaian = await BobotPenilaian.findAll({ include: [{ model: Prodi }, { model: UnsurPenilaian }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Bobot Penilaian Success",
      jumlahData: bobot_penilaian.length,
      data: bobot_penilaian,
    });
  } catch (error) {
    next(error);
  }
};

const getBobotPenilaianById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const BobotPenilaianId = req.params.id;

    // Cari data bobot_penilaian berdasarkan ID di database
    const bobot_penilaian = await BobotPenilaian.findByPk(BobotPenilaianId, {
      include: [{ model: Prodi }, { model: UnsurPenilaian }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!bobot_penilaian) {
      return res.status(404).json({
        message: `<===== Bobot Penilaian With ID ${BobotPenilaianId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Bobot Penilaian By ID ${BobotPenilaianId} Success:`,
      data: bobot_penilaian,
    });
  } catch (error) {
    next(error);
  }
};

const createBobotPenilaian = async (req, res, next) => {
  try {
    const { bobot_penilaian, id_prodi, id_unsur_penilaian } = req.body;
    // Gunakan metode create untuk membuat data bobot_penilaian baru
    const newBobotPenilaian = await BobotPenilaian.create({
      bobot_penilaian,
      id_prodi,
      id_unsur_penilaian,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Bobot Penilaian Success",
      data: newBobotPenilaian,
    });
  } catch (error) {
    next(error);
  }
};

const updateBobotPenilaianById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const bobotPenilaianId = req.params.id;

    // Dapatkan data yang akan diupdate dari body permintaan
    const { bobot_penilaian, id_prodi, id_unsur_penilaian } = req.body;

    // Cari data bobotPenilaian berdasarkan ID di database
    let bobotPenilaian = await BobotPenilaian.findByPk(bobotPenilaianId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!bobotPenilaian) {
      return res.status(404).json({
        message: `<===== Bobot Penilaian With ID ${bobotPenilaianId} Not Found:`,
      });
    }

    // Update data bobotPenilaian
    bobotPenilaian.bobot_penilaian = bobot_penilaian;
    bobotPenilaian.id_prodi = id_prodi;
    bobotPenilaian.id_unsur_penilaian = id_unsur_penilaian;

    // Simpan perubahan ke dalam database
    await bobotPenilaian.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Bobot Penilaian With ID ${bobotPenilaianId} Success:`,
      data: bobotPenilaian,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBobotPenilaianById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const bobotPenilaianId = req.params.id;

    // Cari data bobot_penilaian berdasarkan ID di database
    let bobot_penilaian = await BobotPenilaian.findByPk(bobotPenilaianId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!bobot_penilaian) {
      return res.status(404).json({
        message: `<===== Bobot Penilaian With ID ${bobotPenilaianId} Not Found:`,
      });
    }

    // Hapus data bobot_penilaian dari database
    await bobot_penilaian.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Bobot Penilaian With ID ${bobotPenilaianId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBobotPenilaian,
  getBobotPenilaianById,
  createBobotPenilaian,
  updateBobotPenilaianById,
  deleteBobotPenilaianById,
};
