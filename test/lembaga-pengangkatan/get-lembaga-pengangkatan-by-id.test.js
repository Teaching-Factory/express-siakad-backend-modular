const httpMocks = require("node-mocks-http");
const { getLembagaPengangkatanById } = require("../../src/modules/lembaga-pengangkatan/controller");
const { LembagaPengangkatan } = require("../../models");

jest.mock("../../models");

describe("getLembagaPengangkatanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      params: {
        id: "123", // ID pengujian
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Menjalankan fungsi dengan ID yang valid
  it("should return lembaga pengangkatan by ID with status 200 if found", async () => {
    const mockLembagaPengangkatan = {
      id: "123",
      nama: "Lembaga Pengangkatan 1",
    };

    LembagaPengangkatan.findByPk.mockResolvedValue(mockLembagaPengangkatan);

    await getLembagaPengangkatanById(req, res, next);

    expect(LembagaPengangkatan.findByPk).toHaveBeenCalledWith("123");
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Lembaga Pengangkatan By ID 123 Success:",
      data: mockLembagaPengangkatan,
    });
  });

  // Kode uji 2 - Menguji ketersediaan ID
  it("should return 400 if lembaga pengangkatan ID is not provided", async () => {
    req.params.id = ""; // ID tidak disediakan

    await getLembagaPengangkatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Lembaga Pengangkatan ID is required",
    });
  });

  // Kode uji 3 - Menguji data tidak ditemukan
  it("should return 404 if lembaga pengangkatan by ID is not found", async () => {
    LembagaPengangkatan.findByPk.mockResolvedValue(null);

    await getLembagaPengangkatanById(req, res, next);

    expect(LembagaPengangkatan.findByPk).toHaveBeenCalledWith("123");
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Lembaga Pengangkatan With ID 123 Not Found:",
    });
  });

  // Kode uji 4 - Menguji penanganan error saat terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";

    LembagaPengangkatan.findByPk.mockRejectedValue(new Error(errorMessage));

    await getLembagaPengangkatanById(req, res, next);

    expect(LembagaPengangkatan.findByPk).toHaveBeenCalledWith("123");
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
