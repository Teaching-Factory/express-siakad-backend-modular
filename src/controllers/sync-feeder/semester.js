const { Semester } = require("../../../models");
const { getToken } = require("../api-feeder/get-token");
const axios = require("axios");

// Fungsi untuk mendapatkan daftar semester dari Feeder
async function getSemesterFromFeeder() {
  try {
    const { token, url_feeder } = await getToken();

    if (!token || !url_feeder) {
      throw new Error("Failed to obtain token or URL feeder");
    }

    const requestBody = {
      act: "GetSemester",
      token: token,
    };

    const response = await axios.post(url_feeder, requestBody);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data from Feeder:", error.message);
    throw error;
  }
}

// Fungsi untuk mendapatkan daftar semester dari database lokal
async function getSemesterFromLocal() {
  try {
    return await Semester.findAll();
  } catch (error) {
    console.error("Error fetching data from local DB:", error.message);
    throw error;
  }
}

// Fungsi utama untuk sinkronisasi semester
async function syncDataSemester() {
  try {
    const semesterFeeder = await getSemesterFromFeeder();
    const semesterLocal = await getSemesterFromLocal();

    const localMap = semesterLocal.reduce((map, semester) => {
      map[semester.id_feeder] = semester;
      return map;
    }, {});

    // Sinkronisasi data dari Feeder ke Lokal
    for (let feederSemester of semesterFeeder) {
      if (!localMap[feederSemester.id_semester]) {
        // Buat entri baru semester
        await Semester.create({
          id_semester: feederSemester.id_semester,
          nama_semester: feederSemester.nama_semester,
          semester: feederSemester.semester,
          id_tahun_ajaran: feederSemester.id_tahun_ajaran,
          last_sync: new Date(),
          id_feeder: feederSemester.id_semester,
        });

        console.log(`Data semester ${feederSemester.nama_semester} ditambahkan ke lokal.`);
      } else {
        // Update jika diperlukan
        const localSemester = localMap[feederSemester.id_semester];

        // mengecek jika terdapat perubahan terbaru dari feeder
        if (
          feederSemester.id_semester !== localSemester.id_semester ||
          feederSemester.nama_semester !== localSemester.nama_semester ||
          feederSemester.semester !== localSemester.semester ||
          feederSemester.id_tahun_ajaran !== localSemester.id_tahun_ajaran
        ) {
          await Semester.update(
            {
              id_semester: feederSemester.id_semester,
              nama_semester: feederSemester.nama_semester,
              semester: feederSemester.semester,
              id_tahun_ajaran: feederSemester.id_tahun_ajaran,
              last_sync: new Date(),
              id_feeder: feederSemester.id_semester,
            },
            { where: { id_feeder: feederSemester.id_semester } }
          );

          console.log(`Data semester ${feederSemester.nama_semester} di-update di lokal.`);
        }
      }
    }

    console.log("Sinkronisasi semester selesai.");
  } catch (error) {
    console.error("Error during syncSemester:", error.message);
    throw error;
  }
}

const syncSemester = async (req, res, next) => {
  try {
    await syncDataSemester();
    res.status(200).json({ message: "Sinkronisasi semester berhasil." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncSemester,
};
