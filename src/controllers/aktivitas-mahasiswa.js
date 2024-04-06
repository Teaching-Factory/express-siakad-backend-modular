const getAllAktivitasMahasiswas = (req, res) => {
  res.json({
    message: "Berhasil mengakses get all aktivitas mahasiswas",
  });
};

const getAktivitasMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const aktivitasMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses get aktivitas mahasiswa by id",
    aktivitasMahasiswaId: aktivitasMahasiswaId,
  });
};

const createAktivitasMahasiswa = (req, res) => {
  res.json({
    message: "Berhasil mengakses create aktivitas mahasiswa",
  });
};

const updateAktivitasMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const aktivitasMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses update aktivitas mahasiswa by id",
    aktivitasMahasiswaId: aktivitasMahasiswaId,
  });
};

const deleteAktivitasMahasiswaById = (req, res) => {
  // Dapatkan ID dari parameter permintaan
  const aktivitasMahasiswaId = req.params.id;

  res.json({
    message: "Berhasil mengakses delete aktivitas mahasiswa by id",
    aktivitasMahasiswaId: aktivitasMahasiswaId,
  });
};

module.exports = {
  getAllAktivitasMahasiswas,
  getAktivitasMahasiswaById,
  createAktivitasMahasiswa,
  updateAktivitasMahasiswaById,
  deleteAktivitasMahasiswaById,
};
