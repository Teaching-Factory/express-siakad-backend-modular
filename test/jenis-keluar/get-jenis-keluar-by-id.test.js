const { getJenisKeluarById } = require("../../src/modules/jenis-keluar/controller");
const { JenisKeluar } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getJenisKeluarById", () => {
  it("should return jenis_keluar by ID successfully", async () => {
    // Mock jenis_keluar data
    const mockJenisKeluar = { id: 1, nama: "Jenis Keluar 1" };

    // Mock findByPk function to resolve with mockJenisKeluar
    JenisKeluar.findByPk = jest.fn().mockResolvedValue(mockJenisKeluar);

    // Mock request and response objects
    const req = httpMocks.createRequest({
      params: {
        id: 1,
      },
    });
    const res = httpMocks.createResponse();

    // Call the controller function
    await getJenisKeluarById(req, res);

    // Assert response
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Jenis Keluar By ID ${mockJenisKeluar.id} Success:`,
      data: mockJenisKeluar,
    });
  });

  it("should handle missing Jenis Keluar ID", async () => {
    // Mock request and response objects
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Call the controller function
    await getJenisKeluarById(req, res);

    // Assert response
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Keluar ID is required",
    });
  });

  it("should handle jenis_keluar not found", async () => {
    // Mock findByPk function to resolve with null (jenis_keluar not found)
    JenisKeluar.findByPk = jest.fn().mockResolvedValue(null);

    // Mock request and response objects
    const req = httpMocks.createRequest({
      params: {
        id: 1,
      },
    });
    const res = httpMocks.createResponse();

    // Call the controller function
    await getJenisKeluarById(req, res);

    // Assert response
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Jenis Keluar With ID ${req.params.id} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    // Mock error message
    const errorMessage = "Database error";

    // Mock request and response objects
    const req = httpMocks.createRequest({
      params: {
        id: 1,
      },
    });
    const res = httpMocks.createResponse();

    // Mock next function
    const next = jest.fn();

    // Mock findByPk function to throw an error
    JenisKeluar.findByPk = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Call the controller function
    await getJenisKeluarById(req, res, next);

    // Assert next function is called with the error
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
