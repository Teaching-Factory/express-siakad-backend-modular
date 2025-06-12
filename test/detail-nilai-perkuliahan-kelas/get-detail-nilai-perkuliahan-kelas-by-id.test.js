const { getDetailNilaiPerkuliahanKelasById } = require("../../src/modules/detail-nilai-perkuliahan-kelas/controller");
const { DetailNilaiPerkuliahanKelas } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getDetailNilaiPerkuliahanKelasById", () => {
  it("should return detail nilai perkuliahan kelas by ID successfully", async () => {
    // Mock data
    const detailNilaiPerkuliahanKelasId = 1;
    const mockDetailNilaiPerkuliahanKelas = {
      id: detailNilaiPerkuliahanKelasId,
      kelas_kuliah_id: 1,
      mahasiswa_id: 1,
    };

    // Mock request and response objects
    const req = httpMocks.createRequest({
      params: { id: detailNilaiPerkuliahanKelasId.toString() },
    });
    const res = httpMocks.createResponse();

    // Mock findByPk function to resolve with mockDetailNilaiPerkuliahanKelas
    DetailNilaiPerkuliahanKelas.findByPk = jest.fn().mockResolvedValue(mockDetailNilaiPerkuliahanKelas);

    // Call the controller function
    await getDetailNilaiPerkuliahanKelasById(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Detail Nilai Perkuliahan Kelas By ID ${detailNilaiPerkuliahanKelasId} Success:`,
      data: mockDetailNilaiPerkuliahanKelas,
    });
  });

  it("should handle missing ID", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Call the controller function without providing an ID
    await getDetailNilaiPerkuliahanKelasById(req, res, next);

    // Assert response
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Detail Nilai Perkuliahan Kelas ID is required",
    });
  });

  it("should handle non-existing detail nilai perkuliahan kelas", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest({
      params: { id: "s" }, // ID yang tidak ada
    });
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findByPk function to resolve with null (tidak ditemukan)
    DetailNilaiPerkuliahanKelas.findByPk = jest.fn().mockResolvedValue(null);

    // Call the controller function with a non-existing ID
    await getDetailNilaiPerkuliahanKelasById(req, res, next);

    // Assert response
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Detail Nilai Perkuliahan Kelas With ID s Not Found:`,
    });
  });

  it("should handle errors", async () => {
    // Mock data
    const detailNilaiPerkuliahanKelasId = 1;

    // Mock request and response objects
    const req = httpMocks.createRequest({
      params: { id: detailNilaiPerkuliahanKelasId.toString() },
    });
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findByPk function to throw an error
    DetailNilaiPerkuliahanKelas.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the controller function
    await getDetailNilaiPerkuliahanKelasById(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(new Error("Database error"));
  });
});
