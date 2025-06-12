const httpMocks = require("node-mocks-http");
const { getAktivitasKuliahMahasiswaById } = require("../../src/modules/aktivitas-kuliah-mahasiswa/controller");
const { AktivitasKuliahMahasiswa, Mahasiswa, Semester, Prodi, StatusMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAktivitasKuliahMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - mengembalikan data aktivitas kuliah mahasiswa dengan ID yang sesuai
  it("should return aktivitas kuliah mahasiswa with status 200 if found", async () => {
    const aktivitasId = 1;
    const mockAktivitas = { id: aktivitasId, mahasiswaId: 1, semesterId: 1, prodiId: 1, statusMahasiswaId: 1 };

    AktivitasKuliahMahasiswa.findByPk.mockResolvedValue(mockAktivitas);

    req.params.id = aktivitasId;

    await getAktivitasKuliahMahasiswaById(req, res, next);

    expect(AktivitasKuliahMahasiswa.findByPk).toHaveBeenCalledWith(aktivitasId, {
      include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: StatusMahasiswa }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Aktivitas Kuliah Mahasiswa By ID ${aktivitasId} Success:`,
      data: mockAktivitas,
    });
  });

  // Kode uji 2 - menangani kasus ketika aktivitas kuliah mahasiswa tidak ditemukan
  it("should handle not found error", async () => {
    const aktivitasId = 999; // ID yang tidak ada dalam database

    AktivitasKuliahMahasiswa.findByPk.mockResolvedValue(null);

    req.params.id = aktivitasId;

    await getAktivitasKuliahMahasiswaById(req, res, next);

    expect(AktivitasKuliahMahasiswa.findByPk).toHaveBeenCalledWith(aktivitasId, {
      include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: StatusMahasiswa }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Aktivitas Kuliah Mahasiswa With ID ${aktivitasId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kasus ketika ID aktivitas kuliah mahasiswa tidak diberikan
  it("should return error response when aktivitas kuliah mahasiswa ID is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID aktivitas kuliah mahasiswa dalam parameter

    await getAktivitasKuliahMahasiswaById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Aktivitas Kuliah Mahasiswa ID is required",
    });
  });

  // Kode uji 4 - menangani kesalahan saat terjadi kesalahan database
  it("should handle errors", async () => {
    const aktivitasId = 1;
    const errorMessage = "Database error";

    AktivitasKuliahMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = aktivitasId;

    await getAktivitasKuliahMahasiswaById(req, res, next);

    expect(AktivitasKuliahMahasiswa.findByPk).toHaveBeenCalledWith(aktivitasId, {
      include: [{ model: Mahasiswa }, { model: Semester }, { model: Prodi }, { model: StatusMahasiswa }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
