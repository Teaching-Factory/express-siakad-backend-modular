const { TagihanMahasiswa, Periode, Mahasiswa, JenisTagihan, StatusMahasiswa, SemesterAktif } = require("../../models");

const getAllTagihanMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data tagihan_mahasiswa dari database
    const tagihan_mahasiswa = await TagihanMahasiswa.findAll({ include: [{ model: Periode }, { model: Mahasiswa }, { model: JenisTagihan }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Tagihan Mahasiswa Success",
      jumlahData: tagihan_mahasiswa.length,
      data: tagihan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getTagihanMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const tagihanMahasiswaId = req.params.id;

    if (!tagihanMahasiswaId) {
      return res.status(400).json({
        message: "Tagihan Mahasiswa ID is required",
      });
    }

    // Cari data tagihan_mahasiswa berdasarkan ID di database
    const tagihan_mahasiswa = await TagihanMahasiswa.findByPk(tagihanMahasiswaId, {
      include: [{ model: Periode }, { model: Mahasiswa }, { model: JenisTagihan }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!tagihan_mahasiswa) {
      return res.status(404).json({
        message: `<===== Tagihan Mahasiswa With ID ${tagihanMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Tagihan Mahasiswa By ID ${tagihanMahasiswaId} Success:`,
      data: tagihan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const createTagihanMahasiswa = async (req, res, next) => {
  const { jumlah_tagihan, id_jenis_tagihan, tanggal_tagihan, deadline_tagihan, status_tagihan, id_periode, id_registrasi_mahasiswa } = req.body;

  if (!jumlah_tagihan) {
    return res.status(400).json({ message: "jumlah_tagihan is required" });
  }
  if (!id_jenis_tagihan) {
    return res.status(400).json({ message: "id_jenis_tagihan is required" });
  }
  if (!tanggal_tagihan) {
    return res.status(400).json({ message: "tanggal_tagihan is required" });
  }
  if (!deadline_tagihan) {
    return res.status(400).json({ message: "deadline_tagihan is required" });
  }
  if (!status_tagihan) {
    return res.status(400).json({ message: "status_tagihan is required" });
  }
  if (!id_periode) {
    return res.status(400).json({ message: "id_periode is required" });
  }
  if (!id_registrasi_mahasiswa) {
    return res.status(400).json({ message: "id_registrasi_mahasiswa is required" });
  }

  try {
    // Gunakan metode create untuk membuat data tagihan_mahasiswa baru
    const newTagihanMahasiswa = await TagihanMahasiswa.create({ jumlah_tagihan, id_jenis_tagihan, tanggal_tagihan, deadline_tagihan, status_tagihan, id_periode, id_registrasi_mahasiswa });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Tagihan Mahasiswa Success",
      data: newTagihanMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const updateTagihanMahasiswaById = async (req, res, next) => {
  // Ambil data untuk update dari body permintaan
  const { jumlah_tagihan, id_jenis_tagihan, tanggal_tagihan, deadline_tagihan, status_tagihan, id_periode, id_registrasi_mahasiswa } = req.body;

  if (!jumlah_tagihan) {
    return res.status(400).json({ message: "jumlah_tagihan is required" });
  }
  if (!id_jenis_tagihan) {
    return res.status(400).json({ message: "id_jenis_tagihan is required" });
  }
  if (!tanggal_tagihan) {
    return res.status(400).json({ message: "tanggal_tagihan is required" });
  }
  if (!deadline_tagihan) {
    return res.status(400).json({ message: "deadline_tagihan is required" });
  }
  if (!status_tagihan) {
    return res.status(400).json({ message: "status_tagihan is required" });
  }
  if (!id_periode) {
    return res.status(400).json({ message: "id_periode is required" });
  }
  if (!id_registrasi_mahasiswa) {
    return res.status(400).json({ message: "id_registrasi_mahasiswa is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const tagihanMahasiswaId = req.params.id;

    if (!tagihanMahasiswaId) {
      return res.status(400).json({
        message: "Tagihan Mahasiswa ID is required",
      });
    }

    // Temukan tagihan_mahasiswa yang akan diperbarui berdasarkan ID
    const tagihan_mahasiswa = await TagihanMahasiswa.findByPk(tagihanMahasiswaId);

    if (!tagihan_mahasiswa) {
      return res.status(404).json({ message: "Tagihan Mahasiswa tidak ditemukan" });
    }

    // Update data tagihan_mahasiswa
    tagihan_mahasiswa.jumlah_tagihan = jumlah_tagihan || tagihan_mahasiswa.jumlah_tagihan;
    tagihan_mahasiswa.id_jenis_tagihan = id_jenis_tagihan || tagihan_mahasiswa.id_jenis_tagihan;
    tagihan_mahasiswa.tanggal_tagihan = tanggal_tagihan || tagihan_mahasiswa.tanggal_tagihan;
    tagihan_mahasiswa.deadline_tagihan = deadline_tagihan || tagihan_mahasiswa.deadline_tagihan;
    tagihan_mahasiswa.status_tagihan = status_tagihan || tagihan_mahasiswa.status_tagihan;
    tagihan_mahasiswa.id_periode = id_periode || tagihan_mahasiswa.id_periode;
    tagihan_mahasiswa.id_registrasi_mahasiswa = id_registrasi_mahasiswa || tagihan_mahasiswa.id_registrasi_mahasiswa;

    await tagihan_mahasiswa.save();

    // pengecekan jikalau status tagihan saat ini sudah lunas, maka status mahasiswa aktif
    if (tagihan_mahasiswa.status_tagihan === "Lunas") {
      // get data status mahasiswa A
      const status_mahasiswa_a = await StatusMahasiswa.findOne({
        id_status_mahasiswa: "A",
      });

      if (!status_mahasiswa_a) {
        return res.status(404).json({ message: "Status Mahasiswa A tidak ditemukan" });
      }

      // get data semester aktif sekarang
      const semester_aktif = await SemesterAktif.findOne({
        where: {
          status: true,
        },
      });

      if (!semester_aktif) {
        return res.status(404).json({ message: "Semester Aktif tidak ditemukan" });
      }

      const mahasiswa = await Mahasiswa.findByPk(tagihan_mahasiswa.id_registrasi_mahasiswa);

      if (!mahasiswa) {
        return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
      }

      // update dan simpan status mahasiswa menjadi 'Aktif' dan ambil semester aktif baru
      mahasiswa.nama_status_mahasiswa = status_mahasiswa_a.nama_status_mahasiswa;
      mahasiswa.id_semester = semester_aktif.id_semester;
      await mahasiswa.save();
    }

    res.json({
      message: "UPDATE Tagihan Mahasiswa Success",
      dataTagihanMahasiswa: tagihan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTagihanMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const tagihanMahasiswaId = req.params.id;

    if (!tagihanMahasiswaId) {
      return res.status(400).json({
        message: "Tagihan Mahasiswa ID is required",
      });
    }

    // Cari data tagihan_mahasiswa berdasarkan ID di database
    let tagihan_mahasiswa = await TagihanMahasiswa.findByPk(tagihanMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!tagihan_mahasiswa) {
      return res.status(404).json({
        message: `<===== Tagihan Mahasiswa With ID ${tagihanMahasiswaId} Not Found:`,
      });
    }

    // Hapus data tagihan_mahasiswa dari database
    await tagihan_mahasiswa.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Tagihan Mahasiswa With ID ${tagihanMahasiswaId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

const getTagihanMahasiswaByMahasiswaId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const idRegistrasiMahasiswa = req.params.id_registrasi_mahasiswa;

    if (!idRegistrasiMahasiswa) {
      return res.status(400).json({
        message: "ID Registrasi Mahasiswa is required",
      });
    }

    // Cari data tagihan_mahasiswa berdasarkan id_registrasi_mahasiswa di database
    const tagihanMahasiswaId = await TagihanMahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: idRegistrasiMahasiswa,
      },
      include: [{ model: Periode }, { model: Mahasiswa }, { model: JenisTagihan }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!tagihanMahasiswaId || tagihanMahasiswaId.length === 0) {
      return res.status(404).json({
        message: `<===== Tagihan Mahasiswa With ID ${idRegistrasiMahasiswa} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Tagihan Mahasiswa By ID ${idRegistrasiMahasiswa} Success:`,
      jumlahData: tagihanMahasiswaId.length,
      data: tagihanMahasiswaId,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTagihanMahasiswaByMahasiswaActive = async (req, res, next) => {
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

    // Ambil semua data tagihan_mahasiswa_active dari database
    const tagihan_mahasiswa_active = await TagihanMahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
      },
      include: [{ model: Periode }, { model: Mahasiswa }, { model: JenisTagihan }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Tagihan Mahasiswa By Mahasiswa Active Success",
      jumlahData: tagihan_mahasiswa_active.length,
      data: tagihan_mahasiswa_active,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTagihanMahasiswaByFilter = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const { id_periode, id_prodi, id_jenis_tagihan, status_tagihan } = req.body;

    // Ambil semua data tagihan_mahasiswa dari database
    const tagihan_mahasiswa = await TagihanMahasiswa.findAll({
      where: {
        id_periode: id_periode,
        id_jenis_tagihan: id_jenis_tagihan,
        status_tagihan: status_tagihan,
      },
      include: [
        { model: Periode },
        {
          model: Mahasiswa,
          where: {
            id_prodi: id_prodi,
          },
        },
        { model: JenisTagihan },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Tagihan Mahasiswa By Filter Success",
      jumlahData: tagihan_mahasiswa.length,
      data: tagihan_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const createTagihanMahasiswaKolektif = async (req, res, next) => {
  const { jumlah_tagihan, id_jenis_tagihan, tanggal_tagihan, deadline_tagihan, status_tagihan, id_periode, mahasiswas } = req.body;

  if (!jumlah_tagihan) {
    return res.status(400).json({ message: "jumlah_tagihan is required" });
  }
  if (!id_jenis_tagihan) {
    return res.status(400).json({ message: "id_jenis_tagihan is required" });
  }
  if (!tanggal_tagihan) {
    return res.status(400).json({ message: "tanggal_tagihan is required" });
  }
  if (!deadline_tagihan) {
    return res.status(400).json({ message: "deadline_tagihan is required" });
  }
  if (!status_tagihan) {
    return res.status(400).json({ message: "status_tagihan is required" });
  }
  if (!id_periode) {
    return res.status(400).json({ message: "id_periode is required" });
  }
  if (!mahasiswas || !Array.isArray(mahasiswas) || mahasiswas.length === 0) {
    return res.status(400).json({ message: "mahasiswas is required and must be a non-empty array" });
  }

  try {
    // Buat data tagihan_mahasiswa baru untuk setiap mahasiswa dalam array mahasiswas
    const newTagihanMahasiswas = await Promise.all(
      mahasiswas.map(async (mahasiswa) => {
        const { id_registrasi_mahasiswa } = mahasiswa;
        if (!id_registrasi_mahasiswa) {
          throw new Error("id_registrasi_mahasiswa is required for each mahasiswa");
        }

        return await TagihanMahasiswa.create({ jumlah_tagihan, id_jenis_tagihan, tanggal_tagihan, deadline_tagihan, status_tagihan, id_periode, id_registrasi_mahasiswa });
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Tagihan Mahasiswa Kolektif Success",
      jumlahData: newTagihanMahasiswas.length,
      data: newTagihanMahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTagihanMahasiswa,
  getTagihanMahasiswaById,
  createTagihanMahasiswa,
  updateTagihanMahasiswaById,
  deleteTagihanMahasiswaById,
  getTagihanMahasiswaByMahasiswaId,
  getAllTagihanMahasiswaByMahasiswaActive,
  getAllTagihanMahasiswaByFilter,
  createTagihanMahasiswaKolektif,
};
