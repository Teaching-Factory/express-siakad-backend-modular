const httpMocks = require("node-mocks-http");
const { getAllAktivitasMahasiswaByProdiSemesterAndJenisAktivitasId } = require("../../src/controllers/aktivitas-mahasiswa");
const { AktivitasMahasiswa, JenisAktivitasMahasiswa, Prodi, Semester } = require("../../models");

jest.mock("../../models");

describe("getAllAktivitasMahasiswaByProdiSemesterAndJenisAktivitasId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan aktivitas mahasiswa berdasarkan Prodi, Semester, dan Jenis Aktivitas Mahasiswa ID
  it("should return all aktivitas mahasiswa by Prodi, Semester, and Jenis Aktivitas Mahasiswa ID with status 200 if found", async () => {
    const prodiId = 1;
    const semesterId = 2024;
    const jenisAktivitasMahasiswaId = 3;
    const mockAktivitasMahasiswa = [
      {
        id: 1,
        jenis_anggota: 0,
        nama_jenis_anggota: "Personal",
        judul: "Aktivitas 1",
        keterangan: null,
        lokasi: "Kampus A",
        sk_tugas: "SK001",
        tanggal_sk_tugas: "2024-06-20",
        untuk_kampus_merdeka: true,
        id_jenis_aktivitas: 3,
        id_prodi: 1,
        id_semester: 2024,
        JenisAktivitasMahasiswa: { id_jenis_aktivitas_mahasiswa: 3, nama_jenis_aktivitas: "Penelitian" },
        Prodi: { id_prodi: 1, nama_prodi: "Teknik Informatika" },
        Semester: { id_semester: 2024, tahun: 2024, nomor_semester: 1 },
      },
      // Add more mock data as needed
    ];

    AktivitasMahasiswa.findAll.mockResolvedValue(mockAktivitasMahasiswa);

    req.params.id_prodi = prodiId;
    req.params.id_semester = semesterId;
    req.params.id_jenis_aktivitas = jenisAktivitasMahasiswaId;

    await getAllAktivitasMahasiswaByProdiSemesterAndJenisAktivitasId(req, res);

    expect(AktivitasMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_prodi: prodiId,
        id_semester: semesterId,
        id_jenis_aktivitas: jenisAktivitasMahasiswaId,
      },
      include: [{ model: JenisAktivitasMahasiswa }, { model: Prodi }, { model: Semester }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Aktivitas Mahasiswa By Prodi, Semester and Jenis Aktivitas Mahasiswa Id Success",
      jumlahData: mockAktivitasMahasiswa.length,
      data: mockAktivitasMahasiswa,
    });
  });

  // Kode uji 2 - menangani kasus di mana Prodi ID tidak ditemukan
  it("should handle missing Prodi ID", async () => {
    const semesterId = 2024;
    const jenisAktivitasMahasiswaId = 3;

    req.params.id_semester = semesterId;
    req.params.id_jenis_aktivitas = jenisAktivitasMahasiswaId;

    await getAllAktivitasMahasiswaByProdiSemesterAndJenisAktivitasId(req, res);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
  });

  // Kode uji 3 - menangani kasus di mana Semester ID tidak ditemukan
  it("should handle missing Semester ID", async () => {
    const prodiId = 1;
    const jenisAktivitasMahasiswaId = 3;

    req.params.id_prodi = prodiId;
    req.params.id_jenis_aktivitas = jenisAktivitasMahasiswaId;

    await getAllAktivitasMahasiswaByProdiSemesterAndJenisAktivitasId(req, res);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Semester ID is required",
    });
  });

  // Kode uji 4 - menangani kasus di mana Jenis Aktivitas Mahasiswa ID tidak ditemukan
  it("should handle missing Jenis Aktivitas Mahasiswa ID", async () => {
    const prodiId = 1;
    const semesterId = 2024;

    req.params.id_prodi = prodiId;
    req.params.id_semester = semesterId;

    await getAllAktivitasMahasiswaByProdiSemesterAndJenisAktivitasId(req, res);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Aktivitas Mahasiswa ID is required",
    });
  });

  // Kode uji 5 - menangani database error
  it("should handle database error", async () => {
    const prodiId = 1;
    const semesterId = 2024;
    const jenisAktivitasMahasiswaId = 3;
    const errorMessage = "Database error";

    AktivitasMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    req.params.id_prodi = prodiId;
    req.params.id_semester = semesterId;
    req.params.id_jenis_aktivitas = jenisAktivitasMahasiswaId;

    await getAllAktivitasMahasiswaByProdiSemesterAndJenisAktivitasId(req, res, next);

    expect(AktivitasMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_prodi: prodiId,
        id_semester: semesterId,
        id_jenis_aktivitas: jenisAktivitasMahasiswaId,
      },
      include: [{ model: JenisAktivitasMahasiswa }, { model: Prodi }, { model: Semester }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
