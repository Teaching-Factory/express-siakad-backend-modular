const { BiodataMahasiswa, Mahasiswa, BiodataMahasiswaSync, Wilayah } = require("../../../../models");
const { getToken } = require("../../api-feeder/data-feeder/get-token");
const axios = require("axios");

async function getBiodataMahasiswaFromFeeder(req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetBiodataMahasiswa",
      token: token,
    };

    console.log("Waiting for getting all biodata mahasiswa from feeder ...");

    const response = await axios.post(url_feeder, requestBody);

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error("Feeder API tidak mengembalikan array:", response.data);
      return []; // Mengembalikan array kosong agar tidak error
    }
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

async function getBiodataMahasiswaFromLocal(semesterId, req, res, next) {
  try {
    return await BiodataMahasiswa.findAll({
      include: [
        {
          model: Mahasiswa,
          where: {
            id_semester: semesterId,
          },
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

async function getMahasiswaFromLocal(semesterId, req, res, next) {
  try {
    console.log("Waiting for getting all mahasiswa by semester from local ...");

    return await Mahasiswa.findAll({
      where: {
        id_semester: semesterId,
      },
    });
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

async function getBiodataMahasiswaFromFeederByID(mahasiswaId, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetBiodataMahasiswa",
      token: token,
      filter: `id_mahasiswa='${mahasiswaId}'`,
    };

    console.log("Waiting for getting biodata mahasiswa by id from feeder ...");

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

async function getMahasiswaFromFeederByID(mahasiswaId, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetListMahasiswa",
      token: token,
      filter: `id_mahasiswa='${mahasiswaId}'`,
    };

    console.log("Waiting for getting mahasiswa by id from feeder ...");

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

async function getMahasiswaFromFeederBySemesterId(semesterId, req, res, next) {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetListMahasiswa",
      token: token,
      filter: `id_periode='${semesterId}'`,
    };

    console.log("Waiting for getting mahasiswa by id from feeder ...");

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk memformat tanggal ke format dd-mm-yyyy
function convertToDDMMYYYY(localDate) {
  if (!localDate) {
    return null; // Kembalikan null jika tanggal kosong
  }

  const [year, month, day] = localDate.split("-"); // Pisahkan berdasarkan "-"
  return `${day}-${month}-${year}`; // Gabungkan dalam urutan dd-mm-yyyy
}

function convertToDDMMYYYYForFeeder(dateString) {
  if (!dateString) return null; // Pastikan nilai tidak null atau undefined
  const date = new Date(dateString); // Konversi ke objek Date
  if (isNaN(date)) return null; // Pastikan tanggal valid
  const day = String(date.getDate()).padStart(2, "0"); // Format hari
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Format bulan (0-based)
  const year = date.getFullYear(); // Format tahun
  return `${day}-${month}-${year}`;
}

// Fungsi pembanding nilai
function areEqual(value1, value2) {
  return value1 === value2 || (value1 == null && value2 == null);
}

async function matchingDataBiodataMahasiswa(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // get mahasiswa local dan bioodata mahasiswa feeder
    const mahasiswaLocal = await getMahasiswaFromLocal(semesterId);
    const biodataMahasiswaLocal = await getBiodataMahasiswaFromLocal(semesterId);
    const biodataMahasiswaFeeder = await getBiodataMahasiswaFromFeeder();

    // biodata mahasiswa feeder map
    const biodataMahasiswaFeederMap = biodataMahasiswaFeeder.reduce((map, biodata_mahasiswa) => {
      map[biodata_mahasiswa.id_mahasiswa] = biodata_mahasiswa;
      return map;
    }, {});

    // get data mahasiswa feeder sesuai semesterId
    const mahasiswaFeeder = await getMahasiswaFromFeederBySemesterId(semesterId);

    // map data mahasiswa feeder
    const mahasiswaFeederMap = mahasiswaFeeder.reduce((map, mahasiswa) => {
      map[mahasiswa.id_mahasiswa] = mahasiswa;
      return map;
    }, {});

    // Ambil id_mahasiswa dari mahasiswaLocal
    const idMahasiswaList = mahasiswaLocal.map((m) => m.id_mahasiswa);

    // Ambil data BiodataMahasiswa berdasarkan kolom id_mahasiswa dari mahasiswaLocal
    const biodataLocalMap = await BiodataMahasiswa.findAll({
      where: {
        id_mahasiswa: idMahasiswaList,
      },
    }).then((biodata) =>
      biodata.reduce((map, bio) => {
        map[bio.id_mahasiswa] = bio;
        return map;
      }, {})
    );

    // Loop untuk proses sinkronisasi
    for (let localBiodataMahasiswa of Object.values(biodataLocalMap)) {
      const feederBiodataMahasiswa = await getBiodataMahasiswaFromFeederByID(localBiodataMahasiswa.id_feeder);
      const mahasiswaLocal = biodataLocalMap[localBiodataMahasiswa.id_mahasiswa]; // data biodata mahasiswa local

      // ambil data singkron sementara untuk biodata mahasiswa sync
      const existingSync = await BiodataMahasiswaSync.findOne({
        where: {
          id_mahasiswa: localBiodataMahasiswa.id_mahasiswa,
          jenis_singkron: feederBiodataMahasiswa ? "update" : "create",
          status: false,
          id_feeder: feederBiodataMahasiswa ? localBiodataMahasiswa.id_feeder : null,
        },
      });

      if (existingSync) {
        console.log(`Data biodata mahasiswa ${localBiodataMahasiswa.id_mahasiswa} sudah ditambahkan ke singkron sementara.`);
        continue;
      }

      if (!feederBiodataMahasiswa) {
        // Proses create
        await BiodataMahasiswaSync.create({
          jenis_singkron: "create",
          status: false,
          id_feeder: null,
          id_mahasiswa: localBiodataMahasiswa.id_mahasiswa,
        });
        console.log(`Data biodata mahasiswa ${localBiodataMahasiswa.id_mahasiswa} ditambahkan ke sinkronisasi dengan jenis 'create'.`);
      } else if (mahasiswaLocal) {
        // Proses update, validasi perbedaan data
        const mahasiswaFeeder = await getMahasiswaFromFeederByID(localBiodataMahasiswa.id_feeder);

        if (!mahasiswaFeeder) {
          console.error(`Mahasiswa feeder untuk biodata ${localBiodataMahasiswa.id_mahasiswa} tidak ditemukan.`);
          continue;
        }

        // get mahasiswa local
        let mahasiswaLocalNew = await Mahasiswa.findOne({
          where: {
            id_mahasiswa: mahasiswaLocal.id_mahasiswa,
          },
        });

        const isUpdated = compareBiodataMahasiswas(localBiodataMahasiswa, feederBiodataMahasiswa, mahasiswaLocalNew, mahasiswaFeeder);

        if (isUpdated) {
          await BiodataMahasiswaSync.create({
            jenis_singkron: "update",
            status: false,
            id_feeder: localBiodataMahasiswa.id_feeder,
            id_mahasiswa: localBiodataMahasiswa.id_mahasiswa,
          });
          console.log(`Data biodata mahasiswa ${localBiodataMahasiswa.id_mahasiswa} ditambahkan ke sinkronisasi dengan jenis 'update'.`);
        }
      } else {
        console.error(`Mahasiswa lokal untuk biodata ${localBiodataMahasiswa.id_mahasiswa} tidak ditemukan.`);
      }
    }

    // Fungsi pembanding detail biodata mahasiswa
    function compareBiodataMahasiswas(localBiodataMahasiswa, feederBiodataMahasiswa, mahasiswaLocal, mahasiswaFeeder) {
      // let formatTanggalLahirMahasiswaLocal = convertToDDMMYYYY(mahasiswaLocal.tanggal_lahir);
      let formatTanggalLahirAyahLocal = convertToDDMMYYYY(localBiodataMahasiswa.tanggal_lahir_ayah);
      let formatTanggalLahirIbuLocal = convertToDDMMYYYY(localBiodataMahasiswa.tanggal_lahir_ibu);
      let formatTanggalLahirWaliLocal = convertToDDMMYYYY(localBiodataMahasiswa.tanggal_lahir_wali);
      let formatTanggalLahirWaliFeeder = convertToDDMMYYYYForFeeder(feederBiodataMahasiswa[0].tanggal_lahir_wali);

      return (
        // data mahasiswa
        // mahasiswaLocal.nama_mahasiswa !== mahasiswaFeeder[0].nama_mahasiswa ||
        // mahasiswaLocal.jenis_kelamin !== mahasiswaFeeder[0].jenis_kelamin ||
        // !areEqual(formatTanggalLahirMahasiswaLocal, mahasiswaFeeder[0].tanggal_lahir) ||
        // mahasiswaLocal.id_perguruan_tinggi !== mahasiswaFeeder[0].id_perguruan_tinggi ||
        // mahasiswaLocal.nipd !== mahasiswaFeeder[0].nipd ||
        // !areEqual(mahasiswaLocal.ipk, mahasiswaFeeder[0].ipk) ||
        // mahasiswaLocal.total_sks !== mahasiswaFeeder[0].total_sks ||
        // !areEqual(mahasiswaLocal.id_sms, mahasiswaFeeder[0].id_sms) ||
        // mahasiswaLocal.id_prodi !== mahasiswaFeeder[0].id_prodi ||
        // !areEqual(mahasiswaLocal.nama_status_mahasiswa, mahasiswaFeeder[0].nama_status_mahasiswa) ||
        // mahasiswaLocal.nim !== mahasiswaFeeder[0].nim ||
        // !areEqual(mahasiswaLocal.nama_periode_masuk, mahasiswaFeeder[0].nama_periode_masuk) ||
        // mahasiswaLocal.id_agama !== feederBiodataMahasiswa[0].id_agama ||
        // data biodata mahasiswa
        localBiodataMahasiswa.tempat_lahir !== feederBiodataMahasiswa[0].tempat_lahir ||
        !areEqual(localBiodataMahasiswa.nik, feederBiodataMahasiswa[0].nik) ||
        !areEqual(localBiodataMahasiswa.nisn, feederBiodataMahasiswa[0].nisn) ||
        !areEqual(localBiodataMahasiswa.npwp, feederBiodataMahasiswa[0].npwp) ||
        !areEqual(localBiodataMahasiswa.jalan, feederBiodataMahasiswa[0].jalan) ||
        !areEqual(localBiodataMahasiswa.dusun, feederBiodataMahasiswa[0].dusun) ||
        !areEqual(localBiodataMahasiswa.rt, feederBiodataMahasiswa[0].rt) ||
        !areEqual(localBiodataMahasiswa.rw, feederBiodataMahasiswa[0].rw) ||
        !areEqual(localBiodataMahasiswa.kelurahan, feederBiodataMahasiswa[0].kelurahan) ||
        !areEqual(localBiodataMahasiswa.kode_pos, feederBiodataMahasiswa[0].kode_pos) ||
        localBiodataMahasiswa.id_wilayah !== feederBiodataMahasiswa[0].id_wilayah ||
        !areEqual(localBiodataMahasiswa.id_jenis_tinggal, feederBiodataMahasiswa[0].id_jenis_tinggal) ||
        !areEqual(localBiodataMahasiswa.id_alat_transportasi, feederBiodataMahasiswa[0].id_alat_transportasi) ||
        !areEqual(localBiodataMahasiswa.telepon, feederBiodataMahasiswa[0].telepon) ||
        !areEqual(localBiodataMahasiswa.handphone, feederBiodataMahasiswa[0].handphone) ||
        !areEqual(localBiodataMahasiswa.email, feederBiodataMahasiswa[0].email) ||
        localBiodataMahasiswa.penerima_kps !== feederBiodataMahasiswa[0].penerima_kps ||
        !areEqual(localBiodataMahasiswa.nik_ayah, feederBiodataMahasiswa[0].nik_ayah) ||
        !areEqual(localBiodataMahasiswa.nama_ayah, feederBiodataMahasiswa[0].nama_ayah) ||
        !areEqual(formatTanggalLahirAyahLocal, feederBiodataMahasiswa[0].tanggal_lahir_ayah) ||
        !areEqual(localBiodataMahasiswa.id_pendidikan_ayah, feederBiodataMahasiswa[0].id_pendidikan_ayah) ||
        !areEqual(localBiodataMahasiswa.id_pekerjaan_ayah, feederBiodataMahasiswa[0].id_pekerjaan_ayah) ||
        !areEqual(localBiodataMahasiswa.id_penghasilan_ayah, feederBiodataMahasiswa[0].id_penghasilan_ayah) ||
        !areEqual(localBiodataMahasiswa.nik_ibu, feederBiodataMahasiswa[0].nik_ibu) ||
        !areEqual(localBiodataMahasiswa.nama_ibu_kandung, feederBiodataMahasiswa[0].nama_ibu_kandung) ||
        !areEqual(formatTanggalLahirIbuLocal, feederBiodataMahasiswa[0].tanggal_lahir_ibu) ||
        !areEqual(localBiodataMahasiswa.id_pendidikan_ibu, feederBiodataMahasiswa[0].id_pendidikan_ibu) ||
        !areEqual(localBiodataMahasiswa.id_pekerjaan_ibu, feederBiodataMahasiswa[0].id_pekerjaan_ibu) ||
        !areEqual(localBiodataMahasiswa.id_penghasilan_ibu, feederBiodataMahasiswa[0].id_penghasilan_ibu) ||
        !areEqual(localBiodataMahasiswa.nama_wali, feederBiodataMahasiswa[0].nama_wali) ||
        !areEqual(formatTanggalLahirWaliLocal, formatTanggalLahirWaliFeeder) ||
        !areEqual(localBiodataMahasiswa.id_pendidikan_wali, feederBiodataMahasiswa[0].id_pendidikan_wali) ||
        !areEqual(localBiodataMahasiswa.id_pekerjaan_wali, feederBiodataMahasiswa[0].id_pekerjaan_wali) ||
        !areEqual(localBiodataMahasiswa.id_penghasilan_wali, feederBiodataMahasiswa[0].id_penghasilan_wali) ||
        localBiodataMahasiswa.id_kebutuhan_khusus_mahasiswa !== feederBiodataMahasiswa[0].id_kebutuhan_khusus_mahasiswa ||
        localBiodataMahasiswa.id_kebutuhan_khusus_ayah !== feederBiodataMahasiswa[0].id_kebutuhan_khusus_ayah ||
        localBiodataMahasiswa.id_kebutuhan_khusus_ibu !== feederBiodataMahasiswa[0].id_kebutuhan_khusus_ibu
      );
    }

    // // Pengecekan data untuk jenis singkron delete (dinonaktifkan)
    // for (const feederBiodataMahasiswa of biodataMahasiswaFeeder) {
    //   const feederBiodataMahasiswaId = feederBiodataMahasiswa.id_mahasiswa;

    //   // Cari data di lokal berdasarkan id_feeder
    //   const localBiodataMahasiswa = biodataLocalMap[feederBiodataMahasiswaId];

    //   // Jika data Feeder tidak ada di Lokal
    //   if (!localBiodataMahasiswa) {
    //     const existingSync = await BiodataMahasiswaSync.findOne({
    //       where: {
    //         id_feeder: feederBiodataMahasiswaId,
    //         jenis_singkron: "delete",
    //         status: false,
    //         id_mahasiswa: null,
    //       },
    //     });

    //     // Jika belum ada sinkronisasi, tambahkan
    //     if (!existingSync) {
    //       await BiodataMahasiswaSync.create({
    //         jenis_singkron: "delete",
    //         status: false,
    //         id_feeder: feederBiodataMahasiswaId,
    //         id_mahasiswa: null,
    //       });
    //       console.log(`Data biodata mahasiswa ${feederBiodataMahasiswaId} ditambahkan ke sinkronisasi dengan jenis 'delete'.`);
    //     }
    //   }
    // }

    // mengecek jikalau data biodata mahasiswa tidak ada di local namun ada di feeder, maka data biodata mahasiswa di feeder akan tercatat sebagai get
    for (let feederBiodataMahasiswaId in mahasiswaFeederMap) {
      const localBiodataMahasiswa = await BiodataMahasiswa.findOne({
        where: {
          id_feeder: feederBiodataMahasiswaId,
        },
        attributes: ["id_feeder", "id_mahasiswa"],
      });

      if (!localBiodataMahasiswa) {
        const feederBiodataMahasiswa = mahasiswaFeederMap[feederBiodataMahasiswaId];

        const existingSync = await BiodataMahasiswaSync.findOne({
          where: {
            id_feeder: feederBiodataMahasiswa.id_mahasiswa,
            jenis_singkron: "get",
            status: false,
            id_mahasiswa: null,
          },
        });

        if (!existingSync) {
          await BiodataMahasiswaSync.create({
            jenis_singkron: "get",
            status: false,
            id_feeder: feederBiodataMahasiswa.id_mahasiswa,
            id_mahasiswa: null,
          });
          console.log(`Data biodata mahasiswa ${feederBiodataMahasiswa.id_mahasiswa} ditambahkan ke sinkronisasi dengan jenis 'get'.`);
        }
      }
    }

    console.log("Matching biodata mahasiswa lokal ke feeder berhasil.");
  } catch (error) {
    console.error("Error during matchingDataBiodataMahasiswa:", error.message);
    throw error;
  }
}

const matchingSyncDataBiodataMahasiswa = async (req, res, next) => {
  try {
    await matchingDataBiodataMahasiswa(req, res, next);
    res.status(200).json({ message: "Matching biodata mahasiswa lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// matching khusus untuk delete
async function matchingDataBiodataMahasiswaDelete(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    // get mahasiswa local dan bioodata mahasiswa feeder
    const biodataMahasiswaLocal = await getBiodataMahasiswaFromLocal(semesterId);
    const biodataMahasiswaFeeder = await getBiodataMahasiswaFromFeeder();

    // biodata mahasiswa feeder map
    const biodataMahasiswaFeederMap = biodataMahasiswaFeeder.reduce((map, biodata_mahasiswa) => {
      map[biodata_mahasiswa.id_mahasiswa] = biodata_mahasiswa;
      return map;
    }, {});

    // Mencari data yang tidak ada di Feeder
    const dataTidakAdaDiFeeder = biodataMahasiswaLocal.filter((item) => !biodataMahasiswaFeederMap[item.id_feeder]);

    // Jika ada data yang harus disinkronkan
    if (dataTidakAdaDiFeeder.length > 0) {
      // Ambil semua data yang sudah ada di tabel sinkronisasi untuk mencegah duplikasi
      const existingSyncData = await BiodataMahasiswaSync.findAll({
        where: {
          jenis_singkron: "delete",
          status: false,
          id_feeder: null,
          id_mahasiswa: dataTidakAdaDiFeeder.map((item) => item.id_mahasiswa),
        },
        attributes: ["id_mahasiswa"],
      });

      // Buat set untuk menyimpan id_mahasiswa yang sudah ada di database
      const existingSyncIds = new Set(existingSyncData.map((item) => item.id_mahasiswa));

      // Filter hanya data yang belum ada di tabel sinkronisasi
      const dataInsert = dataTidakAdaDiFeeder
        .filter((item) => !existingSyncIds.has(item.id_mahasiswa))
        .map((item) => ({
          jenis_singkron: "delete",
          status: false,
          id_feeder: null,
          id_mahasiswa: item.id_mahasiswa,
        }));

      // Jika ada data yang benar-benar baru, lakukan bulk insert
      if (dataInsert.length > 0) {
        await BiodataMahasiswaSync.bulkCreate(dataInsert);
        console.log(`${dataInsert.length} data baru berhasil ditambahkan ke sinkron sementara dengan jenis delete.`);
      } else {
        console.log("Tidak ada data baru untuk disinkronkan.");
      }
    }

    console.log("Matching biodata mahasiswa  delete lokal ke feeder berhasil.");
  } catch (error) {
    console.error("Error during matchingDataBiodataMahasiswa:", error.message);
    throw error;
  }
}

const matchingSyncDataBiodataMahasiswaDelete = async (req, res, next) => {
  try {
    await matchingDataBiodataMahasiswaDelete(req, res, next);
    res.status(200).json({ message: "Matching biodata mahasiswa delete lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

// fungsi singkron biodata mahasiswa
const insertBiodataMahasiswa = async (id_mahasiswa, req, res, next) => {
  try {
    // get data biodata mahasiswa from local
    let biodata_mahasiswa = await BiodataMahasiswa.findByPk(id_mahasiswa);

    if (!biodata_mahasiswa) {
      return res.status(404).json({ message: "Biodata mahasiswa not found" });
    }

    // get data mahasiswa from local
    const mahasiswa = await Mahasiswa.findOne({
      where: {
        id_mahasiswa: biodata_mahasiswa.id_mahasiswa,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa not found" });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // Helper function untuk konversi tanggal
    function formatTanggal(tanggal) {
      if (tanggal) {
        const date = new Date(tanggal); // Konversi ke Date
        if (!isNaN(date)) {
          return date.toISOString().split("T")[0]; // Format ke YYYY-MM-DD
        }
      }
      return null; // Jika tidak valid, kembalikan null
    }

    tanggal_lahir = formatTanggal(mahasiswa.tanggal_lahir);
    tanggal_lahir_ayah = formatTanggal(biodata_mahasiswa.tanggal_lahir_ayah);
    tanggal_lahir_ibu = formatTanggal(biodata_mahasiswa.tanggal_lahir_ibu);
    tanggal_lahir_wali = formatTanggal(biodata_mahasiswa.tanggal_lahir_wali);

    // akan insert data biodata mahasiswa dan mahasiswa ke feeder
    const requestBody = {
      act: "InsertBiodataMahasiswa",
      token: `${token}`,
      record: {
        // data mahasiswa
        nama_mahasiswa: mahasiswa.nama_mahasiswa,
        jenis_kelamin: mahasiswa.jenis_kelamin,
        tanggal_lahir: tanggal_lahir,
        id_agama: mahasiswa.id_agama,

        // data biodata mahasiswa
        tempat_lahir: biodata_mahasiswa.tempat_lahir,
        nik: biodata_mahasiswa.nik,
        nisn: biodata_mahasiswa.nisn,
        kewarganegaraan: "ID",
        jalan: biodata_mahasiswa.jalan,
        dusun: biodata_mahasiswa.dusun,
        rt: biodata_mahasiswa.rt,
        rw: biodata_mahasiswa.rw,
        kelurahan: biodata_mahasiswa.kelurahan,
        kode_pos: biodata_mahasiswa.kode_pos,
        id_wilayah: biodata_mahasiswa.id_wilayah,
        id_jenis_tinggal: biodata_mahasiswa.id_jenis_tinggal,
        id_alat_transportasi: biodata_mahasiswa.id_alat_transportasi,
        telepon: biodata_mahasiswa.telepon,
        handphone: biodata_mahasiswa.handphone,
        email: biodata_mahasiswa.email,
        penerima_kps: biodata_mahasiswa.penerima_kps,
        penerima_kps: biodata_mahasiswa.penerima_kps,
        nomor_kps: null,
        nik_ayah: biodata_mahasiswa.nik_ayah,
        nama_ayah: biodata_mahasiswa.nama_ayah,
        tanggal_lahir_ayah: tanggal_lahir_ayah,
        id_pendidikan_ayah: biodata_mahasiswa.id_pendidikan_ayah,
        id_pekerjaan_ayah: biodata_mahasiswa.id_pekerjaan_ayah,
        id_penghasilan_ayah: biodata_mahasiswa.id_penghasilan_ayah,
        nik_ibu: biodata_mahasiswa.nik_ibu,
        nama_ibu_kandung: biodata_mahasiswa.nama_ibu_kandung,
        tanggal_lahir_ibu: tanggal_lahir_ibu,
        id_pendidikan_ibu: biodata_mahasiswa.id_pendidikan_ibu,
        id_pekerjaan_ibu: biodata_mahasiswa.id_pekerjaan_ibu,
        id_penghasilan_ibu: biodata_mahasiswa.id_penghasilan_ibu,
        npwp: biodata_mahasiswa.npwp,
        nama_wali: biodata_mahasiswa.nama_wali,
        tanggal_lahir_wali: tanggal_lahir_wali,
        id_pendidikan_wali: biodata_mahasiswa.id_pendidikan_wali,
        id_pekerjaan_wali: biodata_mahasiswa.id_pekerjaan_wali,
        id_penghasilan_wali: biodata_mahasiswa.id_penghasilan_wali,
        id_kebutuhan_khusus_mahasiswa: biodata_mahasiswa.id_kebutuhan_khusus_mahasiswa,
        id_kebutuhan_khusus_ayah: biodata_mahasiswa.id_kebutuhan_khusus_ayah,
        id_kebutuhan_khusus_ibu: biodata_mahasiswa.id_kebutuhan_khusus_ibu,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // Mendapatkan id_mahasiswa dari response feeder
    const idMahasiswa = response.data.data.id_mahasiswa;

    // update id_feeder dan last sync pada biodata mahasiswa local
    biodata_mahasiswa.id_feeder = idMahasiswa;
    biodata_mahasiswa.last_sync = new Date();
    await biodata_mahasiswa.save();

    // update status pada biodata_mahasiswa_sync local
    let biodata_mahasiswa_sync = await BiodataMahasiswaSync.findOne({
      where: {
        id_mahasiswa: id_mahasiswa,
        status: false,
        jenis_singkron: "create",
        id_feeder: null,
      },
    });

    if (!biodata_mahasiswa_sync) {
      return res.status(404).json({ message: "Biodata mahasiswa sync not found" });
    }

    biodata_mahasiswa_sync.status = true;
    await biodata_mahasiswa_sync.save();

    // result
    console.log(`Successfully inserted biodata mahasiswa with ID ${biodata_mahasiswa_sync.id_mahasiswa} to feeder`);
  } catch (error) {
    next(error);
  }
};

const updateBiodataMahasiswa = async (id_mahasiswa, req, res, next) => {
  try {
    // get data biodata mahasiswa from local
    let biodata_mahasiswa = await BiodataMahasiswa.findByPk(id_mahasiswa);

    if (!biodata_mahasiswa) {
      return res.status(404).json({ message: "Biodata mahasiswa not found" });
    }

    if (biodata_mahasiswa.id_feeder == null || biodata_mahasiswa.id_feeder == "") {
      return res.status(404).json({ message: `Biodata mahasiswa dengan ID ${biodata_mahasiswa.id_mahasiswa} belum dilakukan singkron ke feeder` });
    }

    // get data mahasiswa from local
    const mahasiswa = await Mahasiswa.findOne({
      where: {
        id_mahasiswa: biodata_mahasiswa.id_mahasiswa,
      },
    });

    if (!mahasiswa) {
      return res.status(404).json({ message: "Mahasiswa not found" });
    }

    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // Helper function untuk konversi tanggal
    function formatTanggal(tanggal) {
      if (tanggal) {
        const date = new Date(tanggal); // Konversi ke Date
        if (!isNaN(date)) {
          return date.toISOString().split("T")[0]; // Format ke YYYY-MM-DD
        }
      }
      return null; // Jika tidak valid, kembalikan null
    }

    tanggal_lahir = formatTanggal(mahasiswa.tanggal_lahir);
    tanggal_lahir_ayah = formatTanggal(biodata_mahasiswa.tanggal_lahir_ayah);
    tanggal_lahir_ibu = formatTanggal(biodata_mahasiswa.tanggal_lahir_ibu);
    tanggal_lahir_wali = formatTanggal(biodata_mahasiswa.tanggal_lahir_wali);

    // akan update data biodata mahasiswa dan biodata mahasiswa ke feeder
    const requestBody = {
      act: "UpdateBiodataMahasiswa",
      token: `${token}`,
      key: {
        id_mahasiswa: biodata_mahasiswa.id_feeder,
      },
      record: {
        // data mahasiswa
        nama_mahasiswa: mahasiswa.nama_mahasiswa,
        jenis_kelamin: mahasiswa.jenis_kelamin,
        tanggal_lahir: tanggal_lahir,
        id_agama: mahasiswa.id_agama,

        // data biodata mahasiswa
        tempat_lahir: biodata_mahasiswa.tempat_lahir,
        nik: biodata_mahasiswa.nik,
        nisn: biodata_mahasiswa.nisn,
        kewarganegaraan: "ID",
        jalan: biodata_mahasiswa.jalan,
        dusun: biodata_mahasiswa.dusun,
        rt: biodata_mahasiswa.rt,
        rw: biodata_mahasiswa.rw,
        kelurahan: biodata_mahasiswa.kelurahan,
        kode_pos: biodata_mahasiswa.kode_pos,
        id_wilayah: biodata_mahasiswa.id_wilayah,
        id_jenis_tinggal: biodata_mahasiswa.id_jenis_tinggal,
        id_alat_transportasi: biodata_mahasiswa.id_alat_transportasi,
        telepon: biodata_mahasiswa.telepon,
        handphone: biodata_mahasiswa.handphone,
        email: biodata_mahasiswa.email,
        penerima_kps: biodata_mahasiswa.penerima_kps,
        penerima_kps: biodata_mahasiswa.penerima_kps,
        nomor_kps: null,
        nik_ayah: biodata_mahasiswa.nik_ayah,
        nama_ayah: biodata_mahasiswa.nama_ayah,
        tanggal_lahir_ayah: tanggal_lahir_ayah,
        id_pendidikan_ayah: biodata_mahasiswa.id_pendidikan_ayah,
        id_pekerjaan_ayah: biodata_mahasiswa.id_pekerjaan_ayah,
        id_penghasilan_ayah: biodata_mahasiswa.id_penghasilan_ayah,
        nik_ibu: biodata_mahasiswa.nik_ibu,
        nama_ibu_kandung: biodata_mahasiswa.nama_ibu_kandung,
        tanggal_lahir_ibu: tanggal_lahir_ibu,
        id_pendidikan_ibu: biodata_mahasiswa.id_pendidikan_ibu,
        id_pekerjaan_ibu: biodata_mahasiswa.id_pekerjaan_ibu,
        id_penghasilan_ibu: biodata_mahasiswa.id_penghasilan_ibu,
        npwp: biodata_mahasiswa.npwp,
        nama_wali: biodata_mahasiswa.nama_wali,
        tanggal_lahir_wali: tanggal_lahir_wali,
        id_pendidikan_wali: biodata_mahasiswa.id_pendidikan_wali,
        id_pekerjaan_wali: biodata_mahasiswa.id_pekerjaan_wali,
        id_penghasilan_wali: biodata_mahasiswa.id_penghasilan_wali,
        id_kebutuhan_khusus_mahasiswa: biodata_mahasiswa.id_kebutuhan_khusus_mahasiswa,
        id_kebutuhan_khusus_ayah: biodata_mahasiswa.id_kebutuhan_khusus_ayah,
        id_kebutuhan_khusus_ibu: biodata_mahasiswa.id_kebutuhan_khusus_ibu,
      },
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // update status pada biodata_mahasiswa_sync local
    let biodata_mahasiswa_sync = await BiodataMahasiswaSync.findOne({
      where: {
        id_mahasiswa: id_mahasiswa,
        status: false,
        jenis_singkron: "update",
        id_feeder: biodata_mahasiswa.id_feeder,
      },
    });

    if (!biodata_mahasiswa_sync) {
      return res.status(404).json({ message: "Biodata mahasiswa sync not found" });
    }

    biodata_mahasiswa_sync.status = true;
    await biodata_mahasiswa_sync.save();

    // update last sync pada biodata mahasiswa
    biodata_mahasiswa.last_sync = new Date();
    await biodata_mahasiswa.save();

    // result
    console.log(`Successfully updated biodata mahasiswa with ID Feeder ${biodata_mahasiswa_sync.id_feeder} to feeder`);
  } catch (error) {
    next(error);
  }
};

// dinonaktifkan
// const deleteBiodatMahasiswa = async (id_feeder, req, res, next) => {
//   try {
//     // Mendapatkan token
//     const { token, url_feeder } = await getToken();

//     // akan delete data biodata mahasiswa dan mahasiswa ke feeder
//     const requestBody = {
//       act: "DeleteBiodataMahasiswa",
//       token: `${token}`,
//       key: {
//         id_mahasiswa: id_feeder,
//       },
//     };

//     // Menggunakan token untuk mengambil data
//     const response = await axios.post(url_feeder, requestBody);

//     // Mengecek jika ada error pada respons dari server
//     if (response.data.error_code !== 0) {
//       throw new Error(`Error from Feeder: ${response.data.error_desc}`);
//     }

//     // update status pada biodata_mahasiswa_sync local
//     let biodata_mahasiswa_sync = await BiodataMahasiswaSync.findOne({
//       where: {
//         id_feeder: id_feeder,
//         status: false,
//         jenis_singkron: "delete",
//         id_mahasiswa: null,
//       },
//     });

//     if (!biodata_mahasiswa_sync) {
//       return res.status(404).json({ message: "Biodata mahasiswa sync not found" });
//     }

//     biodata_mahasiswa_sync.status = true;
//     await biodata_mahasiswa_sync.save();

//     // result
//     console.log(`Successfully deleted biodata mahasiswa with ID Feeder ${biodata_mahasiswa_sync.id_feeder} to feeder`);
//   } catch (error) {
//     next(error);
//   }
// };

// untuk create data feeder ke local
const getAndCreateBiodatMahasiswa = async (id_feeder, req, res, next) => {
  try {
    // Mendapatkan token
    const { token, url_feeder } = await getToken();

    // akan delete data biodata mahasiswa dan mahasiswa ke feeder
    const requestBody = {
      act: "GetBiodataMahasiswa",
      token: `${token}`,
      filter: `id_mahasiswa='${id_feeder}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post(url_feeder, requestBody);

    // Mengecek jika ada error pada respons dari server
    if (response.data.error_code !== 0) {
      throw new Error(`Error from Feeder: ${response.data.error_desc}`);
    }

    // Tanggapan dari API
    const dataBiodataMahasiswa = response.data.data;

    for (const biodata_mahasiswa of dataBiodataMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingBiodataMahasiswa = await BiodataMahasiswa.findOne({
        where: {
          id_feeder: biodata_mahasiswa.id_mahasiswa,
        },
      });

      let id_wilayah = null;

      // Periksa apakah id_wilayah Wilayah
      const wilayah = await Wilayah.findOne({
        where: {
          id_wilayah: biodata_mahasiswa.id_wilayah,
        },
      });

      // Jika ditemukan, simpan nilainya
      if (wilayah) {
        id_wilayah = wilayah.id_wilayah;
      }

      if (!existingBiodataMahasiswa) {
        // Data belum ada, buat entri baru di database
        let data_tanggal_lahir_ayah = null;
        let data_tanggal_lahir_ibu = null;
        let data_tanggal_lahir_wali = null;

        // tanggal lahir ayah
        if (biodata_mahasiswa.tanggal_lahir_ayah != null) {
          const dateParts = biodata_mahasiswa.tanggal_lahir_ayah.split("-");
          data_tanggal_lahir_ayah = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }

        // tanggal lahir ibu
        if (biodata_mahasiswa.tanggal_lahir_ibu != null) {
          const dateParts = biodata_mahasiswa.tanggal_lahir_ibu.split("-");
          data_tanggal_lahir_ibu = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }

        // tanggal lahir wali
        if (biodata_mahasiswa.tanggal_lahir_wali != null) {
          const dateParts = biodata_mahasiswa.tanggal_lahir_wali.split("-");
          data_tanggal_lahir_wali = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }

        await BiodataMahasiswa.create({
          id_mahasiswa: biodata_mahasiswa.id_mahasiswa,
          tempat_lahir: biodata_mahasiswa.tempat_lahir,
          nik: biodata_mahasiswa.nik,
          nisn: biodata_mahasiswa.nisn,
          npwp: biodata_mahasiswa.npwp,
          kewarganegaraan: biodata_mahasiswa.kewarganegaraan,
          jalan: biodata_mahasiswa.jalan,
          dusun: biodata_mahasiswa.dusun,
          rt: biodata_mahasiswa.rt,
          rw: biodata_mahasiswa.rw,
          kelurahan: biodata_mahasiswa.kelurahan,
          kode_pos: biodata_mahasiswa.kode_pos,
          telepon: biodata_mahasiswa.telepon,
          handphone: biodata_mahasiswa.handphone,
          email: biodata_mahasiswa.email,
          penerima_kps: biodata_mahasiswa.penerima_kps,
          nomor_kps: biodata_mahasiswa.nomor_kps,
          nik_ayah: biodata_mahasiswa.nik_ayah,
          nama_ayah: biodata_mahasiswa.nama_ayah,
          tanggal_lahir_ayah: data_tanggal_lahir_ayah,
          nik_ibu: biodata_mahasiswa.nik_ibu,
          nama_ibu_kandung: biodata_mahasiswa.nama_ibu_kandung,
          tanggal_lahir_ibu: data_tanggal_lahir_ibu,
          nama_wali: biodata_mahasiswa.nama_wali,
          tanggal_lahir_wali: data_tanggal_lahir_wali,
          last_sync: new Date(),
          id_feeder: biodata_mahasiswa.id_mahasiswa,
          id_wilayah: id_wilayah,
          id_jenis_tinggal: biodata_mahasiswa.id_jenis_tinggal,
          id_alat_transportasi: biodata_mahasiswa.id_alat_transportasi,
          id_pendidikan_ayah: biodata_mahasiswa.id_pendidikan_ayah,
          id_pekerjaan_ayah: biodata_mahasiswa.id_pekerjaan_ayah,
          id_penghasilan_ayah: biodata_mahasiswa.id_penghasilan_ayah,
          id_pendidikan_ibu: biodata_mahasiswa.id_pendidikan_ibu,
          id_pekerjaan_ibu: biodata_mahasiswa.id_pekerjaan_ibu,
          id_penghasilan_ibu: biodata_mahasiswa.id_penghasilan_ibu,
          id_pendidikan_wali: biodata_mahasiswa.id_pendidikan_wali,
          id_pekerjaan_wali: biodata_mahasiswa.id_pekerjaan_wali,
          id_penghasilan_wali: biodata_mahasiswa.id_penghasilan_wali,
          id_kebutuhan_khusus_mahasiswa: biodata_mahasiswa.id_kebutuhan_khusus_mahasiswa,
          id_kebutuhan_khusus_ayah: biodata_mahasiswa.id_kebutuhan_khusus_ayah,
          id_kebutuhan_khusus_ibu: biodata_mahasiswa.id_kebutuhan_khuibuayah,
        });
      }
    }

    // update status pada biodata_mahasiswa_sync local
    let biodata_mahasiswa_sync = await BiodataMahasiswaSync.findOne({
      where: {
        id_feeder: id_feeder,
        status: false,
        jenis_singkron: "get",
        id_mahasiswa: null,
      },
    });

    if (!biodata_mahasiswa_sync) {
      return res.status(404).json({ message: "Biodata mahasiswa sync not found" });
    }

    biodata_mahasiswa_sync.status = true;
    await biodata_mahasiswa_sync.save();

    // result
    console.log(`Successfully inserted biodata mahasiswa with ID Feeder ${biodata_mahasiswa_sync.id_feeder} to feeder`);
  } catch (error) {
    next(error);
  }
};

const deleteBiodataMahasiswaLocal = async (id_mahasiswa, req, res, next) => {
  try {
    const biodata_mahasiswa = await BiodataMahasiswa.findByPk(id_mahasiswa);

    if (!biodata_mahasiswa) {
      return res.status(400).json({
        message: "Biodata Mahasiswa not found",
      });
    }

    // delete biodata mahasiswa
    await biodata_mahasiswa.destroy();

    console.log(`Successfully deleted biodata mahasiswa in local with ID ${id_mahasiswa}`);
  } catch (error) {
    next(error);
  }
};

const syncBiodataMahasiswas = async (req, res, next) => {
  try {
    const { biodata_mahasiswa_syncs } = req.body;

    // Validasi input
    if (!biodata_mahasiswa_syncs || !Array.isArray(biodata_mahasiswa_syncs)) {
      return res.status(400).json({ message: "Request body tidak valid" });
    }

    // perulangan untuk aksi data biodata mahasiswa berdasarkan jenis singkron
    for (const biodata_mahasiswa_sync of biodata_mahasiswa_syncs) {
      // get data biodata mahasiswa sync
      const data_biodata_mahasiswa_sync = await BiodataMahasiswaSync.findByPk(biodata_mahasiswa_sync.id);

      if (!data_biodata_mahasiswa_sync) {
        return res.status(404).json({ message: "Data Biodata mahasiswa sync not found" });
      }

      if (data_biodata_mahasiswa_sync.status === false) {
        if (data_biodata_mahasiswa_sync.jenis_singkron === "create") {
          await insertBiodataMahasiswa(data_biodata_mahasiswa_sync.id_mahasiswa, req, res, next);
        } else if (data_biodata_mahasiswa_sync.jenis_singkron === "update") {
          await updateBiodataMahasiswa(data_biodata_mahasiswa_sync.id_mahasiswa, req, res, next);
        } else if (data_biodata_mahasiswa_sync.jenis_singkron === "get") {
          await getAndCreateBiodatMahasiswa(data_biodata_mahasiswa_sync.id_feeder, req, res, next);
        } else if (data_biodata_mahasiswa_sync.jenis_singkron === "delete") {
          await deleteBiodataMahasiswaLocal(data_biodata_mahasiswa_sync.id_mahasiswa, req, res, next);
        }
        // dinonaktifkan
        // else if (data_biodata_mahasiswa_sync.jenis_singkron === "delete") {
        //   await deleteBiodatMahasiswa(data_biodata_mahasiswa_sync.id_feeder, req, res, next);
        // }
      } else {
        console.log(`Data Biodata Mahasiswa Sync dengan ID ${data_biodata_mahasiswa_sync.id} tidak valid untuk dilakukan singkron`);
      }
    }

    // return
    return res.status(200).json({ message: "Singkron biodata mahasiswa lokal ke feeder berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  matchingDataBiodataMahasiswa,
  matchingSyncDataBiodataMahasiswa,
  matchingSyncDataBiodataMahasiswaDelete,
  syncBiodataMahasiswas,
};
