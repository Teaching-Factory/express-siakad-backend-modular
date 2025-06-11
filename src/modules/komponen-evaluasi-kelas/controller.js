const { KomponenEvaluasiKelas, JenisEvaluasi, MataKuliah, KelasKuliah, RencanaEvaluasi } = require("../../../models");

const getAllKomponenEvaluasiKelas = async (req, res, next) => {
  try {
    // Ambil semua data komponen_evaluasi_kelas dari database
    const komponen_evaluasi_kelas = await KomponenEvaluasiKelas.findAll({
      include: [{ model: JenisEvaluasi }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Komponen Evaluasi Kelas Success",
      jumlahData: komponen_evaluasi_kelas.length,
      data: komponen_evaluasi_kelas,
    });
  } catch (error) {
    next(error);
  }
};

const getKomponenEvaluasiKelasById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const komponenEvaluasiKelas = req.params.id;

    if (!komponenEvaluasiKelas) {
      return res.status(400).json({
        message: "Komponen Evaluasi Kelas ID is required",
      });
    }

    // Cari data komponen_evaluasi_kelas berdasarkan ID di database
    const komponen_evaluasi_kelas = await KomponenEvaluasiKelas.findByPk(komponenEvaluasiKelas, {
      include: [{ model: JenisEvaluasi }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!komponen_evaluasi_kelas) {
      return res.status(404).json({
        message: `<===== Komponen Evaluasi Kelas With ID ${komponenEvaluasiKelas} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Komponen Evaluasi Kelas By ID ${komponenEvaluasiKelas} Success:`,
      data: komponen_evaluasi_kelas,
    });
  } catch (error) {
    next(error);
  }
};

const getKomponenEvaluasiKelasByKelasKuliahId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    // Cari data komponen_evaluasi_kelas berdasarkan ID di database
    const komponen_evaluasi_kelas = await KomponenEvaluasiKelas.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      include: [{ model: JenisEvaluasi }],
      order: [
        ["nomor_urut", "ASC"], // Urutkan berdasarkan nomor_urut secara ascending
      ],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!komponen_evaluasi_kelas) {
      return res.status(404).json({
        message: `<===== Komponen Evaluasi Kelas With Mata Kuliah ID ${kelasKuliahId} Not Found:`,
      });
    }

    // Tambahkan variabel bobot_penilaian untuk setiap item
    const dataWithBobotPenilaian = komponen_evaluasi_kelas.map((item) => ({
      ...item.dataValues,
      bobot_penilaian: parseFloat(item.bobot_evaluasi) * 100, // Konversi bobot_evaluasi menjadi bobot_penilaian
    }));

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Komponen Evaluasi Kelas By Mata Kuliah ID ${kelasKuliahId} Success:`,
      jumlahData: dataWithBobotPenilaian.length,
      data: dataWithBobotPenilaian,
    });
  } catch (error) {
    next(error);
  }
};

const createOrUpdateKomponenEvaluasiKelas = async (req, res, next) => {
  try {
    // Dapatkan ID kelas kuliah dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    const { komponen_evaluasi_kelas } = req.body;

    // Validasi komponen_evaluasi_kelas
    if (!komponen_evaluasi_kelas || !Array.isArray(komponen_evaluasi_kelas) || komponen_evaluasi_kelas.length === 0) {
      return res.status(400).json({ message: "Invalid or empty komponen_evaluasi_kelas data" });
    }

    // Validasi total bobot harus 100
    const totalBobot = komponen_evaluasi_kelas.reduce((total, item) => total + item.bobot_evaluasi, 0);

    if (totalBobot !== 100) {
      return res.status(400).json({
        message: `Invalid total bobot. Harus berjumlah 100, bobot sebelumnya ${totalBobot}`,
      });
    }

    // Proses create atau update
    const processedKomponenEvaluasiKelas = [];
    for (const evaluasi of komponen_evaluasi_kelas) {
      // Cari apakah data sudah ada berdasarkan id_kelas_kuliah dan nomor_urut
      const existingRecord = await KomponenEvaluasiKelas.findOne({
        where: {
          id_kelas_kuliah: kelasKuliahId,
          nomor_urut: evaluasi.nomor_urut,
          id_jenis_evaluasi: evaluasi.id_jenis_evaluasi,
        },
      });

      // konvert bobot evaluasi
      let bobot_penilaian = evaluasi.bobot_evaluasi / 100;

      if (existingRecord) {
        // Jika data ada, lakukan update
        await existingRecord.update({
          id_jenis_evaluasi: evaluasi.id_jenis_evaluasi,
          id_kelas_kuliah: evaluasi.id_kelas_kuliah,
          nomor_urut: evaluasi.nomor_urut,
          nama: evaluasi.nama,
          bobot_evaluasi: bobot_penilaian,
          nama_inggris: evaluasi.nama_inggris,
        });
        processedKomponenEvaluasiKelas.push({ record: existingRecord, created: false });
      } else {
        // Jika data tidak ada, lakukan create
        const newRecord = await KomponenEvaluasiKelas.create({
          id_jenis_evaluasi: evaluasi.id_jenis_evaluasi,
          id_kelas_kuliah: kelasKuliahId,
          nomor_urut: evaluasi.nomor_urut,
          nama: evaluasi.nama,
          bobot_evaluasi: bobot_penilaian,
          nama_inggris: evaluasi.nama_inggris,
        });
        processedKomponenEvaluasiKelas.push({ record: newRecord, created: true });
      }
    }

    // Cari data komponen_evaluasi_kelas_ordered berdasarkan ID di database
    const komponen_evaluasi_kelas_ordered = processedKomponenEvaluasiKelas.sort((a, b) => {
      return a.record.nomor_urut - b.record.nomor_urut;
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== Komponen Evaluasi Kelas By Kelas Kuliah ID ${kelasKuliahId} Successfully Processed`,
      total_processed: komponen_evaluasi_kelas_ordered.length,
      data: komponen_evaluasi_kelas_ordered,
    });
  } catch (error) {
    next(error);
  }
};

