const { DosenPengajarKelasKuliah, PenugasanDosen, Dosen, KelasKuliah, Substansi, JenisEvaluasi, Prodi, Semester, MataKuliah } = require("../../models");

const getAllDosenPengajarKelasKuliahByIdKelasKuliah = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    // Ambil semua data dosen_pengajar_kelas_kuliahs dari database
    const dosen_pengajar_kelas_kuliahs = await DosenPengajarKelasKuliah.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      include: [{ model: PenugasanDosen }, { model: Dosen }, { model: KelasKuliah, include: [{ model: MataKuliah }] }, { model: Substansi }, { model: JenisEvaluasi }, { model: Prodi }, { model: Semester }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Pengajar Kelas Kuliah By Id Kelas Kuliah ${kelasKuliahId} Success`,
      jumlahData: dosen_pengajar_kelas_kuliahs.length,
      data: dosen_pengajar_kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

const getDosenPengajarKelasKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const dosenPengajarKelasKuliahId = req.params.id;

    if (!dosenPengajarKelasKuliahId) {
      return res.status(400).json({
        message: "Dosen Pengajar Kelas Kuliah ID is required",
      });
    }

    // Cari data dosen_pengajar_kelas_kuliah berdasarkan ID di database
    const dosen_pengajar_kelas_kuliah = await DosenPengajarKelasKuliah.findByPk(dosenPengajarKelasKuliahId, {
      include: [{ model: PenugasanDosen }, { model: Dosen }, { model: KelasKuliah, include: [{ model: MataKuliah }] }, { model: Substansi }, { model: JenisEvaluasi }, { model: Prodi }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!dosen_pengajar_kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Dosen Pengajar Kelas Kuliah With ID ${dosenPengajarKelasKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Dosen Pengajar Kelas Kuliah By ID ${dosenPengajarKelasKuliahId} Success:`,
      data: dosen_pengajar_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const createDosenPengajarKelasKuliah = async (req, res, next) => {
  // mendapatkan data dari request body
  const { sks, rencana_pertemuan, id_registrasi_dosen } = req.body;

  if (!sks) {
    return res.status(400).json({ message: "sks is required" });
  }
  if (!rencana_pertemuan) {
    return res.status(400).json({ message: "rencana_pertemuan is required" });
  }
  if (!id_registrasi_dosen) {
    return res.status(400).json({ message: "id_registrasi_dosen is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    // get data penugasan dosen
    const penugasan_dosen = await PenugasanDosen.findOne({
      where: {
        id_registrasi_dosen: id_registrasi_dosen,
      },
    });

    // get data kelas kuliah
    const kelas_kuliah = await KelasKuliah.findByPk(kelasKuliahId);

    // Gunakan metode create untuk membuat data dosen pengajar kelas kuliah baru
    const newDosenPengajarKelasKuliah = await DosenPengajarKelasKuliah.create({
      sks_substansi_total: sks,
      rencana_minggu_pertemuan: rencana_pertemuan,
      realisasi_minggu_pertemuan: rencana_pertemuan,
      id_registrasi_dosen: id_registrasi_dosen,
      id_dosen: penugasan_dosen.id_dosen,
      id_kelas_kuliah: kelasKuliahId,
      id_substansi: null,
      id_jenis_evaluasi: 1,
      id_prodi: penugasan_dosen.id_prodi,
      id_semester: kelas_kuliah.id_semester,
    });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Dosen Pengajar Kelas Kuliah Success",
      data: newDosenPengajarKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

const updateDosenPengajarKelasKuliahById = async (req, res, next) => {
  // mendapatkan data dari request body
  const { sks, rencana_pertemuan, id_registrasi_dosen } = req.body;

  if (!sks) {
    return res.status(400).json({ message: "sks is required" });
  }
  if (!rencana_pertemuan) {
    return res.status(400).json({ message: "rencana_pertemuan is required" });
  }
  if (!id_registrasi_dosen) {
    return res.status(400).json({ message: "id_registrasi_dosen is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const dosenPengajarKelasKuliahId = req.params.id;

    if (!dosenPengajarKelasKuliahId) {
      return res.status(400).json({
        message: "Dosen Pengajar Kelas Kuliah ID is required",
      });
    }

    // get data penugasan dosen
    const penugasan_dosen = await PenugasanDosen.findOne({
      where: {
        id_registrasi_dosen: id_registrasi_dosen,
      },
    });

    // Cari data dosen pengajar kelas kuliah berdasarkan ID di database
    let dosen_pengajar_kelas_kuliah = await DosenPengajarKelasKuliah.findByPk(dosenPengajarKelasKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!dosen_pengajar_kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Dosen Pengajar Kelas Kuliah With ID ${dosenPengajarKelasKuliahId} Not Found:`,
      });
    }

    // Update data dosen pengajar kelas kuliah
    dosen_pengajar_kelas_kuliah.sks_substansi_total = sks;
    dosen_pengajar_kelas_kuliah.rencana_minggu_pertemuan = rencana_pertemuan;
    dosen_pengajar_kelas_kuliah.realisasi_minggu_pertemuan = rencana_pertemuan;
    dosen_pengajar_kelas_kuliah.id_registrasi_dosen = id_registrasi_dosen;
    dosen_pengajar_kelas_kuliah.id_dosen = penugasan_dosen.id_dosen;
    dosen_pengajar_kelas_kuliah.id_prodi = penugasan_dosen.id_prodi;

    // Simpan perubahan ke dalam database
    await dosen_pengajar_kelas_kuliah.save();

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: `<===== UPDATE Dosen Pengajar Kelas Kuliah With ID ${dosenPengajarKelasKuliahId} Success:`,
      data: dosen_pengajar_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const setKetuaDosenPengajarByKelasKuliahId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;
    const dosenPengajarId = req.params.id_aktivitas_mengajar;

    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    if (!dosenPengajarId) {
      return res.status(400).json({
        message: "Dosen Pengajar ID is required",
      });
    }

    // get data kelas kuliah
    let kelas_kuliah = await KelasKuliah.findOne({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
    });

    if (!kelas_kuliah) {
      return res.status(400).json({
        message: "Kelas Kuliah not found",
      });
    }

    // get data dosen pengajar kelas kuliah
    let dosen_pengajar_kelas_kuliah = await DosenPengajarKelasKuliah.findOne({
      where: {
        id_aktivitas_mengajar: dosenPengajarId,
      },
    });

    if (!dosen_pengajar_kelas_kuliah) {
      return res.status(400).json({
        message: "Dosen Pengajar Kelas Kuliah not found",
      });
    }

    // Update data kelas_kuliah
    kelas_kuliah.id_dosen = dosen_pengajar_kelas_kuliah.id_dosen;

    // Simpan perubahan ke dalam database
    await kelas_kuliah.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== SET Ketua Dosen Pengajar With Kelas Kuliah ID ${kelasKuliahId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDosenPengajarKelasKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const dosenPengajarKelasKuliahId = req.params.id;

    if (!dosenPengajarKelasKuliahId) {
      return res.status(400).json({
        message: "Dosen Pengajar Kelas Kuliah ID is required",
      });
    }

    // Cari data dosen_pengajar_kelas_kuliah berdasarkan ID di database
    let dosen_pengajar_kelas_kuliah = await DosenPengajarKelasKuliah.findByPk(dosenPengajarKelasKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!dosen_pengajar_kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Dosen Pengajar Kelas Kuliah With ID ${dosenPengajarKelasKuliahId} Not Found:`,
      });
    }

    // Hapus data dosen_pengajar_kelas_kuliah dari database
    await dosen_pengajar_kelas_kuliah.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Dosen Pengajar Kelas Kuliah With ID ${dosenPengajarKelasKuliahId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDosenPengajarKelasKuliahByIdKelasKuliah,
  getDosenPengajarKelasKuliahById,
  createDosenPengajarKelasKuliah,
  updateDosenPengajarKelasKuliahById,
  setKetuaDosenPengajarByKelasKuliahId,
  deleteDosenPengajarKelasKuliahById,
};
