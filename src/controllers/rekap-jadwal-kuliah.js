const { DetailKelasKuliah, KelasKuliah, MataKuliah, MatkulKurikulum, RuangPerkuliahan, Dosen } = require("../../models");

const getRekapJadwalKuliahByFilter = async (req, res, next) => {
  const { id_prodi, id_kurikulum, id_semester, semester, tanggal_penandatanganan } = req.query;

  if (!id_prodi) {
    return res.status(400).json({ message: "id_prodi is required" });
  }
  if (!id_kurikulum) {
    return res.status(400).json({ message: "id_kurikulum is required" });
  }
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }
  if (!semester) {
    return res.status(400).json({ message: "semester is required" });
  }
  if (!tanggal_penandatanganan) {
    return res.status(400).json({ message: "tanggal_penandatanganan is required" });
  }

  try {
    // Ambil data matkul kurikulum
    const matkul_kurikulums = await MatkulKurikulum.findAll({
      where: {
        id_kurikulum: id_kurikulum,
        semester: semester,
      },
      include: [{ model: MataKuliah }],
    });

    // Ekstrak id_matkul dari matkul_kurikulums
    const id_matkul_list = matkul_kurikulums.map((mk) => mk.MataKuliah.id_matkul);

    // Ambil data detail kelas kuliah sesuai dengan mata kuliah yang diperoleh
    const detail_kelas_kuliahs = await DetailKelasKuliah.findAll({
      include: [
        {
          model: KelasKuliah,
          where: {
            id_semester: id_semester,
            id_prodi: id_prodi,
            id_matkul: id_matkul_list,
          },
          include: [{ model: Dosen }, { model: MataKuliah }],
        },
        { model: RuangPerkuliahan },
      ],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET Rekap Jadwal Kuliah By Filter Success",
      tanggal_penandatanganan: tanggal_penandatanganan,
      jumlahData: detail_kelas_kuliahs.length,
      data: detail_kelas_kuliahs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRekapJadwalKuliahByFilter,
};
