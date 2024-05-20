const { KRSMahasiswa, TahunAjaran, Periode, Mahasiswa, Sequelize } = require("../../models");

const getAllKRSMahasiswa = async (req, res) => {
  try {
    // Ambil semua data krs_mahasiswa dari database
    const krs_mahasiswa = await KRSMahasiswa.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All KRS Mahasiswa Success",
      jumlahData: krs_mahasiswa.length,
      data: krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getKRSMahasiswaById = async (req, res) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const KRSMahasiswaId = req.params.id;

    // Cari data krs_mahasiswa berdasarkan ID di database
    const krs_mahasiswa = await KRSMahasiswa.findByPk(KRSMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!krs_mahasiswa) {
      return res.status(404).json({
        message: `<===== KRS Mahasiswa With ID ${KRSMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET KRS Mahasiswa By ID ${KRSMahasiswaId} Success:`,
      data: krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getKRSMahasiswaByMahasiswaId = async (req, res, next) => {
  try {
    // Mengambil data tahun ajaran yang kolom a_periode bernilai = 1
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Jika data tahun ajaran tidak ditemukan, kirim respons 404
    if (!tahunAjaran) {
      return res.status(404).json({
        message: "Tahun Ajaran with a_periode 1 not found",
      });
    }

    // Dapatkan ID dari parameter permintaan
    const idRegistrasiMahasiswa = req.params.id_registrasi_mahasiswa;

    // Cari data krs_mahasiswa berdasarkan id_registrasi_mahasiswa dan id_tahun_ajaran di database
    const krsMahasiswa = await KRSMahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: idRegistrasiMahasiswa,
        angkatan: tahunAjaran.id_tahun_ajaran,
      },
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!krsMahasiswa || krsMahasiswa.length === 0) {
      return res.status(404).json({
        message: `<===== KRS Mahasiswa With ID ${idRegistrasiMahasiswa} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET KRS Mahasiswa By ID ${idRegistrasiMahasiswa} Success:`,
      jumlahData: krsMahasiswa.length,
      data: krsMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMahasiswaKRSByPeriode = async (req, res, next) => {
  try {
    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua periode yang sesuai dengan tahun awal
    const periodes = await Periode.findAll({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_periode dari hasil query periode
    const idPeriodes = periodes.map((periode) => periode.id_periode);

    // Ambil data KRS mahasiswa berdasarkan id_periode yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_periode: idPeriodes,
      },
    });

    // Ekstrak id_registrasi_mahasiswa dan simpan dalam sebuah Set untuk menghindari duplikasi
    const idRegistrasiMahasiswas = new Set(krs_mahasiswas.map((krs) => krs.id_registrasi_mahasiswa));

    // Ambil data mahasiswa berdasarkan id_registrasi_mahasiswa yang unik
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: Array.from(idRegistrasiMahasiswas),
      },
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Mahasiswa KRS By Periode Success",
      jumlahData: mahasiswas.length,
      data: mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const GetKRSMahasiswaByMahasiswaPeriode = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const mahasiswaId = req.params.id_registrasi_mahasiswa;

    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua periode yang sesuai dengan tahun awal
    const periodes = await Periode.findAll({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_periode dari hasil query periode
    const idPeriodes = periodes.map((periode) => periode.id_periode);

    // Ambil data KRS mahasiswa berdasarkan id_periode yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_periode: idPeriodes,
        id_registrasi_mahasiswa: mahasiswaId,
      },
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All KRS Mahasiswa By Mahasiswa Periode Success",
      jumlahData: krs_mahasiswas.length,
      data: krs_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const deleteKRSMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const krsMahasiswaId = req.params.id;

    // Cari data krs_mahasiswa berdasarkan ID di database
    let krs_mahasiswa = await KRSMahasiswa.findByPk(krsMahasiswaId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!krs_mahasiswa) {
      return res.status(404).json({
        message: `<===== KRS Mahasiswa With ID ${krsMahasiswaId} Not Found:`,
      });
    }

    // Hapus data krs_mahasiswa dari database
    await krs_mahasiswa.destroy();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== DELETE KRS Mahasiswa With ID ${krsMahasiswaId} Success:`,
    });
  } catch (error) {
    next(error);
  }
};

const ValidasiKRSMahasiswa = async (req, res, next) => {
  try {
    // Dapatkan array mahasiswa dari body permintaan
    const mahasiswas = req.body.mahasiswas;
    let krs_mahasiswas = [];

    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua periode yang sesuai dengan tahun awal
    const periodes = await Periode.findAll({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_periode dari hasil query periode
    const idPeriodes = periodes.map((periode) => periode.id_periode);

    // Lakukan iterasi melalui setiap objek mahasiswa
    for (const mahasiswa of mahasiswas) {
      // Ambil ID registrasi mahasiswa dari objek mahasiswa saat ini
      const id_registrasi_mahasiswa = mahasiswa.id_registrasi_mahasiswa;

      // Ambil data KRS mahasiswa berdasarkan id_periode dan id_registrasi_mahasiswa
      const krs_mahasiswa = await KRSMahasiswa.findAll({
        where: {
          id_periode: idPeriodes,
          id_registrasi_mahasiswa: id_registrasi_mahasiswa,
        },
      });

      // Tambahkan data KRS mahasiswa ke array krs_mahasiswas
      krs_mahasiswas = krs_mahasiswas.concat(krs_mahasiswa);
    }

    // Lakukan iterasi melalui setiap objek KRS mahasiswa yang sudah diambil
    for (const krs_mahasiswa of krs_mahasiswas) {
      // Ubah nilai validasi_krs menjadi true
      await krs_mahasiswa.update({ validasi_krs: true });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== VALIDASI KRS Mahasiswa Success",
      jumlahData: krs_mahasiswas.length,
      data: krs_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

const BatalkanValidasiKRSMahasiswa = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const mahasiswaId = req.params.id_registrasi_mahasiswa;

    // Ambil tahun ajaran yang sesuai dengan kondisi
    const tahunAjaran = await TahunAjaran.findOne({
      where: {
        a_periode: 1,
      },
    });

    // Ekstrak tahun awal dari nama_tahun_ajaran
    const [tahunAwal] = tahunAjaran.nama_tahun_ajaran.split("/");

    // Ambil semua periode yang sesuai dengan tahun awal
    const periodes = await Periode.findAll({
      where: {
        periode_pelaporan: {
          [Sequelize.Op.like]: `${tahunAwal}%`,
        },
      },
    });

    // Ambil semua id_periode dari hasil query periode
    const idPeriodes = periodes.map((periode) => periode.id_periode);

    // Ambil data KRS mahasiswa berdasarkan id_periode yang didapatkan
    const krs_mahasiswas = await KRSMahasiswa.findAll({
      where: {
        id_periode: idPeriodes,
        id_registrasi_mahasiswa: mahasiswaId,
      },
    });

    // Lakukan iterasi melalui setiap objek KRS mahasiswa yang sudah diambil
    for (const krs_mahasiswa of krs_mahasiswas) {
      await krs_mahasiswa.update({ validasi_krs: false });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== Batalkan VALIDASI KRS Mahasiswa Success",
      jumlahData: krs_mahasiswas.length,
      data: krs_mahasiswas,
    });
  } catch (error) {
    next(error);
  }
};

// const createKrsMahasiswa = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses create krs mahasiswa",
//   });
// };

// const getAllMahasiswaBelumKrs = (req, res) => {
//   res.json({
//     message: "Berhasil mengakses get all mahasiswa belum krs",
//   });
// };

module.exports = {
  getAllKRSMahasiswa,
  getKRSMahasiswaById,
  getKRSMahasiswaByMahasiswaId,
  getAllMahasiswaKRSByPeriode,
  GetKRSMahasiswaByMahasiswaPeriode,
  deleteKRSMahasiswaById,
  ValidasiKRSMahasiswa,
  BatalkanValidasiKRSMahasiswa,
  // createKrsMahasiswa,
  // getAllMahasiswaBelumKrs,
};
