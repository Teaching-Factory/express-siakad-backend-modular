const { Sequelize } = require("sequelize");
const { StatusMahasiswa, Mahasiswa, Prodi, Angkatan, sequelize, Role, UserRole, AdminProdi, PerkuliahanMahasiswa, SettingGlobalSemester } = require("../../models");
const { Op } = require("sequelize");

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
    // Ambil data semua prodi beserta jumlah mahasiswa yang memiliki nama_status_mahasiswa Aktif
    const prodiData = await Prodi.findAll({
      include: {
        model: Mahasiswa,
        where: {
          [Op.or]: [{ nama_status_mahasiswa: "Aktif" }, { nama_status_mahasiswa: "AKTIF" }],
        },
        required: false,
      },
    });

    // ambil semua jumlah mahasiswa setiap prodi
    const prodi_mahasiswas = await Prodi.findAll({
      include: [{ model: Mahasiswa }],
    });

    // Siapkan data untuk respons
    const result = prodiData.map((prodi) => {
      const prodiMahasiswa = prodi_mahasiswas.find((p) => p.id_prodi === prodi.id_prodi);
      const jumlahMahasiswa = prodiMahasiswa ? prodiMahasiswa.Mahasiswas.length : 0;
      const jumlahMahasiswaBelumSetSK = prodi.Mahasiswas.length;
      return {
        id_prodi: prodi.id_prodi,
        nama_prodi: prodi.nama_program_studi,
        status: prodi.status,
        jumlahMahasiswa,
        jumlahMahasiswaBelumSetSK,
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

const getProdiWithCountMahasiswaBelumSetSKByAdminProdi = async (req, res, next) => {
  try {
    const user = req.user;

    // get role user active
    const roleAdminProdi = await Role.findOne({
      where: { nama_role: "admin-prodi" },
    });

    if (!roleAdminProdi) {
      return res.status(404).json({
        message: "Role Admin Prodi not found",
      });
    }

    // mengecek apakah user saat ini memiliki role camaba
    const userRole = await UserRole.findOne({
      where: { id_user: user.id, id_role: roleAdminProdi.id },
    });

    if (!userRole) {
      return res.status(404).json({
        message: "User is not Admin Prodi",
      });
    }

    const adminProdi = await AdminProdi.findOne({
      where: {
        id_user: user.id,
      },
      include: [{ model: Prodi }],
    });

    if (!adminProdi) {
      return res.status(404).json({
        message: "Admin Prodi not found",
      });
    }

    // Ambil data prodi beserta jumlah mahasiswa yang memiliki nama_status_mahasiswa Aktif
    const prodiData = await Prodi.findAll({
      where: {
        id_prodi: adminProdi.id_prodi,
      },
      include: {
        model: Mahasiswa,
        where: {
          nama_status_mahasiswa: "Aktif",
        },
        required: false,
      },
    });

    // ambil semua jumlah mahasiswa setiap prodi
    const prodi_mahasiswas = await Prodi.findAll({
      include: [{ model: Mahasiswa }],
    });

    // Siapkan data untuk respons
    const result = prodiData.map((prodi) => {
      const prodiMahasiswa = prodi_mahasiswas.find((p) => p.id_prodi === prodi.id_prodi);
      const jumlahMahasiswa = prodiMahasiswa ? prodiMahasiswa.Mahasiswas.length : 0;
      const jumlahMahasiswaBelumSetSK = prodi.Mahasiswas.length;
      return {
        id_prodi: prodi.id_prodi,
        nama_prodi: prodi.nama_program_studi,
        status: prodi.status,
        jumlahMahasiswa,
        jumlahMahasiswaBelumSetSK,
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

    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }

    // Ambil semua mahasiswa dan kelompokkan berdasarkan 4 digit pertama dari nama_periode_masuk
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        id_prodi: prodiId,
      },
      attributes: [[sequelize.fn("LEFT", sequelize.col("nama_periode_masuk"), 4), "tahun_angkatan"], "id_mahasiswa", "nama_mahasiswa", "nama_periode_masuk", "nama_status_mahasiswa"],
      order: [[sequelize.col("tahun_angkatan"), "ASC"]],
    });

    // Kelompokkan mahasiswa berdasarkan tahun_angkatan
    const groupedMahasiswas = mahasiswas.reduce((acc, mahasiswa) => {
      const tahunAngkatan = mahasiswa.getDataValue("tahun_angkatan");
      if (!acc[tahunAngkatan]) {
        acc[tahunAngkatan] = {
          mahasiswa: [],
          jumlahMahasiswaBelumSetSK: 0,
        };
      }
      acc[tahunAngkatan].mahasiswa.push(mahasiswa);
      if (mahasiswa.nama_status_mahasiswa === "Aktif" || mahasiswa.nama_status_mahasiswa === "AKTIF") {
        acc[tahunAngkatan].jumlahMahasiswaBelumSetSK++;
      }
      return acc;
    }, {});

    // Ambil data angkatan yang sesuai dengan grouped mahasiswa
    const tahunAngkatanKeys = Object.keys(groupedMahasiswas);
    const angkatan = await Angkatan.findAll({
      where: {
        tahun: {
          [Op.in]: tahunAngkatanKeys,
        },
      },
    });

    // Siapkan data untuk respons
    const result = tahunAngkatanKeys.map((tahunAngkatan) => {
      const currentAngkatan = angkatan.find((a) => a.tahun === tahunAngkatan);
      const jumlahMahasiswa = groupedMahasiswas[tahunAngkatan].mahasiswa.length;
      const jumlahMahasiswaBelumSetSK = groupedMahasiswas[tahunAngkatan].jumlahMahasiswaBelumSetSK;

      return {
        id_angkatan: currentAngkatan ? currentAngkatan.id : null,
        tahun: tahunAngkatan,
        jumlahMahasiswa,
        jumlahMahasiswaBelumSetSK,
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
      where: {
        id_prodi: prodiId,
        [Sequelize.Op.and]: [Sequelize.where(Sequelize.literal(`substring(nama_periode_masuk, 1, 4)`), angkatan.tahun.toString())], // Gunakan Sequelize literal untuk melakukan substring pada kolom nama_periode_masuk
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

    // get data periode semester krs
    const setting_global_semester_aktif = await SettingGlobalSemester.findOne({
      where: {
        status: true,
      },
    });

    if (!setting_global_semester_aktif) {
      return res.status(400).json({
        message: "Setting Global Semester not found",
      });
    }

    // get data status mahasiswa non aktif
    const statusMahasiswaNonAktif = await StatusMahasiswa.findOne({
      where: {
        nama_status_mahasiswa: "Non-Aktif",
      },
    });

    if (!statusMahasiswaNonAktif) {
      return res.status(400).json({
        message: "Status Mahasiswa Non Aktif not found",
      });
    }

    // membuat data perkuliahan mahasiswa sesuai dengan periode semester krs
    for (const mahasiswa of mahasiswas) {
      let perkuliahanMahasiswa = await PerkuliahanMahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
          id_semester: setting_global_semester_aktif.id_semester_krs,
        },
      });

      // jika tidak ada perkuliahan mahasiswa untuk periode semester krs, maka akan dibuatkan data baru
      if (!perkuliahanMahasiswa) {
        // konversi dari periode masuk agar untuk angkatan
        let angkatan = null;
        angkatan = mahasiswa.nama_periode_masuk.substring(0, 4);

        // get data perkuliahan mahasiswa paling akhir (id_semester terbesar)
        const lastPerkuliahanMahasiswa = await PerkuliahanMahasiswa.findOne({
          where: {
            id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
          },
          order: [["id_semester", "DESC"]],
        });

        // jika mahasiswa baru maka buatkan 0 semua untuk ips ipk dan sks total
        if (!lastPerkuliahanMahasiswa) {
          await PerkuliahanMahasiswa.create({
            angkatan: angkatan,
            ips: 0, // sesuai semester sebelumnya
            ipk: 0, // sesuai semester sebelumnya
            sks_semester: 0,
            sks_total: 0, // pakai semester sebelumnya
            biaya_kuliah_smt: 0,
            id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
            id_semester: setting_global_semester_aktif.id_semester_krs,
            id_status_mahasiswa: statusMahasiswaNonAktif.id_status_mahasiswa,
            id_pembiayaan: null,
          });
        } else {
          await PerkuliahanMahasiswa.create({
            angkatan: angkatan,
            ips: lastPerkuliahanMahasiswa.ips,
            ipk: lastPerkuliahanMahasiswa.ipk,
            sks_semester: 0,
            sks_total: lastPerkuliahanMahasiswa.sks_total,
            biaya_kuliah_smt: 0,
            id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
            id_semester: setting_global_semester_aktif.id_semester_krs,
            id_status_mahasiswa: statusMahasiswaNonAktif.id_status_mahasiswa,
            id_pembiayaan: null,
          });
        }
      }
    }

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
  getProdiWithCountMahasiswaBelumSetSKByAdminProdi,
  getPeriodeByProdiIdWithCountMahasiswa,
  setStatusAktif,
  setStatusCuti,
  setStatusNonAktif,
  updateAllStatusMahasiswaNonaktifByProdiAndAngkatanId,
};
