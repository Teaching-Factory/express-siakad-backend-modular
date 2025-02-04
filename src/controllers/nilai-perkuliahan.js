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
  JenisEvaluasi,
  ProfilPenilaian,
  NilaiKomponenEvaluasiKelas,
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

    // inisiasi variable yang dibutuhkan
    let detailNilaiPerkuliahanKelas = [];
    let headers = [];
    let komponenEvaluasiMap = new Map();

    // Ambil data komponen evaluasi kelas dari database berdasarkan kelas kuliah
    const komponenEvaluasiKelas = await KomponenEvaluasiKelas.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      include: [{ model: JenisEvaluasi }],
    });

    // Buat mapping nama komponen evaluasi ke ID dan bobot dari database
    komponenEvaluasiKelas.forEach((komponen) => {
      let nama_komponen =
        komponen.nama && komponen.nama.trim() !== "" ? komponen.nama : komponen.JenisEvaluasi && komponen.JenisEvaluasi.nama_jenis_evaluasi ? komponen.JenisEvaluasi.nama_jenis_evaluasi : "Nama Komponen Evaluasi Kelas Belum Diisi";

      komponenEvaluasiMap.set(nama_komponen, {
        id_komponen_evaluasi: komponen.id_komponen_evaluasi,
        bobot_evaluasi: komponen.bobot_evaluasi || 0, // Default ke 0 jika undefined/null
      });
    });

    // get data profil penilaian
    const profilPenilaians = await ProfilPenilaian.findAll({
      order: [["id", "ASC"]],
    });

    let angkatan_mahasiswa = null;
    let jurusan = null;

    // mengambil data angkatan mahasiswa dan jurusan
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

    // Ambil header kolom dari baris pertama (header)
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = cell.value ? cell.value.toString().trim() : "";
    });

    // looping excel perbaris
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        let nim = row.getCell(2).value;
        // const nama_mahasiswa = row.getCell(3).value;

        if (!nim) return;

        detailNilaiPerkuliahanKelas.push(async () => {
          let id_registrasi_mahasiswa = null;
          let totalNilai = 0;
          let jumlahKomponen = 0;

          // Cari mahasiswa berdasarkan NIM
          if (nim) {
            // Menghapus tanda petik di awal
            nim = nim.replace(/^'/, "");

            const mahasiswa = await Mahasiswa.findOne({ where: { nim: nim } });
            if (mahasiswa) {
              id_registrasi_mahasiswa = mahasiswa.id_registrasi_mahasiswa;
              angkatan_mahasiswa = mahasiswa.nama_periode_masuk.substring(0, 4);
            } else {
              return;
            }
          }

          // Loop setiap kolom setelah NIM untuk mengambil nilai komponen evaluasi kelas
          let nilaiKomponenEvaluasiKelas = [];

          // start mengidentifikasi nama komponen evaluasi kelas dimulai dari kolom 4
          for (let colNumber = 4; colNumber <= headers.length; colNumber++) {
            let namaKomponen = headers[colNumber]; // Nama header sesuai indeks kolom
            let nilai = row.getCell(colNumber).value; // Nilai mahasiswa di kolom tersebut

            if (namaKomponen) {
              // Normalisasi nama komponen evaluasi dengan menghapus angka dan p  ersen
              let namaKomponenNormalized = namaKomponen.replace(/\(\d+%\)/g, "").trim();

              // Mencari kecocokan dalam komponenEvaluasiMap menggunakan pendekatan LIKE
              let matchedKey = [...komponenEvaluasiMap.keys()].find((key) => key.toLowerCase().includes(namaKomponenNormalized.toLowerCase()));

              if (!matchedKey) {
                // Jika tidak ada kecocokan, cocokkan dengan nama_jenis_evaluasi dari relasi JenisEvaluasi
                matchedKey = [...komponenEvaluasiMap.keys()].find((key) => key.toLowerCase().includes(namaKomponenNormalized.toLowerCase()));
              }

              if (matchedKey) {
                let komponen = komponenEvaluasiMap.get(matchedKey); // Dapatkan objek komponen
                let id_komponen_evaluasi = komponen.id_komponen_evaluasi;
                let bobot_evaluasi = komponen.bobot_evaluasi || 0; // Default ke 0 jika undefined

                nilaiKomponenEvaluasiKelas.push({
                  id_komponen_evaluasi,
                  nilai_komponen_evaluasi_kelas: nilai,
                });

                // perhitungan nilai dengan bobot evaluasi
                let perhitunganNilaiBobot = 0;
                perhitunganNilaiBobot = nilai * bobot_evaluasi;

                totalNilai += perhitunganNilaiBobot;
                // totalNilai += nilai ? parseFloat(nilai) : 0;
                jumlahKomponen++;
              }
            }
          }

          // Hitung nilai angka rata-rata dari semua komponen evaluasi
          let nilai_angka = totalNilai;

          // Determine grade
          let nilai_huruf = "E";
          let nilai_indeks = 0;

          // set nilai huruf dan angka dari nilai akhir
          for (const criteria of profilPenilaians) {
            if (nilai_angka >= criteria.nilai_min && nilai_angka <= criteria.nilai_max) {
              nilai_huruf = criteria.nilai_huruf;
              nilai_indeks = criteria.nilai_indeks;
              break;
            }
          }

          // pengisian value data detail nilai perkuliahan
          const detail_nilai_perkuliahan = {
            angkatan: angkatan_mahasiswa,
            jurusan: jurusan,
            nilai_angka: nilai_angka,
            nilai_indeks: nilai_indeks,
            nilai_huruf: nilai_huruf,
            id_kelas_kuliah: kelasKuliahId,
            id_registrasi_mahasiswa: id_registrasi_mahasiswa,
          };

          if (id_registrasi_mahasiswa && angkatan_mahasiswa) {
            // get data detail nilai perkuliahan kelas
            let detail_nilai_perkuliahan_temp = await DetailNilaiPerkuliahanKelas.findOne({
              where: {
                id_kelas_kuliah: kelasKuliahId,
                id_registrasi_mahasiswa: id_registrasi_mahasiswa,
              },
            });

            if (!detail_nilai_perkuliahan_temp) {
              // create data detail nilai perkuliahan kelas
              await DetailNilaiPerkuliahanKelas.create(detail_nilai_perkuliahan);
            } else {
              // Update data detail_nilai_perkuliahan_temp
              detail_nilai_perkuliahan_temp.nilai_angka = nilai_angka;
              detail_nilai_perkuliahan_temp.nilai_huruf = nilai_huruf;
              detail_nilai_perkuliahan_temp.nilai_indeks = nilai_indeks;

              // Simpan perubahan ke dalam database
              await detail_nilai_perkuliahan_temp.save();
            }

            for (const { id_komponen_evaluasi, nilai_komponen_evaluasi_kelas } of nilaiKomponenEvaluasiKelas) {
              // get data nilai komponen evaluasi kelas
              let nilai_komponen_evaluasi_kelas_temp = await NilaiKomponenEvaluasiKelas.findOne({
                where: {
                  id_komponen_evaluasi,
                  id_registrasi_mahasiswa,
                },
              });

              // pengecekan data jikalau sudah ada data nilai komponen evaluasi kelas maka update
              if (!nilai_komponen_evaluasi_kelas_temp) {
                await NilaiKomponenEvaluasiKelas.create({
                  nilai_komponen_evaluasi_kelas: nilai_komponen_evaluasi_kelas,
                  id_komponen_evaluasi: id_komponen_evaluasi,
                  id_registrasi_mahasiswa: id_registrasi_mahasiswa,
                });
              } else {
                // Update data nilai_komponen_evaluasi_kelas_temp
                nilai_komponen_evaluasi_kelas_temp.nilai_komponen_evaluasi_kelas = nilai_komponen_evaluasi_kelas;

                // Simpan perubahan ke dalam database
                await nilai_komponen_evaluasi_kelas_temp.save();
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

    // get data kelas kuliah
    const kelas_kuliah = await KelasKuliah.findByPk(kelasKuliahId);

    if (!kelas_kuliah) {
      return res.status(400).json({
        message: "Kelas Kuliah not found",
      });
    }

    // get data komponen evaluasi kelas
    const komponenEvaluasiKelas = await KomponenEvaluasiKelas.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      include: [{ model: JenisEvaluasi }],
      order: [["nomor_urut", "ASC"]],
    });

    // get data peserta kelas kuliah
    const peserta_kelas_kuliahs = await PesertaKelasKuliah.findAll({
      where: {
        id_kelas_kuliah: kelasKuliahId,
      },
      attributes: ["id_peserta_kuliah", "id_registrasi_mahasiswa", "id_kelas_kuliah", "angkatan"],
      include: [{ model: Mahasiswa, attributes: ["nama_mahasiswa", "nim"] }],
    });

    if (!peserta_kelas_kuliahs || peserta_kelas_kuliahs.length === 0) {
      return res.status(404).json({
        message: `<===== Peserta Kelas Kuliah By Kelas Kuliah ID ${kelasKuliahId} Not Found:`,
      });
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Template Penilaian Kelas ${kelas_kuliah.nama_kelas_kuliah}`);

    // static column headers
    const staticColumns = [
      { header: "No", key: "no", width: 5 },
      { header: "NIM", key: "nim", width: 20 },
      { header: "Nama Mahasiswa", key: "nama_mahasiswa", width: 20 },
      // { header: "Nilai Akhir", key: "nilai_akhir", width: 20 },
    ];

    const dynamicColumns = komponenEvaluasiKelas.map((komponen) => {
      let nama_komponen = komponen.nama && komponen.nama.trim() !== "" ? komponen.nama : komponen.JenisEvaluasi?.nama_jenis_evaluasi || "Nama Komponen Evaluasi Kelas Belum Diisi";

      let bobot = komponen.bobot_evaluasi ? ` (${parseFloat(komponen.bobot_evaluasi) * 100}%)` : ""; // Format bobot ke persen

      return {
        header: `${nama_komponen}${bobot}`,
        key: nama_komponen.toLowerCase().replace(/\s+/g, "_"),
        width: 25,
      };
    });

    // Combine static and dynamic columns
    worksheet.columns = [...staticColumns, ...dynamicColumns];

    // Add data rows
    peserta_kelas_kuliahs.forEach((peserta_kelas_kuliah, index) => {
      worksheet.addRow({
        no: index + 1,
        nim: `'${peserta_kelas_kuliah.Mahasiswa.nim}`,
        nama_mahasiswa: peserta_kelas_kuliah.Mahasiswa.nama_mahasiswa,
      });
    });

    // Set headers for the response
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=template-penilaian-kelas-${kelas_kuliah.nama_kelas_kuliah}.xlsx`);

    // Write to the response
    await workbook.xlsx.write(res);
    res.end();
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
