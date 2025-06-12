const httpMocks = require("node-mocks-http");
const { getTranskripMahasiswaById } = require("../../src/modules/transkrip-mahasiswa/controller");
const { TranskripMahasiswa, Mahasiswa, MataKuliah, KelasKuliah, KonversiKampusMerdeka } = require("../../models");

jest.mock("../../models");

describe("getTranskripMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan data transkrip mahasiswa berdasarkan ID
  it("should return transkrip mahasiswa by ID with status 200 if found", async () => {
    const transkripId = 1;
    const mockTranskrip = { id: transkripId, mahasiswaId: 1, mataKuliahId: 1, kelasKuliahId: 1, konversiKampusMerdekaId: 1 };

    TranskripMahasiswa.findByPk.mockResolvedValue(mockTranskrip);

    req.params.id = transkripId;

    await getTranskripMahasiswaById(req, res, next);

    expect(TranskripMahasiswa.findByPk).toHaveBeenCalledWith(transkripId, {
      include: [{ model: Mahasiswa }, { model: MataKuliah }, { model: KelasKuliah }, { model: KonversiKampusMerdeka }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Transkrip Mahasiswa By ID ${transkripId} Success:`,
      data: mockTranskrip,
    });
  });

  // Kode uji 2 - menangani data tidak ditemukan
  it("should handle not found error", async () => {
    const transkripId = 999; // ID yang tidak ada dalam mock data

    TranskripMahasiswa.findByPk.mockResolvedValue(null);

    req.params.id = transkripId;

    await getTranskripMahasiswaById(req, res, next);

    expect(TranskripMahasiswa.findByPk).toHaveBeenCalledWith(transkripId, {
      include: [{ model: Mahasiswa }, { model: MataKuliah }, { model: KelasKuliah }, { model: KonversiKampusMerdeka }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Transkrip Mahasiswa With ID ${transkripId} Not Found:`,
    });
  });

  // Kode uji 3 - tidak memasukkan ID transkrip mahasiswa pada parameter
  it("should return error response when transkrip mahasiswa ID is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID transkrip mahasiswa dalam parameter

    await getTranskripMahasiswaById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Transkrip Mahasiswa ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should handle errors", async () => {
    const transkripId = 1;
    const errorMessage = "Database error";

    TranskripMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = transkripId;

    await getTranskripMahasiswaById(req, res, next);

    expect(TranskripMahasiswa.findByPk).toHaveBeenCalledWith(transkripId, {
      include: [{ model: Mahasiswa }, { model: MataKuliah }, { model: KelasKuliah }, { model: KonversiKampusMerdeka }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
