const { getRiwayatPendidikanMahasiswaById } = require("../../src/controllers/riwayat-pendidikan-mahasiswa");
const { RiwayatPendidikanMahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getRiwayatPendidikanMahasiswaById", () => {
  it("should return riwayat pendidikan mahasiswa by ID successfully", async () => {
    // Mock riwayat pendidikan mahasiswa data
    const mockRiwayatPendidikanMahasiswa = {
      id: 1,
      mahasiswa_id: 1,
      jenis_pendaftaran_id: 1,
      jalur_masuk_id: 1,
      semester_id: 1,
      jenis_keluar_id: 1,
      prodi_id: 1,
      pembiayaan_id: 1,
      bidang_minat_id: 1,
      perguruan_tinggi_id: 1,
    };

    // Mock request and response objects
    const req = httpMocks.createRequest({ params: { id: 1 } });
    const res = httpMocks.createResponse();

    // Mock findByPk function to resolve with mockRiwayatPendidikanMahasiswa
    RiwayatPendidikanMahasiswa.findByPk = jest.fn().mockResolvedValue(mockRiwayatPendidikanMahasiswa);

    // Call the controller function
    await getRiwayatPendidikanMahasiswaById(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Riwayat Pendidikan Mahasiswa By ID 1 Success:",
      data: mockRiwayatPendidikanMahasiswa,
    });
  });

  it("should handle invalid ID", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest({ params: { id: null } });
    const res = httpMocks.createResponse();

    // Call the controller function
    await getRiwayatPendidikanMahasiswaById(req, res);

    // Assert response
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Riwayat Pendidikan Mahasiswa ID is required",
    });
  });

  it("should handle non-existent riwayat pendidikan mahasiswa", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest({ params: { id: 999 } });
    const res = httpMocks.createResponse();

    // Mock findByPk function to resolve with null
    RiwayatPendidikanMahasiswa.findByPk = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await getRiwayatPendidikanMahasiswaById(req, res);

    // Assert response
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Riwayat Pendidikan Mahasiswa With ID 999 Not Found:",
    });
  });

  it("should handle errors", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest({ params: { id: 1 } });
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findByPk function to throw an error
    RiwayatPendidikanMahasiswa.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the controller function
    await getRiwayatPendidikanMahasiswaById(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(new Error("Database error"));
  });
});
