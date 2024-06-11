const { getAllRiwayatNilaiMahasiswa } = require("../../src/controllers/riwayat-nilai-mahasiswa");
const { RiwayatNilaiMahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");

// Mock RiwayatNilaiMahasiswa model
jest.mock("../../models", () => ({
  RiwayatNilaiMahasiswa: {
    findAll: jest.fn(),
  },
}));

describe("getAllRiwayatNilaiMahasiswa", () => {
  it("should return all Riwayat Nilai Mahasiswa successfully", async () => {
    // Mock data
    const riwayatNilaiMahasiswaData = [{ id: 1 /* Include other properties as needed */ }, { id: 2 /* Include other properties as needed */ }];

    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock findAll function to return riwayat nilai mahasiswa data
    RiwayatNilaiMahasiswa.findAll = jest.fn().mockResolvedValue(riwayatNilaiMahasiswaData);

    // Call the controller function
    await getAllRiwayatNilaiMahasiswa(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Riwayat Nilai Mahasiswa Success",
      jumlahData: riwayatNilaiMahasiswaData.length,
      data: riwayatNilaiMahasiswaData,
    });
  });

  it("should handle errors", async () => {
    // Mock request object
    const req = httpMocks.createRequest();

    // Mock response object
    const res = httpMocks.createResponse();

    // Mock error
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    // Mock RiwayatNilaiMahasiswa.findAll function to throw an error
    RiwayatNilaiMahasiswa.findAll.mockRejectedValue(error);

    // Mock next function
    const next = jest.fn();

    // Call the controller function
    await getAllRiwayatNilaiMahasiswa(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(error);
  });
});
