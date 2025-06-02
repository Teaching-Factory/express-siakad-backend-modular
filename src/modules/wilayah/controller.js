const { Wilayah, Negara } = require("../../../models");

const getAllWilayahs = async (req, res, next) => {
  try {
    // Ambil semua data wilayahs dari database
    const wilayahs = await Wilayah.findAll({ include: [{ model: Negara }] });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Wilayah Success",
      jumlahData: wilayahs.length,
      data: wilayahs,
    });
  } catch (error) {
    next(error);
  }
};

const getAllWilayahsSimply = async (req, res, next) => {
  try {
    // Ambil semua data wilayahs dari database
    const wilayahs = await Wilayah.findAll({
      attributes: ["id_wilayah", "nama_wilayah"],
    });

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Wilayah Simply Success",
      jumlahData: wilayahs.length,
      data: wilayahs,
    });
  } catch (error) {
    next(error);
  }
};

const getWilayahById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const wilayahId = req.params.id;

    // Periksa apakah ID disediakan
    if (!wilayahId) {
      return res.status(400).json({
        message: "Wilayah ID is required",
      });
    }

    // Cari data wilayah berdasarkan ID di database
    const wilayah = await Wilayah.findByPk(wilayahId, {
      include: [{ model: Negara }],
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!wilayah) {
      return res.status(404).json({
        message: `<===== Wilayah With ID ${wilayahId} Not Found:`,
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Wilayah By ID ${wilayahId} Success:`,
      data: wilayah,
    });
  } catch (error) {
    next(error);
  }
};

const getAllWilayahGrouped = async (req, res, next) => {
  try {
    // Ambil semua data wilayah dari database
    const wilayahs = await Wilayah.findAll({ include: [{ model: Negara }] });

    // Buat struktur pengelompokan wilayah
    const groupedWilayah = {};

    wilayahs.forEach((wilayah) => {
      const idWilayah = wilayah.id_wilayah;
      const namaWilayah = wilayah.nama_wilayah;

      // Jika id_wilayah mengindikasikan provinsi (cek berdasarkan format id_wilayah)
      if (idWilayah.endsWith("0000")) {
        // Tambahkan provinsi ke groupedWilayah jika belum ada
        if (!groupedWilayah[idWilayah]) {
          groupedWilayah[idWilayah] = {
            id_wilayah: idWilayah,
            nama_wilayah: namaWilayah,
            kota: {},
          };
        }
      }
      // Jika id_wilayah mengindikasikan kota (misal xxx000)
      else if (idWilayah.endsWith("000")) {
        const provinsiId = idWilayah.substring(0, 2) + "0000"; // Ambil id provinsi

        // Pastikan provinsi sudah ada di groupedWilayah
        if (!groupedWilayah[provinsiId]) {
          groupedWilayah[provinsiId] = {
            id_wilayah: provinsiId,
            nama_wilayah: wilayah.Negara.nama_negara, // Nama default jika provinsi belum ada
            kota: {},
          };
        }

        // Tambahkan kota ke dalam provinsi
        groupedWilayah[provinsiId].kota[idWilayah] = {
          id_wilayah: idWilayah,
          nama_wilayah: namaWilayah,
          kecamatan: {},
        };
      }
      // Jika id_wilayah mengindikasikan kecamatan (misal xxx00x)
      else {
        const kotaId = idWilayah.substring(0, 4) + "00"; // Ambil id kota
        const provinsiId = idWilayah.substring(0, 2) + "0000"; // Ambil id provinsi

        // Pastikan provinsi dan kota sudah ada di groupedWilayah
        if (!groupedWilayah[provinsiId]) {
          groupedWilayah[provinsiId] = {
            id_wilayah: provinsiId,
            nama_wilayah: wilayah.Negara.nama_negara,
            kota: {},
          };
        }

        if (!groupedWilayah[provinsiId].kota[kotaId]) {
          groupedWilayah[provinsiId].kota[kotaId] = {
            id_wilayah: kotaId,
            nama_wilayah: namaWilayah, // Nama default jika kota belum ada
            kecamatan: {},
          };
        }

        // Tambahkan kecamatan ke dalam kota
        groupedWilayah[provinsiId].kota[kotaId].kecamatan[idWilayah] = {
          id_wilayah: idWilayah,
          nama_wilayah: namaWilayah,
        };
      }
    });

    // Kirim respons JSON yang sudah dikelompokkan
    res.status(200).json({
      message: "<===== GET All Wilayah Grouped Success",
      jumlahData: wilayahs.length,
      data: groupedWilayah,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWilayahs,
  getAllWilayahsSimply,
  getWilayahById,
  getAllWilayahGrouped,
};
