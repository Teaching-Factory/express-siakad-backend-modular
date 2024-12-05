const { DetailNilaiPerkuliahanKelas, KelasKuliah } = require("../../../../models");
const { getToken } = require("../../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar detail nilai perkuliahan kelas dari Feeder
async function getDetailNilaiPerkuliahanKelasFromFeeder(semesterId) {
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
      act: "GetDetailNilaiPerkuliahanKelas",
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

// Fungsi untuk mendapatkan daftar detail nilai perkuliahan kelas dari database lokal
async function getDetailNilaiPerkuliahanKelasFromLocal(semesterId) {
  try {
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    return await DetailNilaiPerkuliahanKelas.findAll({
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

// Fungsi utama untuk sinkronisasi detail nilai perkuliahan kelas
async function syncDataDetailNilaiPerkuliahanKelas(req, res, next) {
  try {
    // Dapatkan ID dari parameter permintaan
    const semesterId = req.params.id_semester;

    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }

    const detailNilaiPerkuliahanKelasFeeder = await getDetailNilaiPerkuliahanKelasFromFeeder(semesterId);
    const detailNilaiPerkuliahanKelasLocal = await getDetailNilaiPerkuliahanKelasFromLocal(semesterId);

    const localMap = detailNilaiPerkuliahanKelasLocal.reduce((map, detail_nilai_perkuliahan_kelas) => {
      map[detail_nilai_perkuliahan_kelas.id_detail_nilai_perkuliahan_kelas] = detail_nilai_perkuliahan_kelas;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal
    for (let feederDetailNilaiPerkuliahanKelas of detailNilaiPerkuliahanKelasFeeder) {
      const key = `${feederDetailNilaiPerkuliahanKelas.id_kelas_kuliah}_${feederDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa}`;

      if (!localMap[key]) {
        // Buat entri baru detail nilai perkuliahan kelas
        await DetailNilaiPerkuliahanKelas.create({
          jurusan: feederDetailNilaiPerkuliahanKelas.jurusan,
          angkatan: feederDetailNilaiPerkuliahanKelas.angkatan,
          nilai_angka: feederDetailNilaiPerkuliahanKelas.nilai_angka,
          nilai_indeks: feederDetailNilaiPerkuliahanKelas.nilai_indeks,
          nilai_huruf: feederDetailNilaiPerkuliahanKelas.nilai_huruf,
          id_kelas_kuliah: feederDetailNilaiPerkuliahanKelas.id_kelas_kuliah,
          id_registrasi_mahasiswa: feederDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa,
        });

        console.log(`Data detail nilai perkuliahan kelas By Mahasiswa ID ${feederDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localDetailNilaiPerkuliahanKelas = localMap[key];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederDetailNilaiPerkuliahanKelas.jurusan !== localDetailNilaiPerkuliahanKelas.jurusan ||
          feederDetailNilaiPerkuliahanKelas.angkatan !== localDetailNilaiPerkuliahanKelas.angkatan ||
          feederDetailNilaiPerkuliahanKelas.nilai_angka !== localDetailNilaiPerkuliahanKelas.nilai_angka ||
          feederDetailNilaiPerkuliahanKelas.nilai_indeks !== localDetailNilaiPerkuliahanKelas.nilai_indeks ||
          feederDetailNilaiPerkuliahanKelas.nilai_huruf !== localDetailNilaiPerkuliahanKelas.nilai_huruf ||
          feederDetailNilaiPerkuliahanKelas.id_kelas_kuliah !== localDetailNilaiPerkuliahanKelas.id_kelas_kuliah ||
          feederDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa !== localDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa
        ) {
          await DetailNilaiPerkuliahanKelas.update(
            {
              jurusan: feederDetailNilaiPerkuliahanKelas.jurusan,
              angkatan: feederDetailNilaiPerkuliahanKelas.angkatan,
              nilai_angka: feederDetailNilaiPerkuliahanKelas.nilai_angka,
              nilai_indeks: feederDetailNilaiPerkuliahanKelas.nilai_indeks,
              nilai_huruf: feederDetailNilaiPerkuliahanKelas.nilai_huruf,
              id_kelas_kuliah: feederDetailNilaiPerkuliahanKelas.id_kelas_kuliah,
              id_registrasi_mahasiswa: feederDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa,
            },
            {
              where: {
                id_kelas_kuliah: feederDetailNilaiPerkuliahanKelas.id_kelas_kuliah,
                id_registrasi_mahasiswa: feederDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa,
              },
            }
          );

          console.log(`Data detail nilai perkuliahan kelas By Mahasiswa ID ${feederDetailNilaiPerkuliahanKelas.id_registrasi_mahasiswa} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi detail nilai perkuliahan kelas selesai.");
  } catch (error) {
    console.error("Error during syncDetailNilaiPerkuliahanKelas:", error.message);
    throw error;
  }
}

const synceDetailNilaiPerkuliahanKelas = async (req, res, next) => {
  try {
    await syncDataDetailNilaiPerkuliahanKelas(req, res, next);
    res.status(200).json({ message: "Sinkronisasi detail nilai perkuliahan kelas berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  synceDetailNilaiPerkuliahanKelas,
};
