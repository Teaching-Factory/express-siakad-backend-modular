const { getSkalaNilaiProdiById } = require("../../src/controllers/skala-nilai-prodi");
const { SkalaNilaiProdi } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getSkalaNilaiProdiById", () => {
  it("should return Skala Nilai Prodi by ID successfully", async () => {
    // Mock data
    const skalaNilaiProdiId = 1;
    const skalaNilaiProdiData = { id: skalaNilaiProdiId, nama: "A", bobot: 4, prodiId: 1 };

    // Mock request and response objects
    const req = httpMocks.createRequest({ params: { id: skalaNilaiProdiId } });
    const res = httpMocks.createResponse();

    // Mock findByPk function to return skala nilai prodi data
    SkalaNilaiProdi.findByPk = jest.fn().mockResolvedValue(skalaNilaiProdiData);

    // Call the controller function
    await getSkalaNilaiProdiById(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Skala Nilai Prodi Kelas By ID ${skalaNilaiProdiId} Success:`,
      data: skalaNilaiProdiData,
    });
  });

  it("should handle missing ID", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Call the controller function without providing ID
    await getSkalaNilaiProdiById(req, res);

    // Assert response
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Skala Nilai Prodi ID is required",
    });
  });

  it("should handle Skala Nilai Prodi not found", async () => {
    // Mock data
    const skalaNilaiProdiId = 999; // ID that doesn't exist
    const errorMessage = `<===== Skala Nilai Prodi Kelas With ID ${skalaNilaiProdiId} Not Found:`;

    // Mock request and response objects
    const req = httpMocks.createRequest({ params: { id: skalaNilaiProdiId } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Mock findByPk function to return null (not found)
    SkalaNilaiProdi.findByPk = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await getSkalaNilaiProdiById(req, res, next);

    // Assert response
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: errorMessage,
    });
  });

  it("should return 400 if Skala Nilai Prodi ID is not provided", async () => {
    // Mock request object without Skala Nilai Prodi ID
    const req = httpMocks.createRequest({
      params: {}, // No ID provided
    });

    // Mock response object
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Call the controller function
    await getSkalaNilaiProdiById(req, res, next);

    // Assert response
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Skala Nilai Prodi ID is required",
    });
  });
});
