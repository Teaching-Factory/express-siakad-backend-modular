const getAllKurikulums = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all kurikulums",
  });
};

const getKurikulumById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const kurikulumId = req.params.id;

  res.json({
    message: "Berhasil mengakses get kurikulum by id",
    kurikulumId: kurikulumId,
  });
};

const createKurikulum = (req, res) => {
  res.json({
    message: "Berhasil mengakses create kurikulum",
  });
};

const updateKurikulumById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const kurikulumId = req.params.id;

  res.json({
    message: "Berhasil mengakses update kurikulum by id",
    kurikulumId: kurikulumId,
  });
};

const deleteKurikulumById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const kurikulumId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete kurikulum by id",
    kurikulumId: kurikulumId,
  });
};

module.exports = {
  getAllKurikulums,
  getKurikulumById,
  createKurikulum,
  updateKurikulumById,
  deleteKurikulumById,
};
