const httpMocks = require("node-mocks-http");
const { getAllTranskripMahasiswa } = require("../../src/controllers/transkrip-mahasiswa");
const { TranskripMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAllTranskripMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan semua data transkrip mahasiswa
  it("should return all transkrip mahasiswa with status 200 if found", async () => {
    const mockTranskrip = [
      { id: 1, mahasiswaId: 1, mataKuliahId: 1, kelasKuliahId: 1, konversiKampusMerdekaId: 1 },
      { id: 2, mahasiswaId: 2, mataKuliahId: 2, kelasKuliahId: 2, konversiKampusMerdekaId: 2 },
    ];

    TranskripMahasiswa.findAll.mockResolvedValue(mockTranskrip);

    await getAllTranskripMahasiswa(req, res);

    expect(TranskripMahasiswa.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Transkrip Mahasiswa Success",
      jumlahData: mockTranskrip.length,
      data: mockTranskrip,
    });
  });

  // Kode uji 2 - menangani kesalahan saat terjadi kesalahan database
  it("should handle errors", async () => {
    const errorMessage = "Database error";

    TranskripMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllTranskripMahasiswa(req, res, next);

    expect(TranskripMahasiswa.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
