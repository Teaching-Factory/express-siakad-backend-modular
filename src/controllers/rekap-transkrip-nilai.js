const axios = require("axios");
const { Mahasiswa, Prodi, UnitJabatan, Jabatan, Dosen } = require("../../models");
const { getToken } = require("././api-feeder/get-token");

const getRekapTranskripNilaiByFilterReqBody = async (req, res, next) => {
  const { nim, tanggal_penandatanganan, format } = req.body;

  if (!nim) {
    return res.status(400).json({ message: "nim is required" });
  }
  if (!tanggal_penandatanganan) {
    return res.status(400).json({ message: "tanggal_penandatanganan is required" });
  }
  if (!format) {
    return res.status(400).json({ message: "format is required" });
  }

  try {
    // get data mahasiswa from nim
    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: nim,
      },
      include: [{ model: Prodi }],
    });

    // Mengambil data unit jabatan berdasarkan prodi mahasiswa
    let unit_jabatan = null;
    unit_jabatan = await UnitJabatan.findOne({
      where: {
        id_prodi: mahasiswa.id_prodi,
      },
      include: [
        {
          model: Jabatan,
          where: {
            nama_jabatan: "Dekan",
          },
        },
        { model: Dosen },
      ],
    });

    const token = await getToken();

    const requestBody = {
      act: "GetTranskripMahasiswa",
      token: token,
      filter: `id_registrasi_mahasiswa='${mahasiswa.id_registrasi_mahasiswa}'`,
    };

    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);
    let dataRekapTranskripNilai = response.data.data;

    // Hitung total_sks dan total_sks_indeks
    let total_sks = 0;
    let total_sks_indeks = 0;

    dataRekapTranskripNilai.forEach((nilai) => {
      nilai.total_sks_indeks = parseFloat(nilai.sks_mata_kuliah) * parseFloat(nilai.nilai_indeks);
      total_sks += parseFloat(nilai.sks_mata_kuliah);
      total_sks_indeks += nilai.total_sks_indeks;
    });

    // Hitung IPK
    const ipk = (total_sks_indeks / total_sks).toFixed(2);
    let formattedTotalSksIndeks = total_sks_indeks.toFixed(2);

    res.json({
      message: "Get Rekap Transkrip Nilai from Feeder Success",
      mahasiswa: mahasiswa,
      unit_jabatan: unit_jabatan,
      total_sks: total_sks,
      total_sks_indeks: formattedTotalSksIndeks,
      ipk: ipk,
      dataRekapTranskripNilai: dataRekapTranskripNilai,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRekapTranskripNilaiByFilterReqBody,
};
