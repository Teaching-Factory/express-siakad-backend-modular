const { UnitJabatan, Jabatan, Dosen, Prodi } = require("../../../models");

const getAllUnitJabatan = async (req, res, next) => {
  try {
    // Ambil semua data unit_jabatan dari database
    const unit_jabatan = await UnitJabatan.findAll({ include: [{ model: Jabatan }, { model: Dosen }, { model: Prodi }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Unit Jabatan Success",
      jumlahData: unit_jabatan.length,
      data: unit_jabatan,
    });
  } catch (error) {
    next(error);
  }
};

const getUnitJabatanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const unitJabatanId = req.params.id;

    if (!unitJabatanId) {
      return res.status(400).json({
        message: "Unit Jabatan ID is required",
      });
    }

    // Cari data unit_jabatan berdasarkan ID di database
    const unit_jabatan = await UnitJabatan.findByPk(unitJabatanId, {
      include: [{ model: Jabatan }, { model: Dosen }, { model: Prodi }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!unit_jabatan) {
      return res.status(404).json({
        message: `<===== Unit Jabatan With ID ${unitJabatanId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Unit Jabatan By ID ${unitJabatanId} Success:`,
      data: unit_jabatan,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUnitJabatanByProdiId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;

    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    // Cari data unit_jabatan berdasarkan ID di database
    const unit_jabatan = await UnitJabatan.findAll({
      where: {
        id_prodi: prodiId,
      },
      include: [{ model: Jabatan }, { model: Dosen }, { model: Prodi }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!unit_jabatan) {
      return res.status(404).json({
        message: `<===== Unit Jabatan With Prodi ID ${prodiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Unit Jabatan By Prodi ID ${prodiId} Success:`,
      jumlahData: unit_jabatan.length,
      data: unit_jabatan,
    });
  } catch (error) {
    next(error);
  }
};

const createUnitJabatan = async (req, res, next) => {
  const { nama_penandatanganan, id_dosen, id_jabatan, id_prodi } = req.body;

  if (!nama_penandatanganan) {
    return res.status(400).json({ message: "nama_penandatanganan is required" });
  }
  if (!id_dosen) {
    return res.status(400).json({ message: "id_dosen is required" });
  }
  if (!id_jabatan) {
    return res.status(400).json({ message: "id_jabatan is required" });
  }
  if (!id_prodi) {
    return res.status(400).json({ message: "id_prodi is required" });
  }

  try {
    // Gunakan metode create untuk membuat data unit jabatan baru
    const newUnitJabatan = await UnitJabatan.create({ nama_penandatanganan, id_dosen, id_jabatan, id_prodi });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Unit Jabatan Success",
      data: newUnitJabatan,
    });
  } catch (error) {
    next(error);
  }
};

const updateUnitJabatanById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nama_penandatanganan, id_dosen, id_jabatan, id_prodi } = req.body;

  if (!nama_penandatanganan) {
    return res.status(400).json({ message: "nama_penandatanganan is required" });
  }
  if (!id_dosen) {
    return res.status(400).json({ message: "id_dosen is required" });
  }
  if (!id_jabatan) {
    return res.status(400).json({ message: "id_jabatan is required" });
  }
  if (!id_prodi) {
    return res.status(400).json({ message: "id_prodi is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const unitJabatanId = req.params.id;

    if (!unitJabatanId) {
      return res.status(400).json({
        message: "Unit Jabatan ID is required",
      });
    }

    // Cari data unit_jabatan berdasarkan ID di database
    let unit_jabatan = await UnitJabatan.findByPk(unitJabatanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!unit_jabatan) {
      return res.status(404).json({
        message: `<===== Unit Jabatan With ID ${unitJabatanId} Not Found:`,
      });
    }

    // Update data unit_jabatan
    unit_jabatan.nama_penandatanganan = nama_penandatanganan;
    unit_jabatan.id_dosen = id_dosen;
    unit_jabatan.id_jabatan = id_jabatan;
    unit_jabatan.id_prodi = id_prodi;

    // Simpan perubahan ke dalam database
    await unit_jabatan.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Unit Jabatan With ID ${unitJabatanId} Success:`,
      data: unit_jabatan,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUnitJabatanById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const unitJabatanId = req.params.id;

    if (!unitJabatanId) {
      return res.status(400).json({
        message: "Unit Jabatan ID is required",
      });
    }

    // Cari data unit_jabatan berdasarkan ID di database
    let unit_jabatan = await UnitJabatan.findByPk(unitJabatanId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!unit_jabatan) {
      return res.status(404).json({
        message: `<===== Unit Jabatan With ID ${unitJabatanId} Not Found:`,
      });
    }

    // Hapus data unit_jabatan dari database
    await unit_jabatan.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Unit Jabatan With ID ${unitJabatanId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUnitJabatan,
  getUnitJabatanById,
  getAllUnitJabatanByProdiId,
  createUnitJabatan,
  updateUnitJabatanById,
  deleteUnitJabatanById,
};
