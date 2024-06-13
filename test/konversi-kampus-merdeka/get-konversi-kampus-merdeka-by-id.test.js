const httpMocks = require("node-mocks-http");
const { getKonversiKampusMerdekaById } = require("../../src/controllers/konversi-kampus-merdeka");
const { KonversiKampusMerdeka, MataKuliah } = require("../../models");

jest.mock("../../models");

describe("getKonversiKampusMerdekaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan data konversi kampus merdeka berdasarkan ID
  it("should return konversi kampus merdeka by ID with status 200 if found", async () => {
    const konversiId = 1;
    const mockKonversi = { id: konversiId, mataKuliahId: 1 };

    KonversiKampusMerdeka.findByPk.mockResolvedValue(mockKonversi);

    req.params.id = konversiId;

    await getKonversiKampusMerdekaById(req, res, next);

    expect(KonversiKampusMerdeka.findByPk).toHaveBeenCalledWith(konversiId, { include: [{ model: MataKuliah }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Konversi Kampus Merdeka By ID ${konversiId} Success:`,
      data: mockKonversi,
    });
  });

  // Kode uji 2 - menangani data tidak ditemukan
  it("should handle not found error", async () => {
    const konversiId = 999; // ID yang tidak ada dalam mock data

    KonversiKampusMerdeka.findByPk.mockResolvedValue(null);

    req.params.id = konversiId;

    await getKonversiKampusMerdekaById(req, res, next);

    expect(KonversiKampusMerdeka.findByPk).toHaveBeenCalledWith(konversiId, { include: [{ model: MataKuliah }] });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Konversi Kampus Merdeka With ID ${konversiId} Not Found:`,
    });
  });

  // Kode uji 3 - tidak memasukkan ID konversi kampus merdeka pada parameter
  it("should return error response when konversi kampus merdeka ID is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID konversi kampus merdeka dalam parameter

    await getKonversiKampusMerdekaById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Konversi Kampus Merdeka ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should handle errors", async () => {
    const konversiId = 1;
    const errorMessage = "Database error";

    KonversiKampusMerdeka.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = konversiId;

    await getKonversiKampusMerdekaById(req, res, next);

    expect(KonversiKampusMerdeka.findByPk).toHaveBeenCalledWith(konversiId, { include: [{ model: MataKuliah }] });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
