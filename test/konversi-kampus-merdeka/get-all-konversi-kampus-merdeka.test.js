const httpMocks = require("node-mocks-http");
const { getAllKonversiKampusMerdeka } = require("../../src/controllers/konversi-kampus-merdeka");
const { KonversiKampusMerdeka } = require("../../models");

jest.mock("../../models");

describe("getAllKonversiKampusMerdeka", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan semua data konversi kampus merdeka
  it("should return all konversi kampus merdeka with status 200 if found", async () => {
    const mockKonversi = [
      { id: 1, mataKuliahId: 1 },
      { id: 2, mataKuliahId: 2 },
    ];

    KonversiKampusMerdeka.findAll.mockResolvedValue(mockKonversi);

    await getAllKonversiKampusMerdeka(req, res);

    expect(KonversiKampusMerdeka.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Konversi Kampus Merdeka Success",
      jumlahData: mockKonversi.length,
      data: mockKonversi,
    });
  });

  // Kode uji 2 - menangani kesalahan saat terjadi kesalahan database
  it("should handle errors", async () => {
    const errorMessage = "Database error";

    KonversiKampusMerdeka.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllKonversiKampusMerdeka(req, res, next);

    expect(KonversiKampusMerdeka.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
