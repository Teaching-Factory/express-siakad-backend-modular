const {
  PeriodePendaftaran,
  Semester,
  JalurMasuk,
  SistemKuliah,
  ProdiPeriodePendaftaran,
  BerkasPeriodePendaftaran,
  TahapTesPeriodePendaftaran,
  SumberPeriodePendaftaran,
  Prodi,
  JenisTes,
  JenisBerkas,
  Sumber,
  TagihanCamaba,
  JenjangPendidikan,
} = require("../../models");

const getAllPeriodePendaftaran = async (req, res, next) => {
  try {
    // Ambil semua data periode_pendaftarans dari database
    const periode_pendaftarans = await PeriodePendaftaran.findAll({
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Periode Pendaftaran Success",
      jumlahData: periode_pendaftarans.length,
      data: periode_pendaftarans,
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodePendaftaranByFilter = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;
    const jalurMasukId = req.params.id_jalur_masuk;
    const sistemKuliahId = req.params.id_sistem_kuliah;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }
    if (!jalurMasukId) {
      return res.status(400).json({
        message: "Jalur Masuk ID is required",
      });
    }
    if (!sistemKuliahId) {
      return res.status(400).json({
        message: "Sistem Kuliah ID is required",
      });
    }

    // Ambil semua data periode_pendaftarans dari database
    const periode_pendaftarans = await PeriodePendaftaran.findAll({
      where: {
        id_semester: semesterId,
        id_jalur_masuk: jalurMasukId,
        id_sistem_kuliah: sistemKuliahId,
      },
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Periode Pendaftaran By Filter Success",
      jumlahData: periode_pendaftarans.length,
      data: periode_pendaftarans,
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodePendaftaranBySemesterId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // Ambil semua data periode_pendaftarans dari database
    const periode_pendaftarans = await PeriodePendaftaran.findAll({
      where: {
        id_semester: semesterId,
      },
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Periode Pendaftaran By Semester ID ${semesterId} Success`,
      jumlahData: periode_pendaftarans.length,
      data: periode_pendaftarans,
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodePendaftaranById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    // Cari data periode_pendaftaran berdasarkan ID di database
    const periode_pendaftaran = await PeriodePendaftaran.findByPk(periodePendaftaranId, {
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran With ID ${periodePendaftaranId} Not Found:`,
      });
    }

    // get data prodi periode pendaftaran
    const prodiPeriodePendaftaran = await ProdiPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId,
      },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });

    // get data berkas periode pendaftaran
    const berkasPeriodePendaftaran = await BerkasPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId,
      },
      include: [{ model: JenisBerkas, as: "JenisBerkas" }],
    });

    // get data tahap tes periode pendaftaran
    const tahapTesPeriodePendaftaran = await TahapTesPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId,
      },
      include: [{ model: JenisTes }],
    });

    // get data sumber periode pendaftaran
    const sumberPeriodePendaftaran = await SumberPeriodePendaftaran.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId,
      },
      include: [{ model: Sumber }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Periode Pendaftaran By ID ${periodePendaftaranId} Success:`,
      data: periode_pendaftaran,
      prodi_periode_pendaftaran: prodiPeriodePendaftaran,
      berkas_periode_pendaftaran: berkasPeriodePendaftaran,
      tahap_tes_periode_pendaftaran: tahapTesPeriodePendaftaran,
      sumber_periode_pendaftaran: sumberPeriodePendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodePendaftaranDibuka = async (req, res, next) => {
  try {
    // Cari data periode_pendaftaran_dibuka berdasarkan ID di database
    const periode_pendaftaran_dibuka = await PeriodePendaftaran.findAll({
      where: {
        dibuka: true,
      },
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_pendaftaran_dibuka) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran Dibuka Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Periode Pendaftaran Dibuka Success:`,
      jumlahData: periode_pendaftaran_dibuka.length,
      data: periode_pendaftaran_dibuka,
    });
  } catch (error) {
    next(error);
  }
};

