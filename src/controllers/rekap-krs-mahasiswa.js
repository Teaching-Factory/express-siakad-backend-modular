const { RekapKRSMahasiswa, Prodi, Periode, Mahasiswa, MataKuliah, Semester, UnitJabatan, Dosen, KRSMahasiswa, KelasKuliah, DetailKelasKuliah, Angkatan, Jabatan } = require("../../models");
const axios = require("axios");
const { getToken } = require("././api-feeder/get-token");

const getAllRekapKRSMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data rekap_krs_mahasiswa dari database
    const rekap_krs_mahasiswa = await RekapKRSMahasiswa.findAll({ include: [{ model: Prodi }, { model: Periode }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rekap KRS Mahasiswa Success",
      jumlahData: rekap_krs_mahasiswa.length,
      data: rekap_krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKRSMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const RekapKRSMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!RekapKRSMahasiswaId) {
      return res.status(400).json({
        message: "Rekap KRS Mahasiswa ID is required",
      });
    }

    // Cari data rekap_krs_mahasiswa berdasarkan ID di database
    const rekap_krs_mahasiswa = await RekapKRSMahasiswa.findByPk(RekapKRSMahasiswaId, {
      include: [{ model: Prodi }, { model: Periode }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rekap_krs_mahasiswa) {
      return res.status(404).json({
        message: `<===== Rekap KRS Mahasiswa With ID ${RekapKRSMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rekap KRS Mahasiswa By ID ${RekapKRSMahasiswaId} Success:`,
      data: rekap_krs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

// filter function rekap krs mahasiswa
const getRekapKRSMahasiswaByFilter = async (req, res, next) => {
  try {
    // memperoleh id
    const prodiId = req.params.id_prodi;
    const semesterId = req.params.id_semester;
    const mataKuliahId = req.params.id_matkul;
    const mahasiswaId = req.params.id_registrasi_mahasiswa;

    // pengecekan parameter id
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!semesterId) {
      return res.status(400).json({
        message: "Semester ID is required",
      });
    }
    if (!mataKuliahId) {
      return res.status(400).json({
        message: "Mata Kuliah ID is required",
      });
    }
    if (!mahasiswaId) {
      return res.status(400).json({
        message: "Mahasiswa ID is required",
      });
    }

    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetRekapKRSMahasiswa",
      token: `${token}`,
      filter: `id_prodi='${prodiId}' and id_semester='${semesterId}' and id_matkul='${mataKuliahId}' and id_registrasi_mahasiswa='${mahasiswaId}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataRekapKRSMahasiswa = response.data.data;

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Get Rekap KRS Mahasiswa from Feeder Success",
      totalData: dataRekapKRSMahasiswa.length,
      dataRekapKRSMahasiswa: dataRekapKRSMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKRSMahasiswaByFilterReqBody = async (req, res, next) => {
  const { jenis_cetak, nim, id_semester, id_prodi, id_angkatan, tanggal_penandatanganan, format } = req.body;

  // Validasi input berdasarkan jenis_cetak
  if (jenis_cetak === "Mahasiswa") {
    if (!nim) {
      return res.status(400).json({ message: "nim is required" });
    }
    if (!id_semester) {
      return res.status(400).json({ message: "id_semester is required" });
    }
    if (!format) {
      return res.status(400).json({ message: "format is required" });
    }
    if (!tanggal_penandatanganan) {
      return res.status(400).json({ message: "tanggal_penandatanganan is required" });
    }
  } else if (jenis_cetak === "Angkatan") {
    if (!id_prodi) {
      return res.status(400).json({ message: "id_prodi is required" });
    }
    if (!id_angkatan) {
      return res.status(400).json({ message: "id_angkatan is required" });
    }
    if (!id_semester) {
      return res.status(400).json({ message: "id_semester is required" });
    }
    if (!tanggal_penandatanganan) {
      return res.status(400).json({ message: "tanggal_penandatanganan is required" });
    }
  } else {
    return res.status(400).json({ message: "jenis_cetak is invalid" });
  }

  // pengambilan data
  try {
    if (jenis_cetak === "Mahasiswa") {
      const mahasiswa = await Mahasiswa.findOne({
        where: {
          nim: nim,
        },
        include: [{ model: Semester }, { model: Prodi }],
      });

      if (!mahasiswa) {
        return res.status(404).json({ message: `<===== Mahasiswa With NIM ${nim} Not Found:` });
      }

      // mengambil data unit jabatan dekan berdasarkan prodi mahasiswa
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

      // get data krs from local
      const krs_mahasiswa_by_mahasiswa = await KRSMahasiswa.findAll({
        where: {
          id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
          id_semester: id_semester,
        },
        include: [{ model: KelasKuliah, include: [{ model: DetailKelasKuliah }] }],
      });

      res.status(200).json({
        message: "Get Rekap KRS Mahasiswa By Mahasiswa from Local Success",
        mahasiswa: mahasiswa,
        unitJabatan: unit_jabatan,
        tanggalPenandatanganan: tanggal_penandatanganan,
        format: format,
        totalData: krs_mahasiswa_by_mahasiswa.length,
        dataRekapKRSByMahasiswa: krs_mahasiswa_by_mahasiswa,
      });
    } else if (jenis_cetak === "Angkatan") {
      const angkatan = await Angkatan.findByPk(id_angkatan);

      if (!angkatan) {
        return res.status(404).json({ message: `<===== Angkatan With ID ${id_angkatan} Not Found:` });
      }

      // Mengambil data unit jabatan dekan berdasarkan parameter id_prodi
      let unit_jabatan = null;
      unit_jabatan = await UnitJabatan.findOne({
        where: {
          id_prodi: id_prodi,
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

      const krs_mahasiswa_by_angkatan = await KRSMahasiswa.findAll({
        where: {
          id_prodi: id_prodi,
          angkatan: angkatan.tahun,
          id_semester: id_semester,
        },
        include: [{ model: KelasKuliah, include: [{ model: DetailKelasKuliah }] }],
      });

      // Mengelompokkan data berdasarkan id_registrasi_mahasiswa
      const groupedData = krs_mahasiswa_by_angkatan.reduce((acc, item) => {
        const id = item.id_registrasi_mahasiswa;
        if (!acc[id]) {
          acc[id] = [];
        }
        acc[id].push(item);
        return acc;
      }, {});

      res.status(200).json({
        message: "Get Rekap KRS Mahasiswa By Angkatan from Local Success",
        unitJabatan: unit_jabatan,
        tanggalPenandatanganan: tanggal_penandatanganan,
        format: format,
        totalData: Object.keys(groupedData).length,
        dataRekapKRSByMahasiswa: groupedData,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRekapKRSMahasiswa,
  getRekapKRSMahasiswaById,
  getRekapKRSMahasiswaByFilter,
  getRekapKRSMahasiswaByFilterReqBody,
};