const copyKomponenEvaluasiKelasByMataKuliah = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    // get data kelas kuliah
    const kelasKuliah = await KelasKuliah.findOne({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
    });

    if (!kelasKuliah) {
      return res.status(400).json({
        message: "Kelas Kuliah not found",
      });
    }

    // get data mata kuliah
    const mataKuliah = await MataKuliah.findOne({
      where: {
        id_matkul: kelasKuliah.id_matkul,
      },
    });

    if (!mataKuliah) {
      return res.status(400).json({
        message: "Mata Kuliah not found",
      });
    }

    // get data rencana evaluasi
    const rencanaEvaluasis = await RencanaEvaluasi.findAll({
      where: {
        id_matkul: mataKuliah.id_matkul,
      },
    });

    // get komponen evaluasi kelas, jika tidak ada sama sekali, maka dapat melakukan salin
    const komponen_evaluasi_kelas = await KomponenEvaluasiKelas.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
    });

    const processedKomponenEvaluasiKelas = [];

    // pengecekan komponen evaluasi
    if (komponen_evaluasi_kelas.length > 0) {
      return res.status(400).json({
        message: "Komponen evaluasi sudah ada, silahkan gunakan fungsi update",
      });
    } else {
      // salin data rencana evaluasi ke dalam data komponen evaluasi kelas
      for (const rencana of rencanaEvaluasis) {
        // konvert bobot evaluasi
        let bobot_penilaian = rencana.bobot_evaluasi / 100;

        const newRecord = await KomponenEvaluasiKelas.create({
          id_kelas_kuliah: kelasKuliahId,
          id_jenis_evaluasi: rencana.id_jenis_evaluasi,
          nomor_urut: rencana.nomor_urut,
          nama: rencana.nama_evaluasi,
          bobot_evaluasi: bobot_penilaian,
          nama_inggris: rencana.deskripsi_inggris,
        });
        processedKomponenEvaluasiKelas.push(newRecord);
      }
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Salin Komponen Evaluasi Kelas By Mata Kuliah Success",
      jumlahData: processedKomponenEvaluasiKelas.length,
      data: processedKomponenEvaluasiKelas,
    });
  } catch (error) {
    next(error);
  }
};

const deleteKomponenEvaluasiKelasById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const komponenEvaluasiKelasId = req.params.id_komponen_evaluasi;

    if (!komponenEvaluasiKelasId) {
      return res.status(400).json({
        message: "Komponen Evaluasi Kelas ID is required",
      });
    }

    // Cari data komponen_evaluasi_kelas berdasarkan ID di database
    let komponen_evaluasi_kelas = await KomponenEvaluasiKelas.findOne({
      where: {
        id_komponen_evaluasi: komponenEvaluasiKelasId,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!komponen_evaluasi_kelas) {
      return res.status(404).json({
        message: `<===== Komponen Evaluasi Kelas With ID ${komponenEvaluasiKelasId} Not Found:`,
      });
    }

    // Hapus data komponen_evaluasi_kelas dari database
    await komponen_evaluasi_kelas.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Komponen Evaluasi Kelas With ID ${komponenEvaluasiKelasId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKomponenEvaluasiKelas,
  getKomponenEvaluasiKelasById,
  getKomponenEvaluasiKelasByKelasKuliahId,
  createOrUpdateKomponenEvaluasiKelas,
  copyKomponenEvaluasiKelasByMataKuliah,
  deleteKomponenEvaluasiKelasById,
};
