const httpMocks = require("node-mocks-http");
const { getAllPekerjaan } = require("../../src/controllers/pekerjaan");
const { Pekerjaan } = require("../../models");

jest.mock("../../models");

describe("getAllPekerjaan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mendapatkan semua pekerjaan
  it("should return all pekerjaan with status 200 if found", async () => {
    const mockPekerjaan = [
      { id: 1, nama: "Pekerjaan 1" },
      { id: 2, nama: "Pekerjaan 2" },
    ];

    Pekerjaan.findAll.mockResolvedValue(mockPekerjaan);

    await getAllPekerjaan(req, res, next);

    expect(Pekerjaan.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Pekerjaan Success",
      jumlahData: mockPekerjaan.length,
      data: mockPekerjaan,
    });
  });

  // Kode uji 2 - Menangani kasus jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    Pekerjaan.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllPekerjaan(req, res, next);

    expect(Pekerjaan.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
