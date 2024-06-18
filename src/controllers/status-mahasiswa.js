const { Sequelize } = require("sequelize");
const { StatusMahasiswa, Mahasiswa, Periode, Prodi, Angkatan } = require("../../models");

const getAllStatusMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data status_mahasiswa dari database
    const status_mahasiswa = await StatusMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Status Mahasiswa Success",
      jumlahData: status_mahasiswa.length,
      data: status_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getStatusMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const StatusMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!StatusMahasiswaId) {
      return res.status(400).json({
        message: "Status Mahasiswa ID is required",
      });
    }

    // Cari data status_mahasiswa berdasarkan ID di database
    const status_mahasiswa = await StatusMahasiswa.findByPk(StatusMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!status_mahasiswa) {
      return res.status(404).json({
        message: `<===== Status Mahasiswa With ID ${StatusMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Status Mahasiswa By ID ${StatusMahasiswaId} Success:`,
      data: status_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getProdiWithCountMahasiswaBelumSetSK = async (req, res, next) => {
  try {
    // Ambil data semua prodi beserta jumlah mahasiswa yang memiliki nama_status_mahasiswa Non-Aktif
    const prodiData = await Prodi.findAll({
      include: {
        model: Periode,
        include: {
          model: Mahasiswa,
          where: {
            nama_status_mahasiswa: "Non-Aktif",
          },
          required: false,
        },
      },
    });

    // Siapkan data untuk respons
    const result = prodiData.map((prodi) => {
      const jumlahMahasiswa = prodi.Periodes.reduce((count, periode) => count + periode.Mahasiswas.length, 0);
      return {
        id_prodi: prodi.id_prodi,
        nama_prodi: prodi.nama_program_studi,
        status: prodi.status,
        jumlahMahasiswa,
      };
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "GET ALL Prodi With Count Mahasiswa Belum Set SK Success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getPeriodeByProdiIdWithCountMahasiswa = async (req, res, next) => {
  try {
    const prodiId = req.params.id_prodi;

    // Ambil semua data periode dari database berdasarkan id_prodi
    const periodeList = await Periode.findAll({
      where: {
        id_prodi: prodiId,
      },
    });

    // Konversi periode_pelaporan dari periodeList menjadi format tahun yang sesuai
    const periodePelaporanList = periodeList.map((p) => p.periode_pelaporan.toString().substring(0, 4));

    // Ambil semua data mahasiswa yang memiliki nama_periode_masuk sesuai dengan periodePelaporanList
    const mahasiswaList = await Mahasiswa.findAll({
      include: [
        {
          model: Periode,
          where: {
            periode_pelaporan: {
              [Sequelize.Op.or]: periodePelaporanList.map((period) => ({
                [Sequelize.Op.like]: `${period}%`,
              })),
            },
          },
        },
      ],
    });

    // Buat peta untuk menghitung jumlah mahasiswa per periode
    const mahasiswaCountMap = mahasiswaList.reduce((acc, mahasiswa) => {
      const periodeMasuk = mahasiswa.nama_periode_masuk.substring(0, 4);
      const periodePelaporan = mahasiswa.Periode.periode_pelaporan.toString().substring(0, 4);

      if (periodePelaporanList.includes(periodePelaporan)) {
        if (!acc[periodePelaporan]) {
          acc[periodePelaporan] = { jumlahMahasiswa: 0, jumlahMahasiswaBelumSetSK: 0 };
        }
        acc[periodePelaporan].jumlahMahasiswa += 1;
        if (mahasiswa.nama_status_mahasiswa === "Non-Aktif") {
          acc[periodePelaporan].jumlahMahasiswaBelumSetSK += 1;
        }
      }
      return acc;
    }, {});

    // Ambil data angkatan yang sesuai dengan tahun periode_pelaporan
    const angkatan = await Angkatan.findAll({
      where: {
        tahun: {
          [Sequelize.Op.in]: periodePelaporanList,
        },
      },
    });

    // Gabungkan data angkatan dengan jumlah mahasiswa
    const result = angkatan.map((angkatanItem) => {
      const counts = mahasiswaCountMap[angkatanItem.tahun] || { jumlahMahasiswa: 0, jumlahMahasiswaBelumSetSK: 0 };

      return {
        id_angkatan: angkatanItem.id, // Ubah sesuai dengan nama kolom yang sesuai
        tahun: angkatanItem.tahun,
        jumlahMahasiswa: counts.jumlahMahasiswa,
        jumlahMahasiswaBelumSetSK: counts.jumlahMahasiswaBelumSetSK,
      };
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET All Angkatan By Prodi ID ${prodiId} With Count Mahasiswa Success`,
      jumlahData: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const setStatusAktif = async (req, res, next) => {
  try {
    const mahasiswas = req.body.mahasiswas; // Ambil mahasiswas dari body request

    for (const mahasiswa of mahasiswas) {
      const data_mahasiswa = await Mahasiswa.findByPk(mahasiswa.id_registrasi_mahasiswa);

      // Periksa apakah data_mahasiswa ditemukan
      if (!data_mahasiswa) {
        return res.status(404).json({ message: `Mahasiswa dengan ID ${mahasiswa.id_registrasi_mahasiswa} tidak ditemukan` });
      }

      // update data mahasiswa
      data_mahasiswa.nama_status_mahasiswa = "Aktif";
      await data_mahasiswa.save();
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "SET Status Aktif Mahasiswa Success",
      jumlahData: mahasiswas.length,
    });
  } catch (error) {
    next(error);
  }
};

const setStatusCuti = async (req, res, next) => {
  try {
    const mahasiswas = req.body.mahasiswas; // Ambil mahasiswas dari body request

    for (const mahasiswa of mahasiswas) {
      const data_mahasiswa = await Mahasiswa.findByPk(mahasiswa.id_registrasi_mahasiswa);

      // Periksa apakah data_mahasiswa ditemukan
      if (!data_mahasiswa) {
        return res.status(404).json({ message: `Mahasiswa dengan ID ${mahasiswa.id_registrasi_mahasiswa} tidak ditemukan` });
      }

      // update data mahasiswa
      data_mahasiswa.nama_status_mahasiswa = "Cuti";
      await data_mahasiswa.save();
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "SET Status Cuti Mahasiswa Success",
      jumlahData: mahasiswas.length,
    });
  } catch (error) {
    next(error);
  }
};

const setStatusNonAktif = async (req, res, next) => {
  try {
    const mahasiswas = req.body.mahasiswas; // Ambil mahasiswas dari body request

    for (const mahasiswa of mahasiswas) {
      const data_mahasiswa = await Mahasiswa.findByPk(mahasiswa.id_registrasi_mahasiswa);

      // Periksa apakah data_mahasiswa ditemukan
      if (!data_mahasiswa) {
        return res.status(404).json({ message: `Mahasiswa dengan ID ${mahasiswa.id_registrasi_mahasiswa} tidak ditemukan` });
      }

      // update data mahasiswa
      data_mahasiswa.nama_status_mahasiswa = "Non-Aktif";
      await data_mahasiswa.save();
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "SET Status Non-Aktif Mahasiswa Success",
      jumlahData: mahasiswas.length,
    });
  } catch (error) {
    next(error);
  }
};

const updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId = async (req, res, next) => {
  try {
    // Dapatkan ID prodi dari parameter permintaan
    const prodiId = req.params.id_prodi;
    const angkatanId = req.params.id_angkatan;

    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!angkatanId) {
      return res.status(400).json({
        message: "Angkatan ID is required",
      });
    }

    const angkatan = await Angkatan.findByPk(angkatanId);

    // Cari data mahasiswa berdasarkan id_periode yang ada dalam periodeIdList
    const mahasiswas = await Mahasiswa.findAll({
      include: [
        {
          model: Periode,
          where: {
            id_prodi: prodiId,
          },
        },
      ],
      where: {
        // Gunakan Sequelize literal untuk melakukan substring pada kolom nama_periode_masuk
        [Sequelize.Op.and]: [Sequelize.where(Sequelize.literal(`substring(nama_periode_masuk, 1, 4)`), angkatan.tahun.toString())],
      },
    });

    // Jika data mahasiswa tidak ditemukan, kirim respons 404
    if (!mahasiswas || mahasiswas.length === 0) {
      return res.status(404).json({
        message: `Mahasiswa dengan prodi ID ${prodiId} dan Angkatan ID ${angkatanId} tidak ditemukan`,
      });
    }

    // Ambil ID dari data mahasiswa yang ditemukan
    const mahasiswaIds = mahasiswas.map((mahasiswa) => mahasiswa.id_registrasi_mahasiswa);

    // Update status mahasiswa menjadi "Non-Aktif"
    const [updatedCount] = await Mahasiswa.update(
      { nama_status_mahasiswa: "Non-Aktif" },
      {
        where: {
          id_registrasi_mahasiswa: mahasiswaIds,
        },
      }
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `UPDATE Status Mahasiswa Nonaktif By Prodi ID ${prodiId} dan Angkatan ID ${angkatanId} Success`,
      jumlahData: updatedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStatusMahasiswa,
  getStatusMahasiswaById,
  getProdiWithCountMahasiswaBelumSetSK,
  getPeriodeByProdiIdWithCountMahasiswa,
  setStatusAktif,
  setStatusCuti,
  setStatusNonAktif,
  updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId,
};
