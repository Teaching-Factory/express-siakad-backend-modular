const { getPembiayaanById } = require("../../src/controllers/pembiayaan");
const { Pembiayaan } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getPembiayaanById", () => {
  it("should return pembiayaan by ID successfully", async () => {
    // Mock pembiayaan data
    const mockPembiayaan = { id: 1, nama: "Pembiayaan 1" };

    // Mock request parameters
    const pembiayaanId = 1;
    const req = httpMocks.createRequest({
      params: { id: pembiayaanId },
    });
    const res = httpMocks.createResponse();

    // Mock findByPk function to resolve with mockPembiayaan
    Pembiayaan.findByPk = jest.fn().mockResolvedValue(mockPembiayaan);

    // Call the controller function
    await getPembiayaanById(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Pembiayaan By ID ${pembiayaanId} Success:`,
      data: mockPembiayaan,
    });
  });

  it("should handle missing ID parameter", async () => {
    // Mock request parameters without ID
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Call the controller function
    await getPembiayaanById(req, res, next);

    // Assert response
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Pembiayaan ID is required",
    });
  });

  it("should handle pembiayaan not found", async () => {
    // Mock request parameters
    const pembiayaanId = 999; // ID that does not exist
    const req = httpMocks.createRequest({
      params: { id: pembiayaanId },
    });
    const res = httpMocks.createResponse();

    // Mock findByPk function to resolve with null (pembiayaan not found)
    Pembiayaan.findByPk = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await getPembiayaanById(req, res);

    // Assert response
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Pembiayaan With ID ${pembiayaanId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    // Mock request parameters
    const pembiayaanId = 1;
    const req = httpMocks.createRequest({
      params: { id: pembiayaanId },
    });
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findByPk function to throw an error
    Pembiayaan.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the controller function
    await getPembiayaanById(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(new Error("Database error"));
  });
});
