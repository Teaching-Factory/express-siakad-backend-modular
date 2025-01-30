const {
  PesertaKelasKuliah,
  Mahasiswa,
  KelasKuliah,
  Prodi,
  Semester,
  MataKuliah,
  Dosen,
  DetailKelasKuliah,
  RuangPerkuliahan,
  DetailNilaiPerkuliahanKelas,
  BobotPenilaian,
  JenjangPendidikan,
  NilaiPerkuliahan,
  UnsurPenilaian,
  KomponenEvaluasiKelas,
} = require("../../models");
const ExcelJS = require("exceljs");
const fs = require("fs").promises;

const getPesertaKelasKuliahByKelasKuliahId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const kelasKuliahId = req.params.id_kelas_kuliah;

    // Periksa apakah ID disediakan
    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    const detail_kelas_kuliah = await DetailKelasKuliah.findOne({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah, include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }] }],
    });

    // Cari data peserta_kelas_kuliah berdasarkan ID kelas kuliah di database
    const peserta_kelas_kuliah = await PesertaKelasKuliah.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      include: [{ model: KelasKuliah }, { model: Mahasiswa }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (peserta_kelas_kuliah.length === 0) {
      return res.status(404).json({
        message: `<===== Peserta Kelas Kuliah With ID ${kelasKuliahId} Not Found:`,
      });
    }

    // Ambil detail nilai perkuliahan kelas untuk setiap peserta
    const pesertaDenganNilai = await Promise.all(
      peserta_kelas_kuliah.map(async (peserta) => {
        const detailNilai = await DetailNilaiPerkuliahanKelas.findOne({
          where: {
            id_kelas_kuliah: peserta.id_kelas_kuliah,
            id_registrasi_mahasiswa: peserta.id_registrasi_mahasiswa,
          },
          include: [{ model: NilaiPerkuliahan, include: [{ model: UnsurPenilaian }] }],
        });

        return {
          ...peserta.toJSON(),
          detailNilaiPerkuliahanKelas: detailNilai,
        };
      })
    );

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Peserta Kelas Kuliah By ID ${kelasKuliahId} Success:`,
      jumlahData: peserta_kelas_kuliah.length,
      dataKelasKuliah: detail_kelas_kuliah,
      data: pesertaDenganNilai,
    });
  } catch (error) {
    next(error);
  }
};

const createOrUpdatePenilaianByKelasKuliahId = async (req, res, next) => {
  try {
    const kelasKuliahId = req.params.id_kelas_kuliah;
    const { penilaians } = req.body;

    if (!kelasKuliahId) {
      return res.status(400).json({ message: "Kelas Kuliah ID is required" });
    }

    if (!penilaians || !Array.isArray(penilaians) || penilaians.length === 0) {
      return res.status(400).json({ message: "Invalid or empty penilaians data" });
    }

    const kelas_kuliah = await KelasKuliah.findByPk(kelasKuliahId);

    if (!kelas_kuliah) {
      return res.status(404).json({ message: "Kelas Kuliah not found" });
    }

    const prodi = await Prodi.findOne({
      where: {
        id_prodi: kelas_kuliah.id_prodi,
      },
    });

    if (!prodi) {
      return res.status(404).json({ message: "Prodi not found" });
    }

    const jenjang_pendidikan = await JenjangPendidikan.findOne({
      where: {
        id_jenjang_didik: prodi.id_jenjang_pendidikan,
      },
    });

    if (!jenjang_pendidikan) {
      return res.status(404).json({ message: "Jenjang Pendidikan not found" });
    }

    const bobotPenilaians = await BobotPenilaian.findAll({
      where: {
        id_prodi: prodi.id_prodi,
      },
    });

    if (!bobotPenilaians || bobotPenilaians.length === 0) {
      return res.status(404).json({ message: "Bobot Penilaian not found for the given prodi" });
    }

    const createdOrUpdatedDetails = [];

    for (const penilaian of penilaians) {
      const { id_registrasi_mahasiswa, nilai_bobot } = penilaian;

      let totalNilai = 0;
      let totalBobot = 0;

      for (const bobot of nilai_bobot) {
        const bobotPenilaian = await BobotPenilaian.findByPk(bobot.id_bobot);

        if (!bobotPenilaian) {
          return res.status(404).json({ message: `Bobot Penilaian with ID ${bobot.id_bobot} not found` });
        }

        totalNilai += (bobot.nilai * bobotPenilaian.bobot_penilaian) / 100;
        totalBobot += bobotPenilaian.bobot_penilaian;
      }

      if (totalBobot !== 100) {
        return res.status(400).json({ message: "Total bobot penilaian does not equal 100" });
      }

      let nilai_angka_awal = totalNilai;
      let nilai_angka = (totalNilai / 25).toFixed(2);

      let nilai_huruf;
      let nilai_indeks;

      if (nilai_angka >= 3.5) {
        nilai_huruf = "A";
        nilai_indeks = 4.0;
      } else if (nilai_angka >= 2.5) {
        nilai_huruf = "B";
        nilai_indeks = 3.0;
      } else if (nilai_angka >= 1.5) {
        nilai_huruf = "C";
        nilai_indeks = 2.0;
      } else if (nilai_angka >= 0.5) {
        nilai_huruf = "D";
        nilai_indeks = 1.0;
      } else {
        nilai_huruf = "E";
        nilai_indeks = 0.0;
      }

      let mahasiswa = await Mahasiswa.findOne({
        where: {
          id_registrasi_mahasiswa: id_registrasi_mahasiswa,
        },
      });

      if (!mahasiswa) {
        return res.status(404).json({ message: `Mahasiswa with ID ${id_registrasi_mahasiswa} not found` });
      }

      let angkatan_mahasiswa = mahasiswa.nama_periode_masuk.substring(0, 4);

      let detailNilai = await DetailNilaiPerkuliahanKelas.findOne({
        where: {
          id_kelas_kuliah: kelasKuliahId,
          id_registrasi_mahasiswa,
        },
      });

      if (detailNilai) {
        detailNilai.jurusan = jenjang_pendidikan.nama_jenjang_didik + " " + prodi.nama_program_studi;
        detailNilai.angkatan = angkatan_mahasiswa;
        detailNilai.nilai_angka = parseFloat(nilai_angka_awal);
        detailNilai.nilai_huruf = nilai_huruf;
        detailNilai.nilai_indeks = nilai_indeks;
        await detailNilai.save();
      } else {
        detailNilai = await DetailNilaiPerkuliahanKelas.create({
          jurusan: jenjang_pendidikan.nama_jenjang_didik + " " + prodi.nama_program_studi,
          angkatan: angkatan_mahasiswa,
          nilai_angka: parseFloat(nilai_angka_awal),
          nilai_huruf,
          nilai_indeks,
          id_kelas_kuliah: kelasKuliahId,
          id_registrasi_mahasiswa,
        });
      }

      createdOrUpdatedDetails.push(detailNilai);
    }

    let dataNilaiId = createdOrUpdatedDetails[0].id_detail_nilai_perkuliahan_kelas;

    for (const penilaian of penilaians) {
      const { nilai_bobot } = penilaian;

      for (const bobot of nilai_bobot) {
        // Temukan Bobot Penilaian berdasarkan ID
        const bobotPenilaian = await BobotPenilaian.findByPk(bobot.id_bobot, {
          include: [{ model: UnsurPenilaian }],
        });

        if (!bobotPenilaian) {
          return res.status(404).json({ message: `Bobot Penilaian with ID ${bobot.id_bobot} not found` });
        }

        // Temukan Nilai Perkuliahan berdasarkan ID Detail dan ID Unsur Penilaian
        let nilai_perkuliahan = null;
        nilai_perkuliahan = await NilaiPerkuliahan.findOne({
          where: {
            id_detail_nilai_perkuliahan_kelas: dataNilaiId,
            id_unsur_penilaian: bobotPenilaian.UnsurPenilaian.id_unsur_penilaian,
          },
        });

        if (nilai_perkuliahan) {
          // Jika sudah ada, lakukan pembaruan
          await nilai_perkuliahan.update({
            nilai: bobot.nilai,
          });
        } else {
          // Jika belum ada, buat yang baru
          nilai_perkuliahan = await NilaiPerkuliahan.create({
            id_detail_nilai_perkuliahan_kelas: dataNilaiId,
            id_unsur_penilaian: bobotPenilaian.UnsurPenilaian.id_unsur_penilaian,
            nilai: bobot.nilai,
          });
        }
      }
    }

    res.status(201).json({
      message: "Penilaian created or updated successfully",
      dataJumlah: createdOrUpdatedDetails.length,
      data: createdOrUpdatedDetails,
    });
  } catch (error) {
    next(error);
  }
};

const importNilaiPerkuliahan = async (req, res, next) => {
  try {
    const kelasKuliahId = req.params.id_kelas_kuliah;

    if (!kelasKuliahId) {
      return res.status(400).json({ message: "Kelas Kuliah ID is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (req.file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      return res.status(400).json({ message: "File type not supported" });
    }

    const filePath = req.file.path;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error("Worksheet not found in the Excel file");
    }

    let detailNilaiPerkuliahanKelas = [];

    // Read grading criteria
    const gradingCriteria = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber <= 6) {
        const nilai_min = row.getCell(1).value;
        const nilai_max = row.getCell(2).value;
        const nilai_indeks = row.getCell(3).value;
        const nilai_huruf = row.getCell(4).value;
        gradingCriteria.push({ nilai_min, nilai_max, nilai_indeks, nilai_huruf });
      }
    });

    // Map nama kolom to UnsurPenilaian
    const unsurPenilaianMap = {};
    const headerRow = worksheet.getRow(1);
    const startColumn = 8; // Column H
    const endColumn = 11; // Column K
    for (let colNumber = startColumn; colNumber <= endColumn; colNumber++) {
      const cellValue = headerRow.getCell(colNumber).value;
      const unsurPenilaian = await UnsurPenilaian.findOne({ where: { nama_unsur_penilaian: cellValue } });
      if (!unsurPenilaian) {
        return res.status(400).json({ message: `Unsur Penilaian with name '${cellValue}' not found` });
      }
      unsurPenilaianMap[colNumber] = unsurPenilaian;
    }

    let count_data_nilai = 0;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const nim = row.getCell(6).value;
        const nilai_presensi = row.getCell(8).value;
        const nilai_tugas = row.getCell(9).value;
        const nilai_uas = row.getCell(10).value;
        const nilai_uts = row.getCell(11).value;

        detailNilaiPerkuliahanKelas.push(async () => {
          let id_registrasi_mahasiswa = null;
          let angkatan_mahasiswa = null;
          let jurusan = null;

          if (nim) {
            const mahasiswa = await Mahasiswa.findOne({ where: { nim: nim } });
            if (mahasiswa) {
              id_registrasi_mahasiswa = mahasiswa.id_registrasi_mahasiswa;
              angkatan_mahasiswa = mahasiswa.nama_periode_masuk.substring(0, 4);
            } else {
              return;
            }
          }

          const nilai_angka = (nilai_presensi + nilai_tugas + nilai_uas + nilai_uts) / 4;

          // Determine grade
          let huruf = "E";
          let indeks = 0;
          for (const criteria of gradingCriteria) {
            if (nilai_angka >= criteria.nilai_min && nilai_angka <= criteria.nilai_max) {
              huruf = criteria.nilai_huruf;
              indeks = criteria.nilai_indeks;
              break;
            }
          }

          const kelas_kuliah = await KelasKuliah.findByPk(kelasKuliahId);
          if (kelas_kuliah) {
            const prodi = await Prodi.findOne({ where: { id_prodi: kelas_kuliah.id_prodi } });
            if (prodi) {
              const jenjang_pendidikan = await JenjangPendidikan.findOne({ where: { id_jenjang_didik: prodi.id_jenjang_pendidikan } });
              if (jenjang_pendidikan) {
                jurusan = jenjang_pendidikan.nama_jenjang_didik + " " + prodi.nama_program_studi;
              }
            }
          }

          const detail_nilai_perkuliahan = {
            angkatan: angkatan_mahasiswa,
            jurusan: jurusan,
            nilai_angka: nilai_angka,
            nilai_indeks: indeks,
            nilai_huruf: huruf,
            id_kelas_kuliah: kelasKuliahId,
            id_registrasi_mahasiswa: id_registrasi_mahasiswa,
          };

          if (id_registrasi_mahasiswa && angkatan_mahasiswa) {
            const createdDetail = await DetailNilaiPerkuliahanKelas.create(detail_nilai_perkuliahan);
            count_data_nilai++;

            // Create Nilai Perkuliahan based on the map unsur penilaian and column values
            const nilaiPerkuliahanValues = [
              { nilai: nilai_presensi, colNumber: 8 },
              { nilai: nilai_tugas, colNumber: 9 },
              { nilai: nilai_uas, colNumber: 10 },
              { nilai: nilai_uts, colNumber: 11 },
            ];

            for (const { nilai, colNumber } of nilaiPerkuliahanValues) {
              const unsurPenilaian = unsurPenilaianMap[colNumber];
              if (unsurPenilaian && nilai != null) {
                await NilaiPerkuliahan.create({
                  nilai: nilai,
                  id_unsur_penilaian: unsurPenilaian.id_unsur_penilaian,
                  id_detail_nilai_perkuliahan_kelas: createdDetail.id_detail_nilai_perkuliahan_kelas,
                });
              }
            }
          }
        });
      }
    });

    // Execute all async functions to save detail nilai perkuliahan to database
    await Promise.all(detailNilaiPerkuliahanKelas.map((fn) => fn()));

    await fs.unlink(filePath);

    res.status(201).json({
      message: "Nilai Perkuliahan imported successfully",
      dataJumlah: count_data_nilai,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapNilaiPerkuliahanByFilter = async (req, res, next) => {
  const { id_semester, id_prodi, nama_kelas_kuliah, format, tanggal_penandatanganan } = req.query;

  // pengecekan parameter
  if (!id_semester) {
    return res.status(400).json({ message: "id_semester is required" });
  }
  if (!id_prodi) {
    return res.status(400).json({ message: "id_prodi is required" });
  }
  if (!nama_kelas_kuliah) {
    return res.status(400).json({ message: "nama_kelas_kuliah is required" });
  }
  if (!format) {
    return res.status(400).json({ message: "format is required" });
  }
  if (!tanggal_penandatanganan) {
    return res.status(400).json({ message: "tanggal_penandatanganan is required" });
  }

  try {
    // get kelas kuliah
    const kelas_kuliah = await KelasKuliah.findOne({
      where: {
        nama_kelas_kuliah: nama_kelas_kuliah,
        id_semester: id_semester,
        id_prodi: id_prodi,
      },
      include: [{ model: Dosen }, { model: MataKuliah }, { model: DetailKelasKuliah, include: [{ model: RuangPerkuliahan }] }, { model: Semester }, { model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!kelas_kuliah) {
      return res.status(404).json({
        message: `Kelas Kuliah Not Found`,
      });
    }

    // get data bobot penilaian dengan relasi unsur penilaian
    const bobot_penilaian_prodi = await BobotPenilaian.findAll({
      where: {
        id_prodi: kelas_kuliah.id_prodi,
      },
      include: [{ model: UnsurPenilaian }],
    });

    // get data detail nilai perkuliahan kelas dan dengan gabungan data nilai perkuliahan
    const rekap_nilai_perkuliahan = await DetailNilaiPerkuliahanKelas.findAll({
      where: {
        id_kelas_kuliah: kelas_kuliah.id_kelas_kuliah,
      },
      include: [{ model: Mahasiswa }, { model: NilaiPerkuliahan }],
    });

    res.status(200).json({
      message: "Get Rekap Nilai Perkuliahan By Filter Success",
      kelas_kuliah: kelas_kuliah,
      bobot_penilaian_prodi: bobot_penilaian_prodi,
      tanggalPenandatanganan: tanggal_penandatanganan,
      format: format,
      totalData: rekap_nilai_perkuliahan.length,
      dataRekapNilaiPerkuliahan: rekap_nilai_perkuliahan,
    });
  } catch (error) {
    next(error);
  }
};

const exportPesertaKelasByKelasKuliahId = async (req, res, next) => {
  try {
    const kelasKuliahId = req.params.id_kelas_kuliah;

    if (!kelasKuliahId) {
      return res.status(400).json({
        message: "Kelas Kuliah ID is required",
      });
    }

    // get data komponen evaluasi kelas
    const komponenEvaluasiKelas = await KomponenEvaluasiKelas.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
    });

    // get data peserta kelas kuliah
    const peserta_kelas_kuliah = await PesertaKelasKuliah.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      attributes: ["id_peserta_kuliah", "id_registrasi_mahasiswa", "id_kelas_kuliah", "angkatan"],
      include: [{ model: Mahasiswa, attributes: ["nama_mahasiswa", "nim"] }],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== Success:`,
      jumlahData: komponenEvaluasiKelas.length,
      data: komponenEvaluasiKelas,
    });

    // if (!camabas || camabas.length === 0) {
    //   return res.status(404).json({
    //     message: `<===== Camaba With Periode Pendaftaran ID ${periodePendaftaranId} Not Found:`,
    //   });
    // }

    // // Create a new Excel workbook and worksheet
    // const workbook = new ExcelJS.Workbook();
    // const worksheet = workbook.addWorksheet("Data Calon Mahasiswa");

    // // Add column headers
    // worksheet.columns = [
    //   { header: "No", key: "no", width: 5 },
    //   { header: "NIM", key: "nim", width: 20 },
    //   { header: "NISN", key: "nisn", width: 20 },
    //   { header: "Nama Mahasiswa", key: "nama_lengkap", width: 20 },
    //   { header: "NIK", key: "nik", width: 20 },
    //   { header: "Tempat Lahir", key: "tempat_lahir", width: 20 },
    //   { header: "Tanggal Lahir", key: "tanggal_lahir", width: 20 },
    //   { header: "Jenis Kelamin", key: "jenis_kelamin", width: 20 },
    //   { header: "No. Handphone", key: "nomor_hp", width: 20 },
    //   { header: "Email", key: "email", width: 20 },
    //   { header: "Kode Agama", key: "kode_agama", width: 20 },
    //   { header: "Desa/Kelurahan", key: "kelurahan", width: 20 },
    //   { header: "Kode Wilayah", key: "kode_wilayah", width: 20 },
    //   { header: "Nama Ibu Kandung", key: "nama_ibu_kandung", width: 20 },
    //   { header: "Kode Prodi", key: "kode_prodi", width: 20 },
    //   { header: "Tanggal Masuk", key: "tanggal_masuk", width: 20 },
    //   { header: "Semester Masuk", key: "semester_masuk", width: 20 },
    //   { header: "Jenis Pendaftaran", key: "jenis_pendaftaran", width: 20 },
    //   { header: "Jalur Pendaftaran", key: "jalur_pendaftaran", width: 20 },
    //   { header: "Kode PT Asal", key: "kode_pt_asal", width: 20 },
    //   { header: "Kode Prodi Asal", key: "kode_prodi_asal", width: 20 },
    //   { header: "Biaya Awal Masuk", key: "biaya_awal_masuk", width: 20 },
    //   { header: "Jenis Pembiayaan", key: "jenis_pembiayaan", width: 20 },
    // ];

    // // Format tanggal masuk dengan toLocaleDateString
    // const formattedTanggalMasuk = new Date().toLocaleDateString("en-US", {
    //   month: "numeric",
    //   day: "numeric",
    //   year: "numeric",
    // });

    // // Add data rows
    // camabas.forEach((camaba, index) => {
    //   const formattedTanggalLahir = new Date(camaba.tanggal_lahir).toLocaleDateString("en-US", {
    //     month: "numeric",
    //     day: "numeric",
    //     year: "numeric",
    //   });

    //   // Format biaya_awal_masuk tanpa desimal
    //   const formattedBiayaAwalMasuk = parseInt(periodePendaftaran.biaya_pendaftaran, 10);

    //   worksheet.addRow({
    //     no: index + 1,
    //     nim: `'${camaba.nim}`,
    //     nisn: `'${camaba.BiodataCamaba?.nisn || ""}`,
    //     nama_lengkap: camaba.nama_lengkap,
    //     nik: `'${camaba.BiodataCamaba?.nik || ""}`,
    //     tempat_lahir: camaba.tempat_lahir,
    //     tanggal_lahir: formattedTanggalLahir,
    //     jenis_kelamin: camaba.jenis_kelamin === "Laki-laki" ? "L" : camaba.jenis_kelamin === "Perempuan" ? "P" : "",
    //     nomor_hp: camaba.nomor_hp,
    //     email: camaba.email,
    //     kode_agama: camaba.BiodataCamaba?.Agama?.id_agama || "",
    //     kelurahan: camaba.BiodataCamaba?.Wilayah?.nama_wilayah || "",
    //     kode_wilayah: camaba.BiodataCamaba?.Wilayah?.id_wilayah || "",
    //     nama_ibu_kandung: camaba.BiodataCamaba?.nama_ibu_kandung || "",
    //     kode_prodi: camaba.Prodi?.kode_program_studi || "",
    //     tanggal_masuk: formattedTanggalMasuk,
    //     semester_masuk: setting_global_semester_aktif.SemesterAktif.id_semester,
    //     jenis_pendaftaran: jenisPendaftaranPesertaDidikBaru.nama_jenis_daftar,
    //     jalur_pendaftaran: periodePendaftaran.JalurMasuk.nama_jalur_masuk,
    //     kode_pt_asal: "",
    //     kode_prodi_asal: "",
    //     biaya_awal_masuk: formattedBiayaAwalMasuk,
    //     jenis_pembiayaan: camaba.Pembiayaan?.nama_pembiayaan || "",
    //   });
    // });

    // // Set headers for the response
    // res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    // res.setHeader("Content-Disposition", `attachment; filename=camaba-to-mahasiswa-periode-${periodePendaftaranId}.xlsx`);

    // // update kolom status_export_mahasiswa menjadi true
    // const promises = camabas.map(async (camaba) => {
    //   camaba.status_export_mahasiswa = true; // Set status to true
    //   return camaba.save(); // Save changes
    // });

    // // Wait for all promises to resolve
    // await Promise.all(promises);

    // // Write to the response
    // await workbook.xlsx.write(res);
    // res.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPesertaKelasKuliahByKelasKuliahId,
  createOrUpdatePenilaianByKelasKuliahId,
  importNilaiPerkuliahan,
  getRekapNilaiPerkuliahanByFilter,
  exportPesertaKelasByKelasKuliahId,
};
