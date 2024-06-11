const { getBidangMinatById } = require("../../src/controllers/bidang-minat");
const { BidangMinat } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getBidangMinatById", () => {
  it("should return bidang minat by ID successfully", async () => {
    // Mock bidang minat data
    const mockBidangMinat = {
      id: 1,
      nama: "Bidang Minat 1",
      ProdiId: 1,
      Prodi: { id: 1, nama: "Prodi 1" },
    };

    // Mock request and response objects
    const req = httpMocks.createRequest({
      params: { id: 1 }, // Specify the ID parameter
    });
    const res = httpMocks.createResponse();

    // Mock findByPk function to resolve with mockBidangMinat
    BidangMinat.findByPk = jest.fn().mockResolvedValue(mockBidangMinat);

    // Call the controller function
    await getBidangMinatById(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Bidang Minat By ID ${mockBidangMinat.id} Success:`,
      data: mockBidangMinat,
    });
  });

  it("should handle missing ID parameter", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Call the controller function without ID parameter
    await getBidangMinatById(req, res, next);

    // Assert response
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Bidang Minat ID is required",
    });
  });

  it("should handle non-existent bidang minat", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest({
      params: { id: 999 }, // Specify a non-existent ID
    });
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findByPk function to resolve with null
    BidangMinat.findByPk = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await getBidangMinatById(req, res, next);

    // Assert response
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Bidang Minat With ID ${req.params.id} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest({
      params: { id: 1 }, // Specify the ID parameter
    });
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findByPk function to throw an error
    BidangMinat.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the controller function
    await getBidangMinatById(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(new Error("Database error"));
  });
});
