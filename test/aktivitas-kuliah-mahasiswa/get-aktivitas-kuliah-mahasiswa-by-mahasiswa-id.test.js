const httpMocks = require("node-mocks-http");
const { getAktivitasKuliahMahasiswaByMahasiswaId } = require("../../src/controllers/aktivitas-kuliah-mahasiswa");
const { AktivitasKuliahMahasiswa, Mahasiswa, Semester, Prodi, StatusMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAktivitasKuliahMahasiswaByMahasiswaId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - mengembalikan data aktivitas kuliah mahasiswa berdasarkan mahasiswa ID yang sesuai
  it("should return aktivitas kuliah mahasiswa with status 200 if found", async () => {
    const mahasiswaId = 1;
    const mockAktivitas = [
      { id: 1, mahasiswaId: 1, semesterId: 1, prodiId: 1, statusMahasiswaId: 1 },
      { id: 2, mahasiswaId: 1, semesterId: 2, prodiId: 1, statusMahasiswaId: 2 },
    ];

    AktivitasKuliahMahasiswa.findAll.mockResolvedValue(mockAktivitas);

    req.params.id_registrasi_mahasiswa = mahasiswaId;

    await getAktivitasKuliahMahasiswaByMahasiswaId(req, res, next);

    expect(AktivitasKuliahMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_registrasi_mahasiswa: mahasiswaId,
      },
      include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: StatusMahasiswa }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Aktivitas Kuliah Mahasiswa By ID ${mahasiswaId} Success:`,
      jumlahData: mockAktivitas.length,
      data: mockAktivitas,
    });
  });

  // Kode uji 2 - menangani kasus ketika aktivitas kuliah mahasiswa tidak ditemukan
  it("should handle not found error", async () => {
    const mahasiswaId = 999; // ID yang tidak ada dalam database

    AktivitasKuliahMahasiswa.findAll.mockResolvedValue([]);

    req.params.id_registrasi_mahasiswa = mahasiswaId;

    await getAktivitasKuliahMahasiswaByMahasiswaId(req, res, next);

    expect(AktivitasKuliahMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_registrasi_mahasiswa: mahasiswaId,
      },
      include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: StatusMahasiswa }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Aktivitas Kuliah Mahasiswa With ID ${mahasiswaId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kasus ketika ID mahasiswa tidak diberikan
  it("should return error response when mahasiswa ID is not provided", async () => {
    req.params.id_registrasi_mahasiswa = undefined; // Tidak ada ID mahasiswa dalam parameter

    await getAktivitasKuliahMahasiswaByMahasiswaId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Mahasiswa ID is required",
    });
  });

  // Kode uji 4 - menangani kesalahan saat terjadi kesalahan database
  it("should handle errors", async () => {
    const mahasiswaId = 1;
    const errorMessage = "Database error";

    AktivitasKuliahMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    req.params.id_registrasi_mahasiswa = mahasiswaId;

    await getAktivitasKuliahMahasiswaByMahasiswaId(req, res, next);

    expect(AktivitasKuliahMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_registrasi_mahasiswa: mahasiswaId,
      },
      include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: StatusMahasiswa }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
