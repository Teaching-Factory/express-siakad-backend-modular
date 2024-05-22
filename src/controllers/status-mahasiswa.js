const { StatusMahasiswa } = require("../../models");
const { Mahasiswa } = require("../../models");
const { Periode } = require("../../models");

const getAllStatusMahasiswa = async (req, res) => {
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

const getStatusMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const StatusMahasiswaId = req.params.id;

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

const updateAllStatusMahasiswaNonaktifByProdiId = async (req, res, next) => {
  try {
    // Dapatkan ID prodi dari parameter permintaan
    const prodiId = req.params.id_prodi;

    // Cari semua periode yang memiliki id_prodi sesuai dengan id_prodi yang diberikan
    const periodeIds = await Periode.findAll({
      where: { id_prodi: prodiId },
      attributes: ["id_periode"], // Ambil hanya kolom id_periode
    });

    // Ekstrak id periode dari hasil pencarian
    const periodeIdList = periodeIds.map((periode) => periode.id_periode);

    // Jika tidak ada periode yang ditemukan, kirim respons 404
    if (periodeIdList.length === 0) {
      return res.status(404).json({
        message: `Tidak ada periode dengan id_prodi ${prodiId}`,
      });
    }

    // Cari data mahasiswa berdasarkan id_periode yang ada dalam periodeIdList
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_periode: periodeIdList,
      },
    });

    // Jika data mahasiswa tidak ditemukan, kirim respons 404
    if (!mahasiswas || mahasiswas.length === 0) {
      return res.status(404).json({
        message: `Mahasiswa dengan prodi ID ${prodiId} tidak ditemukan`,
      });
    }

    // Update status mahasiswa menjadi "nonaktif"
    const [updatedCount] = await Mahasiswa.update(
      { nama_status_mahasiswa: "Non-Aktif" },
      {
        where: {
          id_periode: periodeIdList,
        },
      }
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `UPDATE Status Mahasiswa Nonaktif By Prodi ID ${prodiId} Success`,
      jumlahData: updatedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStatusMahasiswa,
  getStatusMahasiswaById,
  setStatusAktif,
  setStatusCuti,
  setStatusNonAktif,
  updateAllStatusMahasiswaNonaktifByProdiId,
};
