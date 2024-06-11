const { getAllSkalaNilaiProdi } = require("../../src/controllers/skala-nilai-prodi");
const { SkalaNilaiProdi } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllSkalaNilaiProdi", () => {
  it("should return all Skala Nilai Prodi successfully", async () => {
    // Mock data
    const skalaNilaiProdiData = [
      { id: 1, nama: "A", bobot: 4, prodiId: 1 },
      { id: 2, nama: "B", bobot: 3, prodiId: 2 },
    ];

    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock findAll function to return skala nilai prodi data
    SkalaNilaiProdi.findAll = jest.fn().mockResolvedValue(skalaNilaiProdiData);

    // Call the controller function
    await getAllSkalaNilaiProdi(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Skala Nilai Prodi Kelas Success",
      jumlahData: skalaNilaiProdiData.length,
      data: skalaNilaiProdiData,
    });
  });

  it("should handle errors", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findAll function to throw an error
    SkalaNilaiProdi.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the controller function
    await getAllSkalaNilaiProdi(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(new Error("Database error"));
  });
});