const createPeriodePendaftaran = async (req, res, next) => {
  const {
    nama_periode_pendaftaran,
    id_semester,
    id_jalur_masuk,
    id_sistem_kuliah,
    tanggal_awal_pendaftaran,
    tanggal_akhir_pendaftaran,
    dibuka,
    berbayar,
    biaya_pendaftaran,
    batas_akhir_pembayaran,
    jumlah_pilihan_prodi,
    deskripsi_singkat,
    konten_informasi,
    sumber_informasi,

    // array
    prodi = [],
    berkas = [],
    tahap_tes = [],
    sumber = [],
  } = req.body;

  if (!nama_periode_pendaftaran) {
    return res.status(400).json({ message: "nama_periode_pendaftaran is required" });
  }
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }
  if (!id_jalur_masuk) {
    return res.status(400).json({ message: "id_jalur_masuk is required" });
  }
  if (!id_sistem_kuliah) {
    return res.status(400).json({ message: "id_sistem_kuliah is required" });
  }
  if (!tanggal_awal_pendaftaran) {
    return res.status(400).json({ message: "tanggal_awal_pendaftaran is required" });
  }
  if (!tanggal_akhir_pendaftaran) {
    return res.status(400).json({ message: "tanggal_akhir_pendaftaran is required" });
  }
  if (!jumlah_pilihan_prodi) {
    return res.status(400).json({ message: "jumlah_pilihan_prodi is required" });
  }

  // Validasi array wajib berkas dan tahap tes
  if (berkas.length === 0) {
    return res.status(400).json({ message: "Berkas is required" });
  }
  if (tahap_tes.length === 0) {
    return res.status(400).json({ message: "Tahap Tes is required" });
  }

  // Jika sumber_informasi true, validasi sumber
  if (sumber_informasi && sumber.length === 0) {
    return res.status(400).json({ message: "Sumber Periode Pendaftaran is not valid" });
  }

  try {
    // Buat data Periode Pendaftaran
    const newPeriodePendaftaran = await PeriodePendaftaran.create({
      nama_periode_pendaftaran: nama_periode_pendaftaran,
      id_semester: id_semester,
      id_jalur_masuk: id_jalur_masuk,
      id_sistem_kuliah: id_sistem_kuliah,
      tanggal_awal_pendaftaran: tanggal_awal_pendaftaran,
      tanggal_akhir_pendaftaran: tanggal_akhir_pendaftaran,
      dibuka: dibuka,
      berbayar: berbayar,
      biaya_pendaftaran: berbayar ? biaya_pendaftaran : 0.0,
      batas_akhir_pembayaran: berbayar ? batas_akhir_pembayaran : null,
      jumlah_pilihan_prodi: jumlah_pilihan_prodi,
      deskripsi_singkat: deskripsi_singkat,
      konten_informasi: konten_informasi,
      sumber_informasi: sumber_informasi,
    });

    // Tambah data Prodi, jika ada
    if (prodi.length > 0) {
      await Promise.all(
        prodi.map(async ({ id_prodi }) => {
          // Cari data prodi apakah id_prodi valid
          const data_prodi = await Prodi.findOne({
            where: {
              id_prodi: id_prodi,
            },
          });

          if (data_prodi) {
            await ProdiPeriodePendaftaran.create({
              id_periode_pendaftaran: newPeriodePendaftaran.id,
              id_prodi: data_prodi.id_prodi,
            });
          } else {
            console.error(`Prodi with id_prodi: ${id_prodi} not found`);
          }
        })
      );
    }

    // Tambah data Berkas
    await Promise.all(
      berkas.map(async ({ id_jenis_berkas }) => {
        // Cari data jenis berkas apakah id_prodi valid
        const data_jenis_berkas = await JenisBerkas.findOne({
          where: {
            id: id_jenis_berkas,
          },
        });

        if (data_jenis_berkas) {
          await BerkasPeriodePendaftaran.create({
            id_periode_pendaftaran: newPeriodePendaftaran.id,
            id_jenis_berkas: data_jenis_berkas.id,
          });
        } else {
          console.error(`Jenis Berkas with id_jenis_berkas: ${id_jenis_berkas} not found`);
        }
      })
    );

    // Tambah data Tahap Tes
    await Promise.all(
      tahap_tes.map(async ({ id_jenis_tes, urutan_tes, tanggal_awal_tes, tanggal_akhir_tes }) => {
        // Cari data jenis tes apakah id_prodi valid
        const data_jenis_tes = await JenisTes.findOne({
          where: {
            id: id_jenis_tes,
          },
        });

        if (data_jenis_tes) {
          await TahapTesPeriodePendaftaran.create({
            id_periode_pendaftaran: newPeriodePendaftaran.id,
            id_jenis_tes: data_jenis_tes.id,
            urutan_tes: urutan_tes,
            tanggal_awal_tes: tanggal_awal_tes,
            tanggal_akhir_tes: tanggal_akhir_tes,
          });
        } else {
          console.error(`Jenis Tes with id_jenis_tes: ${id_jenis_tes} not found`);
        }
      })
    );

    // Tambah data Sumber jika sumber_informasi true
    if (sumber_informasi && sumber.length > 0) {
      await Promise.all(
        sumber.map(async ({ id_sumber }) => {
          // Cari data sumber apakah id_prodi valid
          const data_sumber = await Sumber.findOne({
            where: {
              id: id_sumber,
            },
          });

          if (data_sumber) {
            await SumberPeriodePendaftaran.create({
              id_periode_pendaftaran: newPeriodePendaftaran.id,
              id_sumber: data_sumber.id,
            });
          } else {
            console.error(`Sumber with id_sumber: ${id_sumber} not found`);
          }
        })
      );
    }

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Periode Pendaftaran Success",
      data: newPeriodePendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

const updatePeriodePerkuliahanById = async (req, res, next) => {
  const {
    nama_periode_pendaftaran,
    id_semester,
    id_jalur_masuk,
    id_sistem_kuliah,
    tanggal_awal_pendaftaran,
    tanggal_akhir_pendaftaran,
    dibuka,
    berbayar,
    biaya_pendaftaran,
    batas_akhir_pembayaran,
    jumlah_pilihan_prodi,
    deskripsi_singkat,
    konten_informasi,
    sumber_informasi,

    // array
    prodi = [],
    berkas = [],
    tahap_tes = [],
    sumber = [],
  } = req.body;

  if (!nama_periode_pendaftaran) {
    return res.status(400).json({ message: "nama_periode_pendaftaran is required" });
  }
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }
  if (!id_jalur_masuk) {
    return res.status(400).json({ message: "id_jalur_masuk is required" });
  }
  if (!id_sistem_kuliah) {
    return res.status(400).json({ message: "id_sistem_kuliah is required" });
  }
  if (!tanggal_awal_pendaftaran) {
    return res.status(400).json({ message: "tanggal_awal_pendaftaran is required" });
  }
  if (!tanggal_akhir_pendaftaran) {
    return res.status(400).json({ message: "tanggal_akhir_pendaftaran is required" });
  }
  if (!jumlah_pilihan_prodi) {
    return res.status(400).json({ message: "jumlah_pilihan_prodi is required" });
  }

  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    // Cari data periode_pendaftaran berdasarkan ID di database
    let periode_pendaftaran = await PeriodePendaftaran.findByPk(periodePendaftaranId);

    // Update data periode_pendaftaran
    periode_pendaftaran.nama_periode_pendaftaran = nama_periode_pendaftaran;
    periode_pendaftaran.id_semester = id_semester;
    periode_pendaftaran.id_jalur_masuk = id_jalur_masuk;
    periode_pendaftaran.id_sistem_kuliah = id_sistem_kuliah;
    periode_pendaftaran.tanggal_awal_pendaftaran = tanggal_awal_pendaftaran;
    periode_pendaftaran.tanggal_akhir_pendaftaran = tanggal_akhir_pendaftaran;
    periode_pendaftaran.dibuka = dibuka;
    periode_pendaftaran.berbayar = berbayar;
    periode_pendaftaran.biaya_pendaftaran = biaya_pendaftaran;
    periode_pendaftaran.batas_akhir_pembayaran = batas_akhir_pembayaran;
    periode_pendaftaran.jumlah_pilihan_prodi = jumlah_pilihan_prodi;
    periode_pendaftaran.deskripsi_singkat = deskripsi_singkat;
    periode_pendaftaran.konten_informasi = konten_informasi;
    periode_pendaftaran.sumber_informasi = sumber_informasi;

    // Simpan perubahan ke dalam database
    await periode_pendaftaran.save();

    // Perbarui data Prodi
    if (prodi.length > 0) {
      await ProdiPeriodePendaftaran.destroy({ where: { id_periode_pendaftaran: periodePendaftaranId } }); // Hapus semua data prodi terkait dengan periode pendaftaran ini
      await Promise.all(
        prodi.map(async ({ id_prodi }) => {
          const data_prodi = await Prodi.findByPk(id_prodi);
          if (data_prodi) {
            await ProdiPeriodePendaftaran.create({
              id_periode_pendaftaran: periodePendaftaranId,
              id_prodi: data_prodi.id_prodi,
            });
          } else {
            console.error(`Prodi with id_prodi: ${id_prodi} not found`);
          }
        })
      );
    }

    // Perbarui data Berkas
    if (berkas.length > 0) {
      await BerkasPeriodePendaftaran.destroy({ where: { id_periode_pendaftaran: periodePendaftaranId } }); // Hapus semua data berkas terkait dengan periode pendaftaran ini
      await Promise.all(
        berkas.map(async ({ id_jenis_berkas }) => {
          const data_jenis_berkas = await JenisBerkas.findByPk(id_jenis_berkas);
          if (data_jenis_berkas) {
            await BerkasPeriodePendaftaran.create({
              id_periode_pendaftaran: periodePendaftaranId,
              id_jenis_berkas: data_jenis_berkas.id,
            });
          } else {
            console.error(`Jenis Berkas with id_jenis_berkas: ${id_jenis_berkas} not found`);
          }
        })
      );
    }

    // Perbarui data Tahap Tes
    if (tahap_tes.length > 0) {
      await TahapTesPeriodePendaftaran.destroy({ where: { id_periode_pendaftaran: periodePendaftaranId } }); // Hapus semua data tes terkait dengan periode pendaftaran ini
      await Promise.all(
        tahap_tes.map(async ({ id_jenis_tes, urutan_tes, tanggal_awal_tes, tanggal_akhir_tes }) => {
          const data_jenis_tes = await JenisTes.findByPk(id_jenis_tes);
          if (data_jenis_tes) {
            await TahapTesPeriodePendaftaran.create({
              id_periode_pendaftaran: periodePendaftaranId,
              id_jenis_tes: data_jenis_tes.id,
              urutan_tes,
              tanggal_awal_tes,
              tanggal_akhir_tes,
            });
          } else {
            console.error(`Jenis Tes with id_jenis_tes: ${id_jenis_tes} not found`);
          }
        })
      );
    }

    // Perbarui data Sumber jika sumber_informasi true
    if (sumber_informasi && sumber.length > 0) {
      await SumberPeriodePendaftaran.destroy({ where: { id_periode_pendaftaran: periodePendaftaranId } }); // Hapus semua data sumber terkait dengan periode pendaftaran ini
      await Promise.all(
        sumber.map(async ({ id_sumber }) => {
          const data_sumber = await Sumber.findByPk(id_sumber);
          if (data_sumber) {
            await SumberPeriodePendaftaran.create({
              id_periode_pendaftaran: periodePendaftaranId,
              id_sumber: data_sumber.id,
            });
          } else {
            console.error(`Sumber with id_sumber: ${id_sumber} not found`);
          }
        })
      );
    }

    // update seluruh data tagihan camaba untuk kolom jumlah_tagihan, dan tanggal_tagihan
    const all_tagihan_camaba = await TagihanCamaba.findAll({
      where: {
        id_periode_pendaftaran: periodePendaftaranId,
      },
    });

    if (all_tagihan_camaba.length > 0) {
      // Proses update setiap data tagihan camaba
      for (const tagihan of all_tagihan_camaba) {
        tagihan.jumlah_tagihan = periode_pendaftaran.biaya_pendaftaran;
        tagihan.tanggal_tagihan = periode_pendaftaran.batas_akhir_pembayaran;

        // Simpan perubahan untuk setiap objek tagihan camaba
        await tagihan.save();
      }
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Periode Pendaftaran With ID ${periodePendaftaranId} Success:`,
      data: periode_pendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

const deletePeriodePendaftaranById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Jabatan ID is required",
      });
    }

    // Cari data periode_pendaftaran berdasarkan ID di database
    let periode_pendaftaran = await PeriodePendaftaran.findByPk(periodePendaftaranId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran With ID ${periodePendaftaranId} Not Found:`,
      });
    }

    // Hapus data periode_pendaftaran dari database
    await periode_pendaftaran.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Periode Pendaftaran With ID ${periodePendaftaranId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodePendaftaranGuestById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const periodePendaftaranId = req.params.id;

    if (!periodePendaftaranId) {
      return res.status(400).json({
        message: "Periode Pendaftaran ID is required",
      });
    }

    // Cari data periode_pendaftaran berdasarkan ID di database
    const periode_pendaftaran = await PeriodePendaftaran.findByPk(periodePendaftaranId, {
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran With ID ${periodePendaftaranId} Not Found:`,
      });
    }

    // Get berkas periode pendaftaran dengan include dan alias yang sesuai
    const berkas_periode_pendaftaran = await BerkasPeriodePendaftaran.findAll({
      where: { id_periode_pendaftaran: periodePendaftaranId },
      include: [{ model: JenisBerkas, as: "JenisBerkas" }], // Pastikan 'jenisBerkas' sesuai dengan alias yang ditentukan
    });

    // Get sumber periode pendaftaran
    const sumber_periode_pendaftaran = await SumberPeriodePendaftaran.findAll({
      where: { id_periode_pendaftaran: periodePendaftaranId },
      include: [{ model: Sumber, as: "Sumber" }],
    });

    // Get prodi periode pendaftaran
    const prodi_periode_pendaftaran = await ProdiPeriodePendaftaran.findAll({
      where: { id_periode_pendaftaran: periodePendaftaranId },
      include: [{ model: Prodi, as: "Prodi", include: [{ model: JenjangPendidikan }] }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Periode Pendaftaran By ID ${periodePendaftaranId} Success:`,
      data: periode_pendaftaran,
      berkas: berkas_periode_pendaftaran,
      sumber: sumber_periode_pendaftaran,
      prodi: prodi_periode_pendaftaran,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPeriodePendaftaran,
  getPeriodePendaftaranByFilter,
  getPeriodePendaftaranBySemesterId,
  getPeriodePendaftaranById,
  getPeriodePendaftaranDibuka,
  createPeriodePendaftaran,
  updatePeriodePerkuliahanById,
  deletePeriodePendaftaranById,
  getPeriodePendaftaranGuestById,
};
