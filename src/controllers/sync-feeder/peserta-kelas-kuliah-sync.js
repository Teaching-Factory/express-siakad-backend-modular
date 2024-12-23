// const { PesertaKelasKuliah, PesertaKelasKuliahSync, Mahasiswa, BiodataMahasiswa, RiwayatPendidikanMahasiswa } = require("../../../models");
// const { getToken } = require("../api-feeder/get-token");
// const axios = require("axios");

// async function getKelasKuliahFromFeeder(semesterId, req, res, next) {
//   try {
//     if (!semesterId) {
//       return res.status(400).json({
//         message: "Semester ID is required",
//       });
//     }

//     const { token, url_feeder } = await getToken();

//     if (!token || !url_feeder) {
//       throw new Error("Failed to obtain token or URL feeder");
//     }

//     const requestBody = {
//       act: "GetListKelasKuliah",
//       token: token,
//       filter: `id_semester='${semesterId}'`,
//     };

//     const response = await axios.post(url_feeder, requestBody);

//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching data from Feeder:", error.message);
//     throw error;
//   }
// }
