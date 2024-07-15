const { RekapKHSMahasiswa, Mahasiswa, Prodi, Periode, MataKuliah, Angkatan, UnitJabatan, Jabatan, Dosen } = require("../../models");
const axios = require("axios");
const { getToken } = require("././api-feeder/get-token");

const getAllRekapKHSMahasiswa = async (req, res, next) => {
  try {
    // Ambil semua data rekap_khs_mahasiswa dari database
    const rekap_khs_mahasiswa = await RekapKHSMahasiswa.findAll({ include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Rekap KHS Mahasiswa Success",
      jumlahData: rekap_khs_mahasiswa.length,
      data: rekap_khs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKHSMahasiswaById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const RekapKHSMahasiswaId = req.params.id;

    // Periksa apakah ID disediakan
    if (!RekapKHSMahasiswaId) {
      return res.status(400).json({
        message: "Rekap KHS Mahasiswa ID is required",
      });
    }

    // Cari data rekap_khs_mahasiswa berdasarkan ID di database
    const rekap_khs_mahasiswa = await RekapKHSMahasiswa.findByPk(RekapKHSMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rekap_khs_mahasiswa) {
      return res.status(404).json({
        message: `<===== Rekap KHS Mahasiswa With ID ${RekapKHSMahasiswaId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rekap KHS Mahasiswa By ID ${RekapKHSMahasiswaId} Success:`,
      data: rekap_khs_mahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKHSMahasiswaByMahasiswaId = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const idRegistrasiMahasiswa = req.params.id_registrasi_mahasiswa;

    // Periksa apakah ID disediakan
    if (!idRegistrasiMahasiswa) {
      return res.status(400).json({
        message: "ID Registrasi Mahasiswa is required",
      });
    }

    // Cari data rekap_khs_mahasiswa berdasarkan id_registrasi_mahasiswa di database
    const rekapKhsMahasiswaId = await RekapKHSMahasiswa.findAll({
      where: {
        id_registrasi_mahasiswa: idRegistrasiMahasiswa,
      },
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!rekapKhsMahasiswaId || rekapKhsMahasiswaId.length === 0) {
      return res.status(404).json({
        message: `<===== Rekap KHS Mahasiswa With ID ${idRegistrasiMahasiswa} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Rekap KHS Mahasiswa By ID ${idRegistrasiMahasiswa} Success:`,
      jumlahData: rekapKhsMahasiswaId.length,
      data: rekapKhsMahasiswaId,
    });
  } catch (error) {
    next(error);
  }
};

// filter function rekap khs mahasiswa
const getRekapKHSMahasiswaByFilter = async (req, res, next) => {
  try {
    // memperoleh id
    const prodiId = req.params.id_prodi;
    const angkatanId = req.params.id_angkatan;
    const semesterId = req.params.id_semester;
    const mataKuliahId = req.params.id_matkul;

    // pengecekan parameter id
    if (!prodiId) {
      return res.status(400).json({
        message: "Prodi ID is required",
      });
    }
    if (!angkatanId) {
      return res.status(400).json({
        message: "Angkatan ID is required",
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

    // get data angktan
    const angkatan = await Angkatan.findByPk(angkatanId);

    // jika data tidak ditemukan
    if (!angkatan) {
      return res.status(404).json({
        message: `<===== Angkatan With ID ${angkatanId} Not Found:`,
      });
    }

    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetRekapKHSMahasiswa",
      token: `${token}`,
      filter: `id_prodi='${prodiId}' AND angkatan='${angkatan.tahun}' AND id_periode='${semesterId}' AND id_matkul='${mataKuliahId}'`,
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataRekapKHSMahasiswa = response.data.data;

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Get Rekap KHS Mahasiswa from Feeder Success",
      totalData: dataRekapKHSMahasiswa.length,
      dataRekapKHSMahasiswa: dataRekapKHSMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

const getRekapKHSMahasiswaByFilterReqBody = async (req, res, next) => {
  const { jenis_cetak, nim, id_prodi, id_angkatan, id_semester, tanggal_penandatanganan, format } = req.body;

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

  try {
    if (jenis_cetak === "Mahasiswa") {
      const mahasiswa = await Mahasiswa.findOne({
        where: {
          nim: nim,
        },
      });

      if (!mahasiswa) {
        return res.status(404).json({ message: `<===== Mahasiswa With NIM ${nim} Not Found:` });
      }

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
        act: "GetRekapKHSMahasiswa",
        token: token,
        filter: `nim='${nim}' AND id_periode='${id_semester}'`,
      };

      const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);
      const dataRekapKHSMahasiswa = response.data.data;

      res.status(200).json({
        message: "Get Rekap KHS Mahasiswa By Mahasiswa from Feeder Success",
        totalData: dataRekapKHSMahasiswa.length,
        tanggalPenandatanganan: tanggal_penandatanganan,
        format: format,
        unitJabatan: unit_jabatan,
        dataRekapKHSMahasiswaMahasiswa: dataRekapKHSMahasiswa,
      });
    } else if (jenis_cetak === "Angkatan") {
      const angkatan = await Angkatan.findByPk(id_angkatan);

      if (!angkatan) {
        return res.status(404).json({ message: `<===== Angkatan With ID ${id_angkatan} Not Found:` });
      }

      // Mengambil data unit jabatan berdasarkan prodi mahasiswa
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

      const token = await getToken();

      const requestBody = {
        act: "GetRekapKHSMahasiswa",
        token: token,
        filter: `id_prodi='${id_prodi}' AND angkatan='${angkatan.tahun}' AND id_periode='${id_semester}'`,
      };

      const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);
      const dataRekapKHSMahasiswa = response.data.data;

      // Mengelompokkan data berdasarkan id_registrasi_mahasiswa
      const groupedData = dataRekapKHSMahasiswa.reduce((acc, item) => {
        const id = item.id_registrasi_mahasiswa;
        if (!acc[id]) {
          acc[id] = [];
        }
        acc[id].push(item);
        return acc;
      }, {});

      res.status(200).json({
        message: "Get Rekap KHS Mahasiswa By Angkatan from Feeder Success",
        totalData: dataRekapKHSMahasiswa.length,
        tanggalPenandatanganan: tanggal_penandatanganan,
        unitJabatan: unit_jabatan,
        dataRekapKHSMahasiswaAngkatan: groupedData,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRekapKHSMahasiswa,
  getRekapKHSMahasiswaById,
  getRekapKHSMahasiswaByMahasiswaId,
  getRekapKHSMahasiswaByFilter,
  getRekapKHSMahasiswaByFilterReqBody,
};
