const { AspekPenilaianDosen, Semester } = require("../../../models");

const getAllAspekPenilaianDosen = async (req, res, next) => {
  try {
    // Ambil semua data aspek_penilaian_dosens dari database
    const aspek_penilaian_dosens = await AspekPenilaianDosen.findAll({
      include: [{ model: Semester }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Aspek Penilaian Dosen Success",
      jumlahData: aspek_penilaian_dosens.length,
      data: aspek_penilaian_dosens,
    });
  } catch (error) {
    next(error);
  }
};

const getAllAspekPenilaianDosenBySemesterId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // Ambil semua data aspek_penilaian_dosens dari database
    const aspek_penilaian_dosens = await AspekPenilaianDosen.findAll({
      where: {
        id_semester: semesterId,
      },
      include: [{ model: Semester }],
      order: [["nomor_urut_aspek", "ASC"]],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Aspek Penilaian Dosen By Semester ID ${semesterId} Success`,
      jumlahData: aspek_penilaian_dosens.length,
      data: aspek_penilaian_dosens,
    });
  } catch (error) {
    next(error);
  }
};

const getAspekPenilaianDosenById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const aspekPenilaianDosenId = req.params.id;

    if (!aspekPenilaianDosenId) {
      return res.status(400).json({
        message: "Aspek Penilaian Dosen ID is required",
      });
    }

    // Cari data aspek_penilaian_dosen berdasarkan ID di database
    const aspek_penilaian_dosen = await AspekPenilaianDosen.findByPk(aspekPenilaianDosenId, {
      include: [{ model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!aspek_penilaian_dosen) {
      return res.status(404).json({
        message: `<===== Aspek Penilaian Dosen With ID ${aspekPenilaianDosenId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Aspek Penilaian Dosen By ID ${aspekPenilaianDosenId} Success:`,
      data: aspek_penilaian_dosen,
    });
  } catch (error) {
    next(error);
  }
};

const createAspekPenilaianDosen = async (req, res, next) => {
  const { nomor_urut_aspek, aspek_penilaian, tipe_aspek_penilaian, deskripsi_pendek, id_semester } = req.body;

  if (!nomor_urut_aspek) {
    return res.status(400).json({ message: "nomor_urut_aspek is required" });
  }
  if (!aspek_penilaian) {
    return res.status(400).json({ message: "aspek_penilaian is required" });
  }
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }

  try {
    // Gunakan metode create untuk membuat data aspek penilaian dosen baru
    const newAspekPenilaianDosen = await AspekPenilaianDosen.create({
      nomor_urut_aspek: nomor_urut_aspek,
      aspek_penilaian: aspek_penilaian,
      tipe_aspek_penilaian: tipe_aspek_penilaian,
      deskripsi_pendek: deskripsi_pendek,
      tanggal_pembuatan: new Date(),
      id_semester: id_semester,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Aspek Penilaian Dosen Success",
      data: newAspekPenilaianDosen,
    });
  } catch (error) {
    next(error);
  }
};

const updateAspekPenilaianDosenById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nomor_urut_aspek, aspek_penilaian, tipe_aspek_penilaian, deskripsi_pendek, id_semester } = req.body;

  if (!nomor_urut_aspek) {
    return res.status(400).json({ message: "nomor_urut_aspek is required" });
  }
  if (!aspek_penilaian) {
    return res.status(400).json({ message: "aspek_penilaian is required" });
  }
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const aspekPenilaianDosenId = req.params.id;

    if (!aspekPenilaianDosenId) {
      return res.status(400).json({
        message: "Aspek Penilaian Dosen ID is required",
      });
    }

    // Cari data aspek_penilaian_dosen berdasarkan ID di database
    let aspek_penilaian_dosen = await AspekPenilaianDosen.findByPk(aspekPenilaianDosenId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!aspek_penilaian_dosen) {
      return res.status(404).json({
        message: `<===== Aspek Penilaian Dosen With ID ${aspekPenilaianDosenId} Not Found:`,
      });
    }

    // Update data aspek_penilaian_dosen
    aspek_penilaian_dosen.nomor_urut_aspek = nomor_urut_aspek;
    aspek_penilaian_dosen.aspek_penilaian = aspek_penilaian;
    aspek_penilaian_dosen.tipe_aspek_penilaian = tipe_aspek_penilaian;
    aspek_penilaian_dosen.deskripsi_pendek = deskripsi_pendek;
    aspek_penilaian_dosen.id_semester = id_semester;

    // Simpan perubahan ke dalam database
    await aspek_penilaian_dosen.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Aspek Penilaian Dosen With ID ${aspekPenilaianDosenId} Success:`,
      data: aspek_penilaian_dosen,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAspekPenilaianDosenById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const aspekPenilaianDosenId = req.params.id;

    if (!aspekPenilaianDosenId) {
      return res.status(400).json({
        message: "Aspek Penilaian Dosen ID is required",
      });
    }

    // Cari data aspek_penilaian_dosen berdasarkan ID di database
    let aspek_penilaian_dosen = await AspekPenilaianDosen.findByPk(aspekPenilaianDosenId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!aspek_penilaian_dosen) {
      return res.status(404).json({
        message: `<===== Aspek Penilaian Dosen With ID ${aspekPenilaianDosenId} Not Found:`,
      });
    }

    // Hapus data aspek_penilaian_dosen dari database
    await aspek_penilaian_dosen.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Aspek Penilaian Dosen With ID ${aspekPenilaianDosenId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAspekPenilaianDosen,
  getAllAspekPenilaianDosenBySemesterId,
  getAspekPenilaianDosenById,
  createAspekPenilaianDosen,
  updateAspekPenilaianDosenById,
  deleteAspekPenilaianDosenById,
};
