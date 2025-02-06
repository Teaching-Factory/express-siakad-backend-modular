const { RencanaEvaluasi, MataKuliah, Prodi, JenisEvaluasi } = require("../../models");

const getAllRencanaEvaluasi = async (req, res, next) => {
  try {
    // Ambil semua data rencana_evaluasis dari database
    const rencana_evaluasis = await RencanaEvaluasi.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rencana Evaluasi Success",
      jumlahData: rencana_evaluasis.length,
      data: rencana_evaluasis,
    });
  } catch (error) {
    next(error);
  }
};

const getRencanaEvaluasiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const rencanaEvaluasiId = req.params.id;

    if (!rencanaEvaluasiId) {
      return res.status(400).json({
        message: "Rencana Evaluasi ID is required",
      });
    }

    // Cari data rencana_evaluasi berdasarkan ID di database
    const rencana_evaluasi = await RencanaEvaluasi.findByPk(rencanaEvaluasiId, {
      include: [{ model: MataKuliah, include: [{ model: Prodi }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rencana_evaluasi) {
      return res.status(404).json({
        message: `<===== Rencana Evaluasi With ID ${rencanaEvaluasiId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rencana Evaluasi By ID ${rencanaEvaluasiId} Success:`,
      data: rencana_evaluasi,
    });
  } catch (error) {
    next(error);
  }
};

const getRencanaEvaluasiByMataKuliahId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const mataKuliahId = req.params.id_matkul;

    if (!mataKuliahId) {
      return res.status(400).json({
        message: "Mata Kuliah ID is required",
      });
    }

    // Cari data rencana_evaluasis berdasarkan ID di database
    const rencana_evaluasis = await RencanaEvaluasi.findAll({
      where: {
        id_matkul: mataKuliahId,
      },
      include: [{ model: MataKuliah }, { model: JenisEvaluasi }],
      order: [
        ["nomor_urut", "ASC"], // Urutkan berdasarkan nomor_urut secara ascending
      ],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rencana_evaluasis) {
      return res.status(404).json({
        message: `<===== Rencana Evaluasi With Mata Kuliah ID ${mataKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rencana Evaluasi By Mata Kuliah ID ${mataKuliahId} Success:`,
      jumlahData: rencana_evaluasis.length,
      data: rencana_evaluasis,
    });
  } catch (error) {
    next(error);
  }
};

const createOrUpdateRencanaEvaluasi = async (req, res, next) => {
  try {
    // Dapatkan ID mata kuliah dari parameter permintaan
    const mataKuliahId = req.params.id_matkul;

    if (!mataKuliahId) {
      return res.status(400).json({
        message: "Mata Kuliah ID is required",
      });
    }

    const { rencana_evaluasis } = req.body;

    // Validasi rencana_evaluasis
    if (!rencana_evaluasis || !Array.isArray(rencana_evaluasis) || rencana_evaluasis.length === 0) {
      return res.status(400).json({ message: "Invalid or empty rencana_evaluasis data" });
    }

    // Validasi total bobot harus 100
    const totalBobot = rencana_evaluasis.reduce((total, item) => total + item.bobot_evaluasi, 0);
    if (totalBobot !== 100) {
      return res.status(400).json({
        message: `Invalid total bobot. Harus berjumlah 100, bobot sebelumnya ${totalBobot}`,
      });
    }

    // Proses create atau update
    const processedRencanaEvaluasis = [];
    for (const evaluasi of rencana_evaluasis) {
      // Cari apakah data sudah ada berdasarkan id_matkul dan nomor_urut
      const existingRecord = await RencanaEvaluasi.findOne({
        where: {
          id_matkul: mataKuliahId,
          nomor_urut: evaluasi.nomor_urut,
          id_jenis_evaluasi: evaluasi.id_jenis_evaluasi,
        },
      });

      if (existingRecord) {
        // Jika data ada, lakukan update
        await existingRecord.update({
          id_jenis_evaluasi: evaluasi.id_jenis_evaluasi,
          nama_evaluasi: evaluasi.nama_evaluasi,
          bobot_evaluasi: evaluasi.bobot_evaluasi,
          deskripsi_indonesia: evaluasi.deskripsi_indonesia,
          deskripsi_inggris: evaluasi.deskripsi_inggris,
        });
        processedRencanaEvaluasis.push({ record: existingRecord, created: false });
      } else {
        // Jika data tidak ada, lakukan create
        const newRecord = await RencanaEvaluasi.create({
          id_matkul: mataKuliahId,
          nomor_urut: evaluasi.nomor_urut,
          id_jenis_evaluasi: evaluasi.id_jenis_evaluasi,
          nama_evaluasi: evaluasi.nama_evaluasi,
          bobot_evaluasi: evaluasi.bobot_evaluasi,
          deskripsi_indonesia: evaluasi.deskripsi_indonesia,
          deskripsi_inggris: evaluasi.deskripsi_inggris,
        });
        processedRencanaEvaluasis.push({ record: newRecord, created: true });
      }
    }

    // Cari data rencana_evaluasi_ordered berdasarkan ID di database
    const rencana_evaluasi_ordered = processedRencanaEvaluasis.sort((a, b) => {
      return a.record.nomor_urut - b.record.nomor_urut;
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== Rencana Evaluasi By Mata Kuliah ID ${mataKuliahId} Successfully Processed`,
      total_processed: rencana_evaluasi_ordered.length,
      data: rencana_evaluasi_ordered,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRencanaEvaluasiById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const rencanaEvaluasiId = req.params.id_rencana_evaluasi;

    if (!rencanaEvaluasiId) {
      return res.status(400).json({
        message: "Rencana Evaluasi ID is required",
      });
    }

    // Cari data rencana_evaluasi berdasarkan ID di database
    let rencana_evaluasi = await RencanaEvaluasi.findOne({
      where: {
        id_rencana_evaluasi: rencanaEvaluasiId,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rencana_evaluasi) {
      return res.status(404).json({
        message: `<===== Rencana Evaluasi With ID ${rencanaEvaluasiId} Not Found:`,
      });
    }

    // Hapus data rencana_evaluasi dari database
    await rencana_evaluasi.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE Rencana Evaluasi With ID ${rencanaEvaluasiId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRencanaEvaluasi,
  getRencanaEvaluasiById,
  getRencanaEvaluasiByMataKuliahId,
  createOrUpdateRencanaEvaluasi,
  deleteRencanaEvaluasiById,
};
