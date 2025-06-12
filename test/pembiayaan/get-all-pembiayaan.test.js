const { getAllPembiayaan } = require("../../src/modules/pembiayaan/controller");
const { Pembiayaan } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllPembiayaan", () => {
  it("should return all pembiayaan successfully", async () => {
    // Mock pembiayaan data
    const mockPembiayaan = [
      { id: 1, nama: "Pembiayaan 1" },
      { id: 2, nama: "Pembiayaan 2" },
    ];

    // Mock findAll function to resolve with mockPembiayaan
    Pembiayaan.findAll = jest.fn().mockResolvedValue(mockPembiayaan);

    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Call the controller function
    await getAllPembiayaan(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Pembiayaan Success",
      jumlahData: mockPembiayaan.length,
      data: mockPembiayaan,
    });
  });

  it("should handle errors", async () => {
    // Mock error message
    const errorMessage = "Database error";

    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findAll function to throw an error
    Pembiayaan.findAll = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Call the controller function
    await getAllPembiayaan(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
