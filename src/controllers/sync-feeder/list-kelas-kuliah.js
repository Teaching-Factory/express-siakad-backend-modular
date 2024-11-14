const { KelasKuliah, DetailKelasKuliah, PenugasanDosen, DosenPengajarKelasKuliah, Dosen, sequelize } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar kelas kuliah dari Feeder
async function getKelasKuliahFromFeeder(semesterId, req, res, next) {
  try {
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetListKelasKuliah",
      token: token,
      filter: `id_semester='${semesterId}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar kelas kuliah dari database lokal
async function getKelasKuliahFromLocal(semesterId, req, res, next) {
  try {
    return await KelasKuliah.findAll({
      where: {
        id_semester: semesterId,
      },
    });
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar detail kelas kuliah dari Feeder
async function getDetailKelasKuliahFromFeeder(semesterId, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetDetailKelasKuliah",
      token: token,
      filter: `id_semester='${semesterId}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar detail kelas kuliah dari database lokal
async function getDetailKelasKuliahFromLocal(semesterId, req, res, next) {
  try {
    return await DetailKelasKuliah.findAll({
      where: {
        id_semester: semesterId,
      },
    });
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

async function getDetailKelasKuliahFromFeederByKelasKuliahId(id_kelas_kuliah, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetDetailKelasKuliah",
      token: token,
      filter: `id_kelas_kuliah='${id_kelas_kuliah}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar dosen pengajar kelas kuliah dari Feeder
async function getDosenPengajarKelasKuliahFromFeeder(semesterId, req, res, next) {
  try {
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetDosenPengajarKelasKuliah",
      token: token,
      filter: `id_semester='${semesterId}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar dosen pengajar kelas kuliah dari database lokal
async function getDosenPengajarKelasKuliahFromLocal(semesterId, req, res, next) {
  try {
    return await DosenPengajarKelasKuliah.findAll({
      where: {
        id_semester: semesterId,
      },
    });
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

async function getDosenPengajarKelasKuliahFromFeederByKelasKuliahId(id_kelas_kuliah, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetDosenPengajarKelasKuliah",
      token: token,
      filter: `id_kelas_kuliah='${id_kelas_kuliah}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk menambah data kelas kuliah ke Feeder
async function createKelasKuliahToFeeder(kelas) {
  try {
    const { token, url_feeder } = await getToken();

    // get data detail kelas kuliah
    const detailKelasKuliah = await DetailKelasKuliah.findOne({
      where: {
        id_kelas_kuliah: kelas.id_kelas_kuliah,
      },
    });

    if (!detailKelasKuliah) {
      return res.status(404).json({
        message: `<===== Detail Kelas Kuliah With ID ${kelas.id_kelas_kuliah} Not Found:`,
      });
    }

    // create data kelas kuliah ke feeder
    const requestBody = {
      act: "InsertKelasKuliah",
      token: token,
      record: {
        // id_kelas_kuliah: null, // tidak dipakai
        id_prodi: kelas.id_prodi,
        id_semester: kelas.id_semester,
        nama_kelas_kuliah: kelas.nama_kelas_kuliah,
        sks_mk: kelas.sks,
        sks_tm: kelas.sks,
        sks_prak: 0,
        sks_prak_lap: 0,
        sks_sim: 0,
        bahasan: null,
        a_selenggara_pditt: 1,
        apa_untuk_pditt: 0,
        kapasitas: kelas.jumlah_mahasiswa,
        tanggal_mulai_efektif: detailKelasKuliah.tanggal_mulai_efektif,
        tanggal_akhir_efektif: detailKelasKuliah.tanggal_akhir_efektif,
        id_mou: null,
        id_matkul: kelas.id_matkul,
        lingkup: kelas.lingkup,
        mode: kelas.mode,
      },
    };

    let requestBodyDosenPengajar = null;

    // Menyimpan response dari API post untuk kelas kuliah
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // Mendapatkan id_kelas_kuliah dari response
    const idKelasKuliah = response.data.data.id_kelas_kuliah;

    // get data registrasi
    const penugasanDosen = await PenugasanDosen.findOne({
      where: {
        id_dosen: kelas.id_dosen,
      },
    });

    if (!penugasanDosen) {
      return res.status(404).json({
        message: `<===== Penugasan Dosen With Dosen ID ${kelas.id_dosen} Not Found:`,
      });
    }

    // get data dosen pengajar kelas kuliah
    const dosen_pengajar_kelas_kuliah = await DosenPengajarKelasKuliah.findOne({
      where: {
        id_kelas_kuliah: kelas.id_kelas_kuliah,
      },
    });

    if (!dosen_pengajar_kelas_kuliah) {
      return res.status(404).json({
        message: `<===== Dosen Pengajar Kelas Kuliah With Kelas ID ${kelas.id_kelas_kuliah} Not Found:`,
      });
    }

    // Membuat data dosen pengajar kelas kuliah
    requestBodyDosenPengajar = {
      act: "InsertDosenPengajarKelasKuliah",
      token: token,
      record: {
        id_registrasi_dosen: penugasanDosen.id_registrasi_dosen,
        id_kelas_kuliah: idKelasKuliah,
        sks_substansi_total: kelas.sks,
        rencana_minggu_pertemuan: 16,
        id_jenis_evaluasi: 1,
      },
    };

    // Mengirim request untuk menambahkan data dosen pengajar
    const responDosenPengajarKelasKuliah = await axios.post(url_feeder, requestBodyDosenPengajar);

    // Mendapatkan id_aktivitas_mengajar dari response
    const idAktivitasMengajar = responDosenPengajarKelasKuliah.data.data.id_aktivitas_mengajar;

    // update data dosen pengajar kelas kuliah
    dosen_pengajar_kelas_kuliah.id_feeder = idAktivitasMengajar;
    dosen_pengajar_kelas_kuliah.last_sync = new Date();
    await dosen_pengajar_kelas_kuliah.save();

    // ubah data kelas kuliah local yang baru saja ditambahkan ke feeder
    kelas.id_feeder = idKelasKuliah;
    kelas.last_sync = new Date();
    await kelas.save();

    console.log(`Data kelas kuliah ${kelas.nama_kelas_kuliah} ditambahkan ke Feeder.`);
  } catch (error) {
    console.error("Error inserting data to Feeder:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi kelas kuliah (belum selesai)
async function syncDataKelasKuliah(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // get kelas kuliah local dan feeder
    const kelasFeeder = await getKelasKuliahFromFeeder(semesterId);
    const kelasLocal = await getKelasKuliahFromLocal(semesterId);

    // get detail kelas kuliah local dan feeder
    const detailKelasKuliahFeeder = await getDetailKelasKuliahFromFeeder(semesterId);
    const detailKelasKuliahLocal = await getDetailKelasKuliahFromLocal(semesterId);

    // get dosen pengajar kelas kuliah local dan feeder
    const dosenPengajarKelasKuliahFeeder = await getDosenPengajarKelasKuliahFromFeeder(semesterId);
    const dosenPengajarKelasKuliahLocal = await getDosenPengajarKelasKuliahFromLocal(semesterId);

    const localMap = kelasLocal.reduce((map, kelas) => {
      map[kelas.id_feeder] = kelas;
      return map;
    }, {});

    const feederMap = kelasFeeder.reduce((map, kelas) => {
      map[kelas.id_kelas_kuliah] = kelas;
      return map;
    }, {});

    // Sinkronisasi dari Feeder ke Lokal (Create/Update)
    for (let feederKelas of kelasFeeder) {
      if (!localMap[feederKelas.id_kelas_kuliah]) {
        // Buat entri baru di lokal
        await KelasKuliah.create({
          id_kelas_kuliah: feederKelas.id_kelas_kuliah,
          nama_kelas_kuliah: feederKelas.nama_kelas_kuliah,
          sks: feederKelas.sks,
          jumlah_mahasiswa: feederKelas.jumlah_mahasiswa,
          apa_untuk_pditt: feederKelas.apa_untuk_pditt,
          lingkup: feederKelas.lingkup,
          mode: feederKelas.mode,
          id_prodi: feederKelas.id_prodi,
          id_semester: feederKelas.id_semester,
          id_matkul: feederKelas.id_matkul,
          id_dosen: feederKelas.id_dosen,
          last_sync: new Date(),
          id_feeder: feederKelas.id_kelas_kuliah,
        });

        // Menambahkan detail kelas kuliah
        let dataDetailKelasKuliah = await getDetailKelasKuliahFromFeederByKelasKuliahId(feederKelas.id_kelas_kuliah);

        // Loop untuk menambahkan data ke dalam database
        for (const detail_kelas_kuliah of dataDetailKelasKuliah) {
          let tanggal_mulai, tanggal_akhir; // Deklarasikan variabel di luar blok if

          //   melakukan pengecekan data tanggal
          if (detail_kelas_kuliah.tanggal_mulai_efektif != null) {
            const date_start = detail_kelas_kuliah.tanggal_mulai_efektif.split("-");
            tanggal_mulai = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
          }

          if (detail_kelas_kuliah.tanggal_akhir_efektif != null) {
            const date_end = detail_kelas_kuliah.tanggal_akhir_efektif.split("-");
            tanggal_akhir = `${date_end[2]}-${date_end[1]}-${date_end[0]}`;
          }

          await DetailKelasKuliah.create({
            id_detail_kelas_kuliah: detail_kelas_kuliah.id_detail_kelas_kuliah,
            bahasan: detail_kelas_kuliah.bahasan,
            tanggal_mulai_efektif: tanggal_mulai,
            tanggal_akhir_efektif: tanggal_akhir,
            kapasitas: detail_kelas_kuliah.kapasitas,
            tanggal_tutup_daftar: detail_kelas_kuliah.tanggal_tutup_daftar,
            prodi_penyelenggara: detail_kelas_kuliah.prodi_penyelenggara,
            perguruan_tinggi_penyelenggara: detail_kelas_kuliah.perguruan_tinggi_penyelenggara,
            id_kelas_kuliah: detail_kelas_kuliah.id_kelas_kuliah,
          });
        }

        // menambahkan data dosen pengajar kelas kuliah
        let dataDosenPengajarKelasKuliah = await getDosenPengajarKelasKuliahFromFeederByKelasKuliahId(feederKelas.id_kelas_kuliah);

        for (const dosen_pengajar_kelas_kuliah of dataDosenPengajarKelasKuliah) {
          // Periksa apakah data sudah ada di tabel
          const existingDosenPengajarKelasKuliah = await DosenPengajarKelasKuliah.findOne({
            where: {
              id_aktivitas_mengajar: dosen_pengajar_kelas_kuliah.id_aktivitas_mengajar,
            },
          });

          let id_registrasi_dosen = null;
          let id_dosen = null;
          let id_kelas_kuliah = null;

          // Periksa apakah id_registrasi_dosen ada di tabel penugasan dosen
          const penugasan_dosen = await PenugasanDosen.findOne({
            where: {
              id_registrasi_dosen: dosen_pengajar_kelas_kuliah.id_registrasi_dosen,
            },
          });

          // Periksa apakah id_dosen ada di tabel dosen
          const dosen = await Dosen.findOne({
            where: {
              id_dosen: dosen_pengajar_kelas_kuliah.id_dosen,
            },
          });

          // Periksa apakah id_kelas_kuliah ada di tabel kelas kuliah
          const kelas_kuliah = await KelasKuliah.findOne({
            where: {
              id_kelas_kuliah: dosen_pengajar_kelas_kuliah.id_kelas_kuliah,
            },
          });

          // Jika ditemukan, simpan nilainya
          if (penugasan_dosen) {
            id_registrasi_dosen = penugasan_dosen.id_registrasi_dosen;
          }

          // Jika ditemukan, simpan nilainya
          if (dosen) {
            id_dosen = dosen.id_dosen;
          }

          // Jika ditemukan, simpan nilainya
          if (kelas_kuliah) {
            id_kelas_kuliah = kelas_kuliah.id_kelas_kuliah;
          }

          if (!existingDosenPengajarKelasKuliah) {
            // Data belum ada, buat entri baru di database
            await DosenPengajarKelasKuliah.create({
              id_aktivitas_mengajar: dosen_pengajar_kelas_kuliah.id_aktivitas_mengajar,
              sks_substansi_total: dosen_pengajar_kelas_kuliah.sks_substansi_total,
              rencana_minggu_pertemuan: dosen_pengajar_kelas_kuliah.rencana_minggu_pertemuan,
              realisasi_minggu_pertemuan: dosen_pengajar_kelas_kuliah.realisasi_minggu_pertemuan,
              last_sync: new Date(),
              id_feeder: dosen_pengajar_kelas_kuliah.id_aktivitas_mengajar,
              id_registrasi_dosen: id_registrasi_dosen,
              id_dosen: id_dosen,
              id_kelas_kuliah: id_kelas_kuliah,
              id_substansi: dosen_pengajar_kelas_kuliah.id_substansi,
              id_jenis_evaluasi: dosen_pengajar_kelas_kuliah.id_jenis_evaluasi,
              id_prodi: dosen_pengajar_kelas_kuliah.id_prodi,
              id_semester: dosen_pengajar_kelas_kuliah.id_semester,
            });
          }
        }

        console.log(`Data kelas kuliah ${feederKelas.nama_kelas_kuliah} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localKelas = localMap[feederKelas.id_kelas_kuliah];

        if (
          feederKelas.nama_kelas_kuliah !== localKelas.nama_kelas_kuliah ||
          feederKelas.sks !== localKelas.sks ||
          feederKelas.jumlah_mahasiswa !== localKelas.jumlah_mahasiswa ||
          feederKelas.apa_untuk_pditt !== localKelas.apa_untuk_pditt ||
          feederKelas.lingkup !== localKelas.lingkup ||
          feederKelas.mode !== localKelas.mode ||
          feederKelas.id_prodi !== localKelas.id_prodi ||
          feederKelas.id_semester !== localKelas.id_semester ||
          feederKelas.id_matkul !== localKelas.id_matkul ||
          feederKelas.id_dosen !== localKelas.id_dosen
        ) {
          await KelasKuliah.update(
            {
              id_kelas_kuliah: feederKelas.id_kelas_kuliah,
              nama_kelas_kuliah: feederKelas.nama_kelas_kuliah,
              sks: feederKelas.sks,
              jumlah_mahasiswa: feederKelas.jumlah_mahasiswa,
              apa_untuk_pditt: feederKelas.apa_untuk_pditt,
              lingkup: feederKelas.lingkup,
              mode: feederKelas.mode,
              id_prodi: feederKelas.id_prodi,
              id_semester: feederKelas.id_semester,
              id_matkul: feederKelas.id_matkul,
              id_dosen: feederKelas.id_dosen,
              last_sync: new Date(),
              id_feeder: feederKelas.id_kelas_kuliah,
            },
            { where: { id_feeder: feederKelas.id_kelas_kuliah } }
          );

          console.log(`Data kelas kuliah ${feederKelas.nama_kelas_kuliah} di-update di lokal.`);
        }
      }
    }

    // Sinkronisasi dari Lokal ke Feeder (Create/Update/Delete)
    for (let localKelas of kelasLocal) {
      if (!feederMap[localKelas.id_feeder]) {
        // Tambahkan ke Feeder jika tidak ada di Feeder
        await createKelasKuliahToFeeder(localKelas);
        console.log("Kelas berhasil ditambahkan dari local ke feeder");
      } else {
        // Jika ada di Feeder, pastikan data lokal up-to-date
        const feederKelas = feederMap[localKelas.id_feeder];

        if (
          localKelas.nama_kelas_kuliah !== feederKelas.nama_kelas_kuliah ||
          localKelas.nama_kelas_kuliah !== feederKelas.nama_kelas_kuliah ||
          localKelas.sks !== feederKelas.sks ||
          localKelas.jumlah_mahasiswa !== feederKelas.jumlah_mahasiswa ||
          localKelas.apa_untuk_pditt !== feederKelas.apa_untuk_pditt ||
          localKelas.lingkup !== feederKelas.lingkup ||
          localKelas.mode !== feederKelas.mode ||
          localKelas.id_prodi !== feederKelas.id_prodi ||
          localKelas.id_semester !== feederKelas.id_semester ||
          localKelas.id_matkul !== feederKelas.id_matkul ||
          localKelas.id_dosen !== feederKelas.id_dosen
        ) {
          const { token, url_feeder } = await getToken();

          // Update ke Feeder
          const requestBody = {
            act: "UpdateKelasKuliah",
            token: token,
            key: `id_kelas_kuliah='${localKelas.id_kelas_kuliah}'`,
            record: {
              nama_kelas_kuliah: localKelas.nama_kelas_kuliah,
              sks: localKelas.sks,
              jumlah_mahasiswa: localKelas.jumlah_mahasiswa,
              apa_untuk_pditt: localKelas.apa_untuk_pditt,
              lingkup: localKelas.lingkup,
              mode: localKelas.mode,
              id_prodi: localKelas.id_prodi,
              id_semester: localKelas.id_semester,
              id_matkul: localKelas.id_matkul,
              id_dosen: localKelas.id_dosen,
            },
          };

          await axios.post(url_feeder, requestBody);
          console.log(`Data kelas kuliah ${localKelas.nama_kelas_kuliah} di-update di Feeder.`);
        }
      }
    }

    // Hapus data lokal yang tidak ada di Feeder
    for (let localKelas of kelasLocal) {
      if (!feederMap[localKelas.id_feeder]) {
        await localKelas.destroy();
        console.log(`Data kelas kuliah ${localKelas.nama_kelas_kuliah} dihapus dari lokal karena tidak ada di Feeder.`);
      }
    }

    console.log("Sinkronisasi kelas kuliah selesai.");
  } catch (error) {
    console.error("Error during syncKelasKuliah:", error.message);
    throw error;
  }
}

const syncKelasKuliah = async (req, res, next) => {
  try {
    await syncDataKelasKuliah(req, res, next);
    res.status(200).json({ message: "Sinkronisasi kelas kuliah berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncKelasKuliah,
};
