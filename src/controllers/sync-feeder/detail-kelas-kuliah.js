const { DetailKelasKuliah, KelasKuliah } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar detail kelas kuliah dari Feeder
async function getDetailKelasKuliahFromFeeder(semesterId) {
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
      act: "GetSemester",
      token: token,
      filter: `id_semester = '${semesterId}'`,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar detail kelas kuliah dari database lokal
async function getDetailKelasKuliahFromLocal(semesterId) {
  try {
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    return await DetailKelasKuliah.findAll({
      include: [
        {
          model: KelasKuliah,
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

// Fungsi utama untuk sinkronisasi detail kelas kuliah
async function syncDataDetailKelasKuliah() {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    const detailKelasKuliahFeeder = await getDetailKelasKuliahFromFeeder(semesterId);
    const detailKelasKuliahLocal = await getDetailKelasKuliahFromLocal(semesterId);

    const localMap = detailKelasKuliahLocal.reduce((map, detail_kelas_kuliah) => {
      map[detail_kelas_kuliah.id_kelas_kuliah] = detail_kelas_kuliah;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal
    for (let feederDetailKelasKuliah of detailKelasKuliahFeeder) {
      if (!localMap[feederDetailKelasKuliah.id_kelas_kuliah]) {
        let tanggal_mulai, tanggal_akhir;

        //   melakukan konversi data tanggal
        if (feederDetailKelasKuliah.tanggal_mulai_efektif != null) {
          const date_start = feederDetailKelasKuliah.tanggal_mulai_efektif.split("-");
          tanggal_mulai = `${date_start[2]}-${date_start[1]}-${date_start[0]}`;
        }

        if (feederDetailKelasKuliah.tanggal_akhir_efektif != null) {
          const date_end = feederDetailKelasKuliah.tanggal_akhir_efektif.split("-");
          tanggal_akhir = `${date_end[2]}-${date_end[1]}-${date_end[0]}`;
        }

        // Buat entri baru detail kelas kuliah
        await DetailKelasKuliah.create({
          bahasan: feederDetailKelasKuliah.bahasan,
          tanggal_mulai_efektif: tanggal_mulai,
          tanggal_akhir_efektif: tanggal_akhir,
          kapasitas: feederDetailKelasKuliah.kapasitas,
          tanggal_tutup_daftar: feederDetailKelasKuliah.tanggal_tutup_daftar,
          prodi_penyelenggara: feederDetailKelasKuliah.prodi_penyelenggara,
          perguruan_tinggi_penyelenggara: feederDetailKelasKuliah.perguruan_tinggi_penyelenggara,
          id_kelas_kuliah: feederDetailKelasKuliah.id_kelas_kuliah,
        });

        console.log(`Data detail kelas kuliah By Kelas Kuliah ID ${feederDetailKelasKuliah.id_kelas_kuliah} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localDetailKelasKuliah = localMap[feederDetailKelasKuliah.id_kelas_kuliah];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederDetailKelasKuliah.bahasan !== localDetailKelasKuliah.bahasan ||
          feederDetailKelasKuliah.tanggal_mulai_efektif !== localDetailKelasKuliah.tanggal_mulai_efektif ||
          feederDetailKelasKuliah.tanggal_akhir_efektif !== localDetailKelasKuliah.tanggal_akhir_efektif ||
          feederDetailKelasKuliah.kapasitas !== localDetailKelasKuliah.kapasitas ||
          feederDetailKelasKuliah.tanggal_tutup_daftar !== localDetailKelasKuliah.tanggal_tutup_daftar ||
          feederDetailKelasKuliah.prodi_penyelenggara !== localDetailKelasKuliah.prodi_penyelenggara ||
          feederDetailKelasKuliah.perguruan_tinggi_penyelenggara !== localDetailKelasKuliah.perguruan_tinggi_penyelenggara ||
          feederDetailKelasKuliah.id_kelas_kuliah !== localDetailKelasKuliah.id_kelas_kuliah
        ) {
          await DetailKelasKuliah.update(
            {
              bahasan: feederDetailKelasKuliah.bahasan,
              tanggal_mulai_efektif: feederDetailKelasKuliah.tanggal_mulai_efektif,
              tanggal_akhir_efektif: feederDetailKelasKuliah.tanggal_akhir_efektif,
              kapasitas: feederDetailKelasKuliah.kapasitas,
              tanggal_tutup_daftar: feederDetailKelasKuliah.tanggal_tutup_daftar,
              prodi_penyelenggara: feederDetailKelasKuliah.prodi_penyelenggara,
              perguruan_tinggi_penyelenggara: feederDetailKelasKuliah.perguruan_tinggi_penyelenggara,
              id_kelas_kuliah: feederDetailKelasKuliah.id_kelas_kuliah,
            },
            { where: { id_kelas_kuliah: feederDetailKelasKuliah.id_kelas_kuliah } }
          );

          console.log(`Data kelas kuliah By Kelas Kuliah ID ${feederDetailKelasKuliah.id_kelas_kuliah} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi detail kelas kuliah selesai.");
  } catch (error) {
    console.error("Error during syncDetailKelasKuliah:", error.message);
    throw error;
  }
}

const syncDetailKelasKuliah = async (req, res, next) => {
  try {
    await syncDataDetailKelasKuliah();
    res.status(200).json({ message: "Sinkronisasi detail kelas kuliah berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncDetailKelasKuliah,
};
