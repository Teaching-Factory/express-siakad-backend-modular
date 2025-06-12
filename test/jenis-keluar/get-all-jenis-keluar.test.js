const { getAllJenisKeluar } = require("../../src/modules/jenis-keluar/controller");
const { JenisKeluar } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllJenisKeluar", () => {
  it("should return all jenis_keluar successfully", async () => {
    // Mock jenis_keluar data
    const mockJenisKeluar = [
      { id: 1, nama: "Jenis Keluar 1" },
      { id: 2, nama: "Jenis Keluar 2" },
    ];

    // Mock findAll function to resolve with mockJenisKeluar
    JenisKeluar.findAll = jest.fn().mockResolvedValue(mockJenisKeluar);

    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Call the controller function
    await getAllJenisKeluar(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jenis Keluar Success",
      jumlahData: mockJenisKeluar.length,
      data: mockJenisKeluar,
    });
  });

  it("should handle errors", async () => {
    // Mock error message
    const errorMessage = "Database error";

    // Mock findAll function to throw an error
    JenisKeluar.findAll = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Call the controller function
    await getAllJenisKeluar(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
