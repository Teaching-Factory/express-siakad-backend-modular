const httpMocks = require("node-mocks-http");
const { getPenghasilanById } = require("../../src/controllers/penghasilan");
const { Penghasilan } = require("../../models");

jest.mock("../../models");

describe("getPenghasilanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Menguji penanganan saat ID penghasilan tidak disediakan
  it("should return 400 if Penghasilan ID is not provided", async () => {
    // Set parameter id menjadi null
    req.params.id = null;

    // Panggil getPenghasilanById
    await getPenghasilanById(req, res, next);

    // Harapannya, status response adalah 400
    expect(res.statusCode).toEqual(400);
    // Harapannya, respons JSON berisi pesan yang sesuai
    expect(res._getJSONData()).toEqual({
      message: "Penghasilan ID is required",
    });
  });

  // Kode uji 2 - Menguji penanganan saat data penghasilan tidak ditemukan
  it("should return 404 if Penghasilan with provided ID is not found", async () => {
    // Set parameter id yang tidak valid
    req.params.id = 123;

    // Mock Penghasilan.findByPk untuk mengembalikan null
    Penghasilan.findByPk.mockResolvedValue(null);

    // Panggil getPenghasilanById
    await getPenghasilanById(req, res, next);

    // Harapannya, status response adalah 404
    expect(res.statusCode).toEqual(404);
    // Harapannya, respons JSON berisi pesan yang sesuai
    expect(res._getJSONData()).toEqual({
      message: "<===== Penghasilan With ID 123 Not Found:",
    });
  });

  // Kode uji 3 - Menguji pengambilan data penghasilan dengan ID yang valid
  it("should return Penghasilan with status 200 if found", async () => {
    // Mock data penghasilan
    const mockPenghasilan = { id: 1, nominal: 1000 };

    // Set parameter id yang valid
    req.params.id = 1;

    // Mock Penghasilan.findByPk untuk mengembalikan data penghasilan
    Penghasilan.findByPk.mockResolvedValue(mockPenghasilan);

    // Panggil getPenghasilanById
    await getPenghasilanById(req, res, next);

    // Harapannya, status response adalah 200
    expect(res.statusCode).toEqual(200);
    // Harapannya, respons JSON berisi data penghasilan yang sesuai
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Penghasilan By ID 1 Success:",
      data: mockPenghasilan,
    });
  });

  // Kode uji 4 - Menguji penanganan error saat terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    // Set parameter id yang valid
    req.params.id = 1;

    // Pesan error yang diharapkan
    const errorMessage = "Database error";
    // Mock Penghasilan.findByPk untuk mengembalikan error
    Penghasilan.findByPk.mockRejectedValue(new Error(errorMessage));

    // Panggil getPenghasilanById
    await getPenghasilanById(req, res, next);

    // Harapannya, next dipanggil dengan pesan error yang sesuai
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
