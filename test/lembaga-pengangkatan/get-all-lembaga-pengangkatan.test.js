const httpMocks = require("node-mocks-http");
const { getAllLembagaPengangkatan } = require("../../src/controllers/lembaga-pengangkatan");
const { LembagaPengangkatan } = require("../../models");

jest.mock("../../models");

describe("getAllLembagaPengangkatan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Menguji pengambilan semua lembaga pengangkatan dengan status 200
  it("should return all lembaga pengangkatan with status 200 if found", async () => {
    // Mock data lembaga pengangkatan
    const mockLembagaPengangkatan = [
      { id: 1, nama: "Lembaga 1" },
      { id: 2, nama: "Lembaga 2" },
    ];

    // Mock LembagaPengangkatan.findAll untuk mengembalikan data lembaga pengangkatan
    LembagaPengangkatan.findAll.mockResolvedValue(mockLembagaPengangkatan);

    // Panggil getAllLembagaPengangkatan
    await getAllLembagaPengangkatan(req, res, next);

    // Harapannya, status response adalah 200
    expect(res.statusCode).toEqual(200);
    // Harapannya, respons JSON berisi data lembaga pengangkatan yang sesuai
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Lembaga Pengangkatan Success",
      jumlahData: mockLembagaPengangkatan.length,
      data: mockLembagaPengangkatan,
    });
  });

  // Kode uji 2 - Menguji penanganan error saat terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    // Pesan error yang diharapkan
    const errorMessage = "Database error";

    // Mock LembagaPengangkatan.findAll untuk mengembalikan error
    LembagaPengangkatan.findAll.mockRejectedValue(new Error(errorMessage));

    // Panggil getAllLembagaPengangkatan
    await getAllLembagaPengangkatan(req, res, next);

    // Harapannya, next dipanggil dengan pesan error yang sesuai
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
