const httpMocks = require("node-mocks-http");
const { getRekapKHSMahasiswaById } = require("../../src/controllers/rekap-khs-mahasiswa");
const { RekapKHSMahasiswa, Mahasiswa, Prodi, Periode, MataKuliah } = require("../../models");

jest.mock("../../models");

describe("getRekapKHSMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan data rekap KHS mahasiswa berdasarkan ID
  it("should return rekap KHS mahasiswa with status 200 if found", async () => {
    const rekapKHSMahasiswaId = 1;
    const mockRekapKHS = { id: rekapKHSMahasiswaId, mahasiswaId: 1, prodiId: 1, periodeId: 1, mataKuliahId: 1 };

    RekapKHSMahasiswa.findByPk.mockResolvedValue(mockRekapKHS);

    req.params.id = rekapKHSMahasiswaId;

    await getRekapKHSMahasiswaById(req, res, next);

    expect(RekapKHSMahasiswa.findByPk).toHaveBeenCalledWith(rekapKHSMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Rekap KHS Mahasiswa By ID ${rekapKHSMahasiswaId} Success:`,
      data: mockRekapKHS,
    });
  });

  // Kode uji 2 - menangani kasus ketika data rekap KHS mahasiswa tidak ditemukan
  it("should handle not found error", async () => {
    const rekapKHSMahasiswaId = 999; // ID yang tidak ada dalam database

    RekapKHSMahasiswa.findByPk.mockResolvedValue(null);

    req.params.id = rekapKHSMahasiswaId;

    await getRekapKHSMahasiswaById(req, res, next);

    expect(RekapKHSMahasiswa.findByPk).toHaveBeenCalledWith(rekapKHSMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Rekap KHS Mahasiswa With ID ${rekapKHSMahasiswaId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kasus ketika ID rekap KHS mahasiswa tidak disediakan
  it("should return error response when Rekap KHS Mahasiswa ID is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID rekap KHS mahasiswa dalam parameter

    await getRekapKHSMahasiswaById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Rekap KHS Mahasiswa ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error saat terjadi kesalahan dalam database
  it("should handle errors", async () => {
    const rekapKHSMahasiswaId = 1;
    const errorMessage = "Database error";

    RekapKHSMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = rekapKHSMahasiswaId;

    await getRekapKHSMahasiswaById(req, res, next);

    expect(RekapKHSMahasiswa.findByPk).toHaveBeenCalledWith(rekapKHSMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
