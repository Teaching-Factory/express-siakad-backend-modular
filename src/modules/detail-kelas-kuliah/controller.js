const { DetailKelasKuliah, KelasKuliah, Semester, MataKuliah, Dosen, RuangPerkuliahan, PesertaKelasKuliah, Prodi, MatkulKurikulum } = require("../../../models");

const getAllDetailKelasKuliah = async (req, res, next) => {
  try {
    // Ambil semua data detail_kelas_kuliah dari database
    const detail_kelas_kuliah = await DetailKelasKuliah.findAll({
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah, include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }] }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Kelas Kuliah Success",
      jumlahData: detail_kelas_kuliah.length,
      data: detail_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailKelasKuliahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const DetailKelasKuliahId = req.params.id;

    // Periksa apakah ID disediakan
    if (!DetailKelasKuliahId) {
      return res.status(400).json({
        message: "Detail Kelas Kuliah ID is required",
      });
    }

    // Cari data detail_kelas_kuliah berdasarkan ID di database
    const detail_kelas_kuliah = await DetailKelasKuliah.findByPk(DetailKelasKuliahId, {
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah, include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }, { model: Prodi }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!detail_kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Detail Kelas Kuliah With ID ${DetailKelasKuliahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Detail Kelas Kuliah By ID ${DetailKelasKuliahId} Success:`,
      data: detail_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailKelasKuliahByProdiAndSemesterId = async (req, res, next) => {
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

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // Ambil data detail_kelas_kuliah
    const detail_kelas_kuliah = await DetailKelasKuliah.findAll({
      include: [
        {
          model: KelasKuliah,
          where: {
            id_prodi: prodiId,
            id_semester: semesterId,
          },
          include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }],
        },
        {
          model: RuangPerkuliahan,
        },
      ],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (detail_kelas_kuliah.length === 0) {
      return res.status(404).json({
        message: `<===== Detail Kelas Kuliah With ID Prodi ${prodiId} And ID Semester ${semesterId} Not Found:`,
      });
    }

    const idKelasKuliahList = detail_kelas_kuliah.map((detail) => detail.KelasKuliah.id_kelas_kuliah);

    // Variable to store the counts
    let pesertaKelasCounts = [];

    // Iterate through the list manually
    for (let idKelasKuliah of idKelasKuliahList) {
      let pesertaKelasCount = await PesertaKelasKuliah.findAll({
        where: {
          id_kelas_kuliah: idKelasKuliah,
        },
      });

      let pesertaCount = pesertaKelasCount.length;

      pesertaKelasCounts.push({
        id_kelas_kuliah: idKelasKuliah,
        jumlah_peserta_kelas: pesertaCount,
      });
    }

    // Assign the counts to detail_kelas_kuliah
    detail_kelas_kuliah.forEach((detail) => {
      const countData = pesertaKelasCounts.find((count) => count.id_kelas_kuliah === detail.KelasKuliah.id_kelas_kuliah);
      detail.dataValues.jumlah_peserta_kelas = countData ? countData.jumlah_peserta_kelas : 0;
    });

    // Mengelompokkan data detail_kelas_kuliah berdasarkan mata kuliah
    const groupedDetailKelasKuliah = {};

    detail_kelas_kuliah.forEach((detail) => {
      const mataKuliah = detail.KelasKuliah.MataKuliah;
      const id_matkul = mataKuliah.id_matkul;

      if (!groupedDetailKelasKuliah[id_matkul]) {
        groupedDetailKelasKuliah[id_matkul] = {
          mataKuliah: mataKuliah,
          details: [],
        };
      }
      groupedDetailKelasKuliah[id_matkul].details.push(detail);
    });

    // Menghapus id_matkul dari level atas objek
    const formattedResponse = Object.keys(groupedDetailKelasKuliah).map((key) => ({
      mataKuliah: groupedDetailKelasKuliah[key].mataKuliah,
      details: groupedDetailKelasKuliah[key].details,
    }));

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Detail Kelas Kuliah By ID Prodi ${prodiId} And ID Semester ${semesterId} Success:`,
      jumlahData: detail_kelas_kuliah.length,
      data: formattedResponse,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDetailKelasKuliahBySemesterAndDosenActive = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;
    const user = req.user;

    const dosen = await Dosen.findOne({
      where: {
        nidn: user.username,
      },
    });

    if (!dosen) {
      return res.status(404).json({
        message: "Dosen not found",
      });
    }

    // Ambil semua data detail kelas kuliah dari database
    const detail_kelas_kuliah = await DetailKelasKuliah.findAll({
      include: [
        {
          model: KelasKuliah,
          where: {
            id_semester: semesterId,
            id_dosen: dosen.id_dosen,
          },
          include: [{ model: Semester }, { model: Prodi }, { model: MataKuliah }],
        },
        { model: RuangPerkuliahan },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Detail Kelas Kuliah By Semester And Dosen Active Success",
      jumlahData: detail_kelas_kuliah.length,
      data: detail_kelas_kuliah,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailKelasKuliahByFilter = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;
    const kurikulumId = req.params.id_kurikulum;
    const semester = req.params.semester;

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

    // Periksa apakah ID disediakan
    if (!kurikulumId) {
      return res.status(400).json({
        message: "Kurikulum ID is required",
      });
    }

    // Periksa apakah ID disediakan
    if (!semester) {
      return res.status(400).json({
        message: "Semester Kurikulum is required",
      });
    }

    // Ambil data detail_kelas_kuliah
    const detail_kelas_kuliah = await DetailKelasKuliah.findAll({
      include: [
        {
          model: KelasKuliah,
          where: {
            id_prodi: prodiId,
            id_semester: semesterId,
          },
          include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }],
        },
        {
          model: RuangPerkuliahan,
        },
      ],
    });

    const idKelasKuliahList = detail_kelas_kuliah.map((detail) => detail.KelasKuliah.id_kelas_kuliah);

    // Variable to store the counts
    let pesertaKelasCounts = [];

    // Iterate through the list manually
    for (let idKelasKuliah of idKelasKuliahList) {
      let pesertaKelasCount = await PesertaKelasKuliah.findAll({
        where: {
          id_kelas_kuliah: idKelasKuliah,
        },
      });

      let pesertaCount = pesertaKelasCount.length;

      pesertaKelasCounts.push({
        id_kelas_kuliah: idKelasKuliah,
        jumlah_peserta_kelas: pesertaCount,
      });
    }

    // Assign the counts to detail_kelas_kuliah
    detail_kelas_kuliah.forEach((detail) => {
      const countData = pesertaKelasCounts.find((count) => count.id_kelas_kuliah === detail.KelasKuliah.id_kelas_kuliah);
      detail.dataValues.jumlah_peserta_kelas = countData ? countData.jumlah_peserta_kelas : 0;
    });

    // Ambil semua mata kuliah kurikulum berdasarkan kurikulum
    let matkul_kurikulum = await MatkulKurikulum.findAll({
      where: {
        id_kurikulum: kurikulumId,
        semester: semester,
      },
      include: [{ model: MataKuliah }],
    });

    // Mengelompokkan data berdasarkan mata kuliah dari matkul kurikulum
    const groupedDetailKelasKuliah = {};

    matkul_kurikulum.forEach((matkul) => {
      const mataKuliah = matkul.MataKuliah;
      const id_matkul = mataKuliah.id_matkul;

      if (!groupedDetailKelasKuliah[id_matkul]) {
        groupedDetailKelasKuliah[id_matkul] = {
          mataKuliah: mataKuliah,
          details: [],
        };
      }
    });

    detail_kelas_kuliah.forEach((detail) => {
      const id_matkul = detail.KelasKuliah.MataKuliah.id_matkul;

      if (groupedDetailKelasKuliah[id_matkul]) {
        groupedDetailKelasKuliah[id_matkul].details.push(detail);
      }
    });

    // Menghapus id_matkul dari level atas objek
    const formattedResponse = Object.values(groupedDetailKelasKuliah);

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Detail Kelas Kuliah By ID Prodi ${prodiId} And ID Semester ${semesterId} Success:`,
      jumlahData: formattedResponse.length,
      data: formattedResponse,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetailKelasKuliah,
  getDetailKelasKuliahById,
  getDetailKelasKuliahByProdiAndSemesterId,
  getAllDetailKelasKuliahBySemesterAndDosenActive,
  getDetailKelasKuliahByFilter,
};
