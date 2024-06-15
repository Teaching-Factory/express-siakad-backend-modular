const httpMocks = require("node-mocks-http");
const { getAllJabatan } = require("../../src/controllers/jabatan");
const { Jabatan } = require("../../models");

jest.mock("../../models");

describe("getAllJabatan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all jabatans with status 200", async () => {
    const mockJabatans = [
      { id: 1, nama: "Jabatan 1" },
      { id: 2, nama: "Jabatan 2" },
    ];

    Jabatan.findAll.mockResolvedValue(mockJabatans);

    await getAllJabatan(req, res, next);

    expect(Jabatan.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jabatan Success",
      jumlahData: mockJabatans.length,
      data: mockJabatans,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Jabatan.findAll.mockRejectedValue(error);

    await getAllJabatan(req, res, next);

    expect(Jabatan.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
