const { getAllBidangMinat } = require("../../src/modules/bidang-minat/controller");
const { BidangMinat } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllBidangMinat", () => {
  it("should return all bidang minat successfully", async () => {
    // Mock bidang minat data
    const mockBidangMinat = [
      { id: 1, nama: "Bidang Minat 1", ProdiId: 1 },
      { id: 2, nama: "Bidang Minat 2", ProdiId: 2 },
    ];

    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock findAll function to resolve with mockBidangMinat
    BidangMinat.findAll = jest.fn().mockResolvedValue(mockBidangMinat);

    // Call the controller function
    await getAllBidangMinat(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Bidang Minat Success",
      jumlahData: mockBidangMinat.length,
      data: mockBidangMinat,
    });
  });

  it("should handle errors", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findAll function to throw an error
    BidangMinat.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    // Call the controller function
    await getAllBidangMinat(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(new Error("Database error"));
  });
});
