const { Camaba, PeriodePendaftaran, Semester, JalurMasuk, SistemKuliah, Jabatan, UnitJabatan, Dosen, Prodi, JenjangPendidikan, BiodataCamaba, Sekolah, ProdiCamaba, Mahasiswa, SumberInfoCamaba, SumberPeriodePendaftaran, TagihanCamaba } = require("../../../models");
const { Op } = require("sequelize");

const rekapPendaftarPMB = async (req, res, next) => {
  const { id_semester, id_periode_pendaftaran, id_prodi_diterima, tanggal_penandatanganan, format } = req.query;

  //   validasi
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }
  if (!id_periode_pendaftaran) {
    return res.status(400).json({ message: "id_periode_pendaftaran is required" });
  }
  if (!id_prodi_diterima) {
    return res.status(400).json({ message: "id_prodi_diterima is required" });
  }
  if (!tanggal_penandatanganan) {
    return res.status(400).json({ message: "tanggal_penandatanganan is required" });
  }
  if (!format) {
    return res.status(400).json({ message: "format is required" });
  }

  try {
    // inisiasi jumlah status pada camaba
    let jumlah_pendaftar,
      jumlah_pendaftar_lulus_berkas,
      jumlah_pendaftar_lulus_tes,
      jumlah_pendaftar_sudah_mahasiswa = 0;

    // get data periode pendaftaran
    const periodePendaftaran = await PeriodePendaftaran.findByPk(id_periode_pendaftaran, {
      include: [{ model: Semester }, { model: JalurMasuk }, { model: SistemKuliah }]
    });

    if (!periodePendaftaran) {
      return res.status(400).json({
        message: "Periode Pendaftaran is required"
      });
    }

    // get data unit jabatan
    const unitJabatan = await UnitJabatan.findOne({
      where: {
        id_prodi: id_prodi_diterima
      },
      include: [
        {
          model: Jabatan,
          where: {
            nama_jabatan: "Rektor"
          }
        },
        { model: Dosen }
      ]
    });

    // get data camaba sesuai filter request query
    const camabasByFilter = await Camaba.findAll({
      where: {
        id_prodi_diterima: id_prodi_diterima
      },
      include: [
        {
          model: PeriodePendaftaran,
          where: {
            id: id_periode_pendaftaran,
            id_semester: id_semester
          }
        },
        { model: Prodi, include: [{ model: JenjangPendidikan }] },
        { model: BiodataCamaba, include: [{ model: Sekolah }] }
      ]
    });

    // Ambil prodi camaba pertama dari setiap camaba
    for (const camaba of camabasByFilter) {
      const prodiCamaba = await ProdiCamaba.findOne({
        where: {
          id_camaba: camaba.id
        },
        include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
        order: [["id", "ASC"]]
      });

      // Gabungkan data prodiCamaba ke objek camaba
      if (prodiCamaba) {
        camaba.dataValues.prodiCamaba = prodiCamaba;
      }
    }

    // Menghitung jumlah_pendaftar, jumlah_pendaftar_lulus_berkas, jumlah_pendaftar_lulus_tes
    jumlah_pendaftar = camabasByFilter.length;
    jumlah_pendaftar_lulus_berkas = camabasByFilter.filter((camaba) => camaba.status_berkas === true).length;
    jumlah_pendaftar_lulus_tes = camabasByFilter.filter((camaba) => camaba.status_tes === true).length;

    // Loop untuk mengecek NIM pada Mahasiswa dan increment jumlah_pendaftar_sudah_mahasiswa jika cocok
    for (const camaba of camabasByFilter) {
      // Jika camaba memiliki NIM, cek apakah sesuai dengan data Mahasiswa
      if (camaba.nim) {
        const mahasiswa = await Mahasiswa.findOne({
          where: {
            nim: camaba.nim
          }
        });

        // Jika NIM ditemukan di data Mahasiswa, tambahkan ke jumlah_pendaftar_sudah_mahasiswa
        if (mahasiswa) {
          jumlah_pendaftar_sudah_mahasiswa++;
        }
      }
    }

    res.status(200).json({
      message: "GET Rekap Pendaftar PMB By Request Query Success",
      tanggalPenandatanganan: tanggal_penandatanganan,
      format: format,
      totalDataCamaba: jumlah_pendaftar,
      jumlah_pendaftar_lulus_berkas: jumlah_pendaftar_lulus_berkas,
      jumlah_pendaftar_lulus_tes: jumlah_pendaftar_lulus_tes,
      jumlah_pendaftar_sudah_mahasiswa: jumlah_pendaftar_sudah_mahasiswa,
      dataUnitJabatan: unitJabatan,
      dataPeriodePendaftaran: periodePendaftaran,
      dataCamabas: camabasByFilter
    });
  } catch (error) {
    next(error);
  }
};

