const httpMocks = require("node-mocks-http");
const { updateAktivitasMahasiswaById } = require("../../src/controllers/aktivitas-mahasiswa");
const { AktivitasMahasiswa } = require("../../models");

jest.mock("../../models");

describe("updateAktivitasMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mengupdate aktivitas mahasiswa berdasarkan ID
  it("should update aktivitas mahasiswa by ID with status 200 if found", async () => {
    const AktivitasMahasiswaId = 1;

    const mockAktivitasMahasiswa = {
      id: AktivitasMahasiswaId,
      id_prodi: 1,
      id_jenis_aktivitas: 1,
      judul: "Aktivitas Test",
      lokasi: "Lokasi Test",
      sk_tugas: "SK123",
      tanggal_sk_tugas: "2024-06-15",
      jenis_anggota: 0,
      nama_jenis_anggota: "Personal",
      keterangan: null,
      untuk_kampus_merdeka: true,
      save: jest.fn().mockResolvedValue(), // Mock save function
    };

    // Mock function findByPk untuk mengembalikan data aktivitas mahasiswa
    AktivitasMahasiswa.findByPk.mockResolvedValue(mockAktivitasMahasiswa);

    // Set req.params.id
    req.params.id = AktivitasMahasiswaId;

    // Set req.body untuk data yang akan diupdate
    req.body = {
      id_prodi: 2,
      id_jenis_aktivitas: 2,
      judul: "Aktivitas Test Updated",
      lokasi: "Lokasi Test Updated",
      sk_tugas: "SK456",
      tanggal_sk_tugas: "2024-06-16",
      jenis_anggota: 1,
      keterangan: "Keterangan Test",
      untuk_kampus_merdeka: false,
    };

    // Panggil fungsi updateAktivitasMahasiswaById
    await updateAktivitasMahasiswaById(req, res, next);

    // Memastikan respons status 200
    expect(res.statusCode).toEqual(200);

    // Memastikan bahwa data yang diperbarui sesuai dengan yang diharapkan
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Aktivitas Mahasiswa With ID ${AktivitasMahasiswaId} Success:`,
      data: {
        id: AktivitasMahasiswaId,
        id_prodi: req.body.id_prodi,
        id_jenis_aktivitas: req.body.id_jenis_aktivitas,
        judul: req.body.judul,
        lokasi: req.body.lokasi,
        sk_tugas: req.body.sk_tugas,
        tanggal_sk_tugas: req.body.tanggal_sk_tugas,
        jenis_anggota: req.body.jenis_anggota,
        nama_jenis_anggota: req.body.jenis_anggota === 0 ? "Personal" : "Kelompok",
        keterangan: req.body.keterangan,
        untuk_kampus_merdeka: req.body.untuk_kampus_merdeka,
      },
    });
  });

  // Kode uji 2 - menangani kasus di mana aktivitas mahasiswa tidak ditemukan
  it("should return 404 if aktivitas mahasiswa with ID not found", async () => {
    const AktivitasMahasiswaId = 999; // ID yang tidak ada dalam database

    req.body = {
      id_prodi: 2,
      id_jenis_aktivitas: 2,
      judul: "Aktivitas Test Updated",
      lokasi: "Lokasi Test Updated",
      sk_tugas: "SK456",
      tanggal_sk_tugas: "2024-06-16",
      jenis_anggota: 1,
      keterangan: "Keterangan Test",
      untuk_kampus_merdeka: false,
    };

    // Mock function findByPk untuk mengembalikan null
    AktivitasMahasiswa.findByPk.mockResolvedValue(null);

    // Set req.params.id
    req.params.id = AktivitasMahasiswaId;

    // Panggil fungsi updateAktivitasMahasiswaById
    await updateAktivitasMahasiswaById(req, res, next);

    // Memastikan findByPk dipanggil dengan benar
    expect(AktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AktivitasMahasiswaId);

    // Memastikan respons status 404 dan pesan yang sesuai
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Aktivitas Mahasiswa With ID ${AktivitasMahasiswaId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kesalahan validasi required
  it("should handle validation errors", async () => {
    const AktivitasMahasiswaId = 1;

    // Set req.params.id
    req.params.id = AktivitasMahasiswaId;

    // Panggil fungsi updateAktivitasMahasiswaById tanpa memberikan body yang diperlukan
    await updateAktivitasMahasiswaById(req, res, next);

    // Memastikan respons status 400 dan pesan yang sesuai
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "jenis_anggota is required",
    });
  });

  // Kode uji 4 - menangani kesalahan saat menyimpan perubahan ke database
  it("should handle errors", async () => {
    const AktivitasMahasiswaId = 1;
    const errorMessage = "Database error";

    const mockSave = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockAktivitasMahasiswa = {
      id: AktivitasMahasiswaId,
      id_prodi: 1,
      id_jenis_aktivitas: 1,
      judul: "Aktivitas Test",
      lokasi: "Lokasi Test",
      sk_tugas: "SK123",
      tanggal_sk_tugas: "2024-06-15",
      jenis_anggota: 0,
      nama_jenis_anggota: "Personal",
      keterangan: null,
      untuk_kampus_merdeka: true,
      save: mockSave,
    };

    // Mock function findByPk untuk mengembalikan data aktivitas mahasiswa
    AktivitasMahasiswa.findByPk.mockResolvedValue(mockAktivitasMahasiswa);

    // Set req.params.id
    req.params.id = AktivitasMahasiswaId;

    // Set req.body untuk data yang akan diupdate
    req.body = {
      id_prodi: 2,
      id_jenis_aktivitas: 2,
      judul: "Aktivitas Test Updated",
      lokasi: "Lokasi Test Updated",
      sk_tugas: "SK456",
      tanggal_sk_tugas: "2024-06-16",
      jenis_anggota: 1,
      keterangan: "Keterangan Test",
      untuk_kampus_merdeka: false,
    };

    // Panggil fungsi updateAktivitasMahasiswaById
    await updateAktivitasMahasiswaById(req, res, next);

    // Memastikan findByPk dipanggil dengan benar
    expect(AktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AktivitasMahasiswaId);

    // Memastikan save dipanggil pada objek mockAktivitasMahasiswa
    expect(mockSave).toHaveBeenCalled();

    // Memastikan next dipanggil dengan error yang sesuai
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  // Kode uji 5 - menangani kasus di mana Aktivitas Mahasiswa ID tidak diberikan
  it("should handle missing Aktivitas Mahasiswa ID", async () => {
    // Set req.params.id tidak ada
    req.params.id = undefined;

    req.body = {
      id_prodi: 2,
      id_jenis_aktivitas: 2,
      judul: "Aktivitas Test Updated",
      lokasi: "Lokasi Test Updated",
      sk_tugas: "SK456",
      tanggal_sk_tugas: "2024-06-16",
      jenis_anggota: 1,
      keterangan: "Keterangan Test",
      untuk_kampus_merdeka: false,
    };

    // Panggil fungsi updateAktivitasMahasiswaById
    await updateAktivitasMahasiswaById(req, res, next);

    // Memastikan respons status 400 dan pesan yang sesuai
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Aktivitas Mahasiswa ID is required",
    });
  });
});
