const { KelasKuliah, MataKuliah, DetailKelasKuliah, Prodi, Semester, Dosen, Mahasiswa, PesertaKelasKuliah, RuangPerkuliahan, SettingGlobalSemester, DosenPengajarKelasKuliah, PenugasanDosen } = require("../../models");

const getAllKelasKuliah = async (req, res, next) => {
  try {
    // Ambil semua data kelas_kuliah dari database
    const kelas_kuliah = await KelasKuliah.findAll({ include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }] });

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

const getKelasKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const KelasKuliahId = req.params.id;

    // Periksa apakah ID disediakan
    if (!KelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    // Cari data kelas_kuliah berdasarkan ID di database
    const kelas_kuliah = await KelasKuliah.findByPk(KelasKuliahId, {
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });

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

const GetAllKelasKuliahByProdiAndSemesterId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;

    // Periksa apakah ID disediakan
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    // Periksa apakah ID disediakan
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // Ambil semua data kelas_kuliah dari database dengan data relasi
    const kelas_kuliah = await KelasKuliah.findAll({
      where: {
        id_prodi: prodiId,
        id_semester: semesterId,
      },
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });

    if (kelas_kuliah.length === 0) {
      return res.status(404).json({
        message: `<===== Kelas Kuliah With ID ${prodiId} Not Found:`,
      });
    }

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

const createKelasKuliah = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nama_kelas_kuliah, kapasitas_peserta_kelas, hari, id_ruang_perkuliahan, id_dosen, jam_mulai, jam_selesai, lingkup, mode_kuliah, tanggal_mulai_efektif, tanggal_akhir_efektif } = req.body;

  // validasi required
  if (!nama_kelas_kuliah) {
    return res.status(400).json({ message: "nama_kelas_kuliah is required" });
  }
  if (!kapasitas_peserta_kelas) {
    return res.status(400).json({ message: "kapasitas_peserta_kelas is required" });
  }
  if (!hari) {
    return res.status(400).json({ message: "hari is required" });
  }
  if (!id_ruang_perkuliahan) {
    return res.status(400).json({ message: "id_ruang_perkuliahan is required" });
  }
  if (!id_dosen) {
    return res.status(400).json({ message: "id_dosen is required" });
  }
  if (!jam_mulai) {
    return res.status(400).json({ message: "jam_mulai is required" });
  }
  if (!jam_selesai) {
    return res.status(400).json({ message: "jam_selesai is required" });
  }
  if (!lingkup) {
    return res.status(400).json({ message: "lingkup is required" });
  }
  if (!mode_kuliah) {
    return res.status(400).json({ message: "mode_kuliah is required" });
  }
  if (!tanggal_mulai_efektif) {
    return res.status(400).json({ message: "tanggal_mulai_efektif is required" });
  }
  if (!tanggal_akhir_efektif) {
    return res.status(400).json({ message: "tanggal_akhir_efektif is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;
    const matkulId = req.params.id_matkul;

    // Periksa apakah ID disediakan
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }
    if (!matkulId) {
      return res.status(400).json({
        message: "Mata Kuliah ID is required",
      });
    }

    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }
    if (!matkulId) {
      return res.status(400).json({
        message: "Mata Kuliah ID is required",
      });
    }

    // get data matakuliah
    let mata_kuliah = await MataKuliah.findByPk(matkulId);

    // get data penugasan dosen dari id_dosen
    const penugasan_dosen = await PenugasanDosen.findOne({
      where: {
        id_dosen: id_dosen,
      },
    });

    if (!penugasan_dosen) {
      return res.status(404).json({
        message: `<===== Penugasan Dosen With ID ${id_dosen} Not Found:`,
      });
    }

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
    let detail_kelas_kuliah = await DetailKelasKuliah.create({
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

    // create dosen pengajar kelas kuliah
    let dosen_pengajar_kelas_kuliah = await DosenPengajarKelasKuliah.create({
      sks_substansi_total: mata_kuliah.sks_mata_kuliah,
      rencana_minggu_pertemuan: 16,
      realisasi_minggu_pertemuan: 0,
      id_registrasi_dosen: penugasan_dosen.id_registrasi_dosen,
      id_dosen: id_dosen,
      id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah,
      id_substansi: null,
      id_jenis_evaluasi: 1,
      id_prodi: kelas_kuliah.id_prodi,
      id_semester: kelas_kuliah.id_semester,
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== CREATE Kelas Kuliah Success",
      dataKelasKuliah: kelas_kuliah,
      dataDetailKelasKuliah: detail_kelas_kuliah,
      dataDosenPengajarKelasKuliah: dosen_pengajar_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const updateKelasKuliahById = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nama_kelas_kuliah, kapasitas_peserta_kelas, hari, id_ruang_perkuliahan, id_dosen, jam_mulai, jam_selesai, lingkup, mode_kuliah, tanggal_mulai_efektif, tanggal_akhir_efektif } = req.body;

  // validasi required
  if (!nama_kelas_kuliah) {
    return res.status(400).json({ message: "nama_kelas_kuliah is required" });
  }
  if (!kapasitas_peserta_kelas) {
    return res.status(400).json({ message: "kapasitas_peserta_kelas is required" });
  }
  if (!hari) {
    return res.status(400).json({ message: "hari is required" });
  }
  if (!id_ruang_perkuliahan) {
    return res.status(400).json({ message: "id_ruang_perkuliahan is required" });
  }
  if (!id_dosen) {
    return res.status(400).json({ message: "id_dosen is required" });
  }
  if (!jam_mulai) {
    return res.status(400).json({ message: "jam_mulai is required" });
  }
  if (!jam_selesai) {
    return res.status(400).json({ message: "jam_selesai is required" });
  }
  if (!lingkup) {
    return res.status(400).json({ message: "lingkup is required" });
  }
  if (!mode_kuliah) {
    return res.status(400).json({ message: "mode_kuliah is required" });
  }
  if (!tanggal_mulai_efektif) {
    return res.status(400).json({ message: "tanggal_mulai_efektif is required" });
  }
  if (!tanggal_akhir_efektif) {
    return res.status(400).json({ message: "tanggal_akhir_efektif is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    // Periksa apakah ID disediakan
    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    // Cari data kelas kuliah berdasarkan ID di database
    let dataKelasKuliah = await KelasKuliah.findByPk(kelasKuliahId);

    // Melakukan update ketika data id_dosen berubah untuk data dosen pengajar kelas kuliah
    if (kelasKuliahId.id_dosen != id_dosen) {
      // update data dosen pengajar kelas kuliah
      const dosen_pengajar_kelas_kuliah = await DosenPengajarKelasKuliah.findOne({
        where: {
          id_kelas_kuliah: dataKelasKuliah.id_kelas_kuliah,
        },
      });

      // Jika data tidak ditemukan, kirim respons 404
      if (!dosen_pengajar_kelas_kuliah) {
        return res.status(404).json({
          message: `<===== Dosen Pengajar Kelas Kuliah With ID ${dataKelasKuliah.id_kelas_kuliah} Not Found:`,
        });
      }

      // get data penugasan dosen
      const penugasan_dosen = await PenugasanDosen.findOne({
        where: {
          id_dosen: id_dosen,
        },
      });

      // Jika data tidak ditemukan, kirim respons 404
      if (!penugasan_dosen) {
        return res.status(404).json({
          message: `<===== Penugasan Dosen With ID ${dataKelasKuliah.id_kelas_kuliah} Not Found:`,
        });
      }

      dosen_pengajar_kelas_kuliah.id_dosen = id_dosen;
      dosen_pengajar_kelas_kuliah.id_registrasi_dosen = penugasan_dosen.id_registrasi_dosen;

      await dosen_pengajar_kelas_kuliah.save();
    }

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

    // Periksa apakah ID disediakan
    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    // Cari data kelas_kuliah berdasarkan ID di database
    let kelas_kuliah = await KelasKuliah.findByPk(kelasKuliahId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Kelas Kuliah With ID ${kelasKuliahId} Not Found:`,
      });
    }

    // cari data detail kelas kuliah
    let detail_kelas_kuliah = await DetailKelasKuliah.findOne({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
    });

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

const getAllKelasKuliahByProdiId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;

    // Periksa apakah ID disediakan
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    // Ambil semua data kelas_kuliah dari database
    const kelas_kuliah = await KelasKuliah.findAll({
      where: {
        id_prodi: prodiId,
      },
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });

    // Periksa apakah data kelas_kuliah ditemukan
    if (kelas_kuliah.length === 0) {
      return res.status(404).json({
        message: `<===== No Kelas Kuliah Found for Prodi Id ${prodiId}`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Kelas Kuliah By Prodi Id ${prodiId} Success`,
      jumlahData: kelas_kuliah.length,
      data: kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getAllKelasKuliahAvailableByProdiMahasiswa = async (req, res, next) => {
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

    // get data setting global semester
    const setting_global_semester = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    if (!setting_global_semester) {
      return res.status(404).json({
        message: "Setting Global Semester Aktif not found",
      });
    }

    // Ambil semua data kelas_kuliah dari database
    const kelas_kuliah = await KelasKuliah.findAll({
      where: {
        id_prodi: mahasiswa.id_prodi,
        id_semester: setting_global_semester.id_semester_krs,
      },
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }, { model: DetailKelasKuliah, include: [{ model: RuangPerkuliahan }] }],
    });

    // Periksa apakah data kelas_kuliah ditemukan
    if (kelas_kuliah.length === 0) {
      return res.status(404).json({
        message: "<===== No Kelas Kuliah Found",
      });
    }

    // Array untuk menyimpan kelas_kuliah yang memenuhi syarat
    const finalKelasKuliah = [];

    // Iterasi setiap kelas_kuliah
    for (const kelas of kelas_kuliah) {
      // Hitung jumlah peserta_kelas_kuliah untuk kelas tertentu
      const jumlahPesertaKelasKuliah = await PesertaKelasKuliah.count({
        where: { id_kelas_kuliah: kelas.id_kelas_kuliah },
      });

      // Periksa apakah jumlah peserta_kelas_kuliah kurang dari jumlah_mahasiswa
      if (jumlahPesertaKelasKuliah < kelas.jumlah_mahasiswa) {
        finalKelasKuliah.push(kelas);
      }
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Kelas Kuliah By Prodi Mahasiswa Success`,
      jumlahData: finalKelasKuliah.length,
      data: finalKelasKuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getAllKelasKuliahAvailableByProdiMahasiswaId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const id_registrasi_mahasiswa = req.params.id_registrasi_mahasiswa;

    const mahasiswa = await Mahasiswa.findByPk(id_registrasi_mahasiswa);

    if (!mahasiswa) {
      return res.status(404).json({
        message: "Mahasiswa not found",
      });
    }

    // get data setting global semester
    const setting_global_semester = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    if (!setting_global_semester) {
      return res.status(404).json({
        message: "Setting Global Semester Aktif not found",
      });
    }

    // Ambil semua data kelas_kuliah dari database
    const kelas_kuliah = await KelasKuliah.findAll({
      where: {
        id_prodi: mahasiswa.id_prodi,
        id_semester: setting_global_semester.id_semester_krs,
      },
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });

    // Periksa apakah data kelas_kuliah ditemukan
    if (kelas_kuliah.length === 0) {
      return res.status(404).json({
        message: "<===== No Kelas Kuliah Found",
      });
    }

    // Array untuk menyimpan kelas_kuliah yang memenuhi syarat
    const finalKelasKuliah = [];

    // Iterasi setiap kelas_kuliah
    for (const kelas of kelas_kuliah) {
      // Hitung jumlah peserta_kelas_kuliah untuk kelas tertentu
      const jumlahPesertaKelasKuliah = await PesertaKelasKuliah.count({
        where: { id_kelas_kuliah: kelas.id_kelas_kuliah },
      });

      // Periksa apakah jumlah peserta_kelas_kuliah kurang dari jumlah_mahasiswa
      if (jumlahPesertaKelasKuliah < kelas.jumlah_mahasiswa) {
        finalKelasKuliah.push(kelas);
      }
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Kelas Kuliah By Prodi Mahasiswa Success`,
      jumlahData: finalKelasKuliah.length,
      data: finalKelasKuliah,
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
  getAllKelasKuliahByProdiId,
  getAllKelasKuliahAvailableByProdiMahasiswa,
  getAllKelasKuliahAvailableByProdiMahasiswaId,
};