const rekapSumberInformasiPMB = async (req, res, next) => {
  const { id_semester, id_periode_pendaftaran, tanggal_penandatanganan, format } = req.query;

  //   validasi
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }
  if (!id_periode_pendaftaran) {
    return res.status(400).json({ message: "id_periode_pendaftaran is required" });
  }
  if (!tanggal_penandatanganan) {
    return res.status(400).json({ message: "tanggal_penandatanganan is required" });
  }
  if (!format) {
    return res.status(400).json({ message: "format is required" });
  }

  try {
    // get data
    const periode_pendaftaran = await PeriodePendaftaran.findByPk(id_periode_pendaftaran, {
      include: [{ model: Semester }]
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!periode_pendaftaran) {
      return res.status(404).json({
        message: `<===== Periode Pendaftaran With ID ${id_periode_pendaftaran} Not Found:`
      });
    }

    const sumberInformasiCamaba = await SumberInfoCamaba.findAll({
      include: [
        {
          model: SumberPeriodePendaftaran,
          include: [
            {
              model: PeriodePendaftaran,
              where: {
                id: id_periode_pendaftaran,
                id_semester: id_semester
              }
            }
          ]
        },
        { model: Camaba }
      ]
    });

    res.status(200).json({
      message: "GET Rekap Sumber Informasi PMB By Request Query Success",
      tanggalPenandatanganan: tanggal_penandatanganan,
      format: format,
      dataPeriodePendaftaran: periode_pendaftaran,
      totalData: sumberInformasiCamaba.length,
      data: sumberInformasiCamaba
    });
  } catch (error) {
    next(error);
  }
};

const rekapPembayaranPMB = async (req, res, next) => {
  const { tanggal_awal, tanggal_akhir, id_prodi_diterima, tanggal_penandatanganan, format } = req.query;

  // Validasi input tanggal
  if (!tanggal_awal) {
    return res.status(400).json({ message: "tanggal_awal (deadline pembayaran) is required" });
  }
  if (!tanggal_akhir) {
    return res.status(400).json({ message: "tanggal_akhir (tanggal pembayaran) is required" });
  }
  if (!id_prodi_diterima) {
    return res.status(400).json({ message: "id_prodi_diterima (tanggal pembayaran) is required" });
  }
  if (!tanggal_penandatanganan) {
    return res.status(400).json({ message: "tanggal_penandatanganan is required" });
  }
  if (!format) {
    return res.status(400).json({ message: "format is required" });
  }

  try {
    // Konversi string tanggal ke objek Date
    const deadlinePembayaran = new Date(tanggal_awal); // tanggal deadline pembayaran (tanggal_tagihan)
    const tanggalPembayaran = new Date(tanggal_akhir); // tanggal pembayaran (tanggal_lunas)

    // Pastikan tanggalPembayaran <= deadlinePembayaran
    if (tanggalPembayaran >= deadlinePembayaran) {
      return res.status(400).json({ message: "Tanggal awal tidak boleh melebihi tanggal akhir" });
    }

    // get data prodi yang diterima camaba
    const prodiDiterima = await Prodi.findByPk(id_prodi_diterima);

    // Jika data tidak ditemukan, kirim respons 404
    if (!prodiDiterima) {
      return res.status(404).json({
        message: `<===== Prodi With ID ${id_prodi_diterima} Not Found:`
      });
    }

    // get data unit jabatan
    const unitJabatan = await UnitJabatan.findOne({
      where: {
        id_prodi: id_prodi_diterima
      },
      include: [
        {
          model: Jabatan,
          where: {
            nama_jabatan: "Rektor"
          }
        },
        { model: Dosen }
      ]
    });

    // Mendapatkan data rekap pembayaran PMB berdasarkan range tanggal_tagihan dan tanggal_lunas
    const tagihan_camabas = await TagihanCamaba.findAll({
      where: {
        tanggal_tagihan: {
          [Op.lte]: deadlinePembayaran
        },
        tanggal_lunas: {
          [Op.gte]: tanggalPembayaran
        }
      },
      include: [
        {
          model: Camaba,
          where: {
            id_prodi_diterima: id_prodi_diterima
          },
          include: [{ model: Prodi }]
        }
      ]
    });

    // Menghitung total tagihan camaba keseluruhan
    let totalTagihanSemuaCamaba = 0;

    if (tagihan_camabas && tagihan_camabas.length > 0) {
      totalTagihanSemuaCamaba = tagihan_camabas.reduce((accumulator, tagihan) => {
        return accumulator + (parseFloat(tagihan.jumlah_tagihan) || 0);
      }, 0);
    }

    res.status(200).json({
      message: "GET Rekap Pembayaran PMB By Request Query Success",
      tanggalPenandatanganan: tanggal_penandatanganan,
      format: format,
      jumlahDataTagihanCamaba: tagihan_camabas.length,
      totalTagihanSemuaCamaba: totalTagihanSemuaCamaba,
      dataUnitJabatan: unitJabatan,
      dataTagihanCamaba: tagihan_camabas
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  rekapPendaftarPMB,
  rekapSumberInformasiPMB,
  rekapPembayaranPMB
};
