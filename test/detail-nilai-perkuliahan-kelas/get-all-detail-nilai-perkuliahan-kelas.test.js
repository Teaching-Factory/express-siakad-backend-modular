const { getAllDetailNilaiPerkuliahanKelas } = require("../../src/controllers/detail-nilai-perkuliahan-kelas");
const { DetailNilaiPerkuliahanKelas } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllDetailNilaiPerkuliahanKelas", () => {
  it("should return all detail nilai perkuliahan kelas successfully", async () => {
    // Mock data
    const mockDetailNilaiPerkuliahanKelas = [
      { id: 1, kelas_kuliah_id: 1, mahasiswa_id: 1 },
      { id: 2, kelas_kuliah_id: 1, mahasiswa_id: 2 },
    ];

    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock findAll function to resolve with mockDetailNilaiPerkuliahanKelas
    DetailNilaiPerkuliahanKelas.findAll = jest.fn().mockResolvedValue(mockDetailNilaiPerkuliahanKelas);

    // Call the controller function
    await getAllDetailNilaiPerkuliahanKelas(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Detail Nilai Perkuliahan Kelas Success",
      jumlahData: mockDetailNilaiPerkuliahanKelas.length,
      data: mockDetailNilaiPerkuliahanKelas,
    });
  });

  it("should handle errors", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findAll function to throw an error
    DetailNilaiPerkuliahanKelas.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the controller function
    await getAllDetailNilaiPerkuliahanKelas(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(new Error("Database error"));
  });
});
