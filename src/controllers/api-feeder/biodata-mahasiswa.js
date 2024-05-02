const axios = require("axios");
const { getToken } = require("./get-token");
const { BiodataMahasiswa } = require("../../../models");
const { Wilayah } = require("../../../models");

const getBiodataMahasiswa = async (req, res, next) => {
  try {
    // Mendapatkan token
    const token = await getToken();

    const requestBody = {
      act: "GetBiodataMahasiswa",
      token: `${token}`,
      order: "id_mahasiswa",
    };

    // Menggunakan token untuk mengambil data
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapan dari API
    const dataBiodataMahasiswa = response.data.data;

    // Loop untuk menambahkan data ke dalam database
    for (const biodata_mahasiswa of dataBiodataMahasiswa) {
      // Periksa apakah data sudah ada di tabel
      const existingBiodataMahasiswa = await BiodataMahasiswa.findOne({
        where: {
          id_mahasiswa: biodata_mahasiswa.id_mahasiswa,
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

        console.log(biodata_mahasiswa.id_kebutuhan_khusus_mahasiswa);

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

    // Kirim data sebagai respons
    res.status(200).json({
      message: "Create Biodata Mahasiswa Success",
      totalData: dataBiodataMahasiswa.length,
      dataBiodataMahasiswa: dataBiodataMahasiswa,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBiodataMahasiswa,
};
