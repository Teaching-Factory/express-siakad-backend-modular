const { getRiwayatNilaiMahasiswaById } = require("../../src/modules/riwayat-nilai-mahasiswa/controller");
const { RiwayatNilaiMahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getRiwayatNilaiMahasiswaById", () => {
  it("should return Riwayat Nilai Mahasiswa by ID successfully", async () => {
    // Mock data
    const riwayatNilaiMahasiswaId = 1;
    const riwayatNilaiMahasiswaData = { id: riwayatNilaiMahasiswaId }; // Data riwayat nilai mahasiswa yang diharapkan

    // Mock request and response objects
    const req = httpMocks.createRequest({ params: { id: riwayatNilaiMahasiswaId } });
    const res = httpMocks.createResponse();

    // Mock findByPk function to return riwayat nilai mahasiswa data
    RiwayatNilaiMahasiswa.findByPk = jest.fn().mockResolvedValue(riwayatNilaiMahasiswaData);

    // Call the controller function
    await getRiwayatNilaiMahasiswaById(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Riwayat Nilai Mahasiswa By ID ${riwayatNilaiMahasiswaId} Success:`,
      data: riwayatNilaiMahasiswaData,
    });
  });

  it("should handle missing ID", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Call the controller function without providing ID
    await getRiwayatNilaiMahasiswaById(req, res);

    // Assert response
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Riwayat Nilai Mahasiswa ID is required",
    });
  });

  it("should handle Riwayat Nilai Mahasiswa not found", async () => {
    // Mock data
    const riwayatNilaiMahasiswaId = 999; // ID yang tidak ada
    const errorMessage = `<===== Riwayat Nilai Mahasiswa With ID ${riwayatNilaiMahasiswaId} Not Found:`;

    // Mock request and response objects
    const req = httpMocks.createRequest({ params: { id: riwayatNilaiMahasiswaId } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock findByPk function to return null (tidak ditemukan)
    RiwayatNilaiMahasiswa.findByPk = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await getRiwayatNilaiMahasiswaById(req, res, next);

    // Assert response
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: errorMessage,
    });
  });

  it("should return 400 if Riwayat Nilai Mahasiswa ID is not provided", async () => {
    // Mock request object without Riwayat Nilai Mahasiswa ID
    const req = httpMocks.createRequest({
      params: {}, // ID tidak disediakan
    });

    // Mock response object
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Call the controller function
    await getRiwayatNilaiMahasiswaById(req, res, next);

    // Assert response
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Riwayat Nilai Mahasiswa ID is required",
    });
  });
});
