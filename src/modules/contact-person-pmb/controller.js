const { ContactPersonPMB } = require("../../../models");

const getAllContactPersonPMB = async (req, res, next) => {
  try {
    // Ambil semua data contact_person_pmb dari database
    const contact_person_pmb = await ContactPersonPMB.findAll();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: "<===== GET All Contact Person PMB Success",
      jumlahData: contact_person_pmb.length,
      data: contact_person_pmb
    });
  } catch (error) {
    next(error);
  }
};

const getContectPersonPMBById = async (req, res, next) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const ContactPersonPMBId = req.params.id;

    if (!ContactPersonPMBId) {
      return res.status(400).json({
        message: "Contact Person PMB ID is required"
      });
    }

    // Cari data contact_person_pmb berdasarkan ID di database
    const contact_person_pmb = await ContactPersonPMB.findByPk(ContactPersonPMBId);

    // Jika data tidak ditemukan, kirim respons 404
    if (!contact_person_pmb) {
      return res.status(404).json({
        message: `<===== Contact Person PMB With ID ${ContactPersonPMBId} Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Contact Person PMB By ID ${ContactPersonPMBId} Success:`,
      data: contact_person_pmb
    });
  } catch (error) {
    next(error);
  }
};

const getContactPersonAktif = async (req, res, next) => {
  try {
    // Cari data contact_person_pmb_aktif berdasarkan ID di database
    const contact_person_pmb_aktif = await ContactPersonPMB.findOne({
      where: {
        status: true
      }
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!contact_person_pmb_aktif) {
      return res.status(404).json({
        message: `<===== Contact Person PMB Aktif Not Found:`
      });
    }

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== GET Contact Person PMB Aktif Success:`,
      data: contact_person_pmb_aktif
    });
  } catch (error) {
    next(error);
  }
};

const createContactPersonPMB = async (req, res, next) => {
  const { nama_cp_pmb, no_wa_cp_pmb, status } = req.body;

  if (!nama_cp_pmb) {
    return res.status(400).json({ message: "nama_cp_pmb is required" });
  }
  if (!no_wa_cp_pmb) {
    return res.status(400).json({ message: "no_wa_cp_pmb is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  try {
    // Gunakan metode create untuk membuat data semester aktif baru
    const newContactPersonPMB = await ContactPersonPMB.create({ nama_cp_pmb, no_wa_cp_pmb, status });

    // Kirim respons JSON jika berhasil
    res.status(201).json({
      message: "<===== CREATE Contect Person PMB Success",
      data: newContactPersonPMB
    });
  } catch (error) {
    next(error);
  }
};

const updateContactPersonPMBAktif = async (req, res, next) => {
  // Dapatkan data yang akan diupdate dari body permintaan
  const { nama_cp_pmb, no_wa_cp_pmb } = req.body;

  if (!nama_cp_pmb) {
    return res.status(400).json({ message: "nama_cp_pmb is required" });
  }
  if (!no_wa_cp_pmb) {
    return res.status(400).json({ message: "no_wa_cp_pmb is required" });
  }

  try {
    // get data contact person pmb aktif, dengan status bernilai true
    const contact_person_pmb = await ContactPersonPMB.findOne({
      where: {
        status: true
      }
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!contact_person_pmb) {
      return res.status(404).json({
        message: `<===== Contact Person PMB Not Found:`
      });
    }

    // Update data contact_person_pmb
    contact_person_pmb.nama_cp_pmb = nama_cp_pmb;
    contact_person_pmb.no_wa_cp_pmb = no_wa_cp_pmb;

    // Simpan perubahan ke dalam database
    await contact_person_pmb.save();

    // Kirim respons JSON jika berhasil
    res.status(200).json({
      message: `<===== UPDATE Contact Person PMB Success:`,
      data: contact_person_pmb
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContactPersonPMB,
  getContectPersonPMBById,
  getContactPersonAktif,
  createContactPersonPMB,
  updateContactPersonPMBAktif
};
