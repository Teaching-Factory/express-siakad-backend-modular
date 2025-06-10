const httpMocks = require("node-mocks-http");
const { getAllPenghasilan } = require("../../src/modules/penghasilan/controller");
const { Penghasilan } = require("../../models");

jest.mock("../../models");

describe("getAllPenghasilan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Menguji fungsi getAllPenghasilan untuk mendapatkan semua data penghasilan dari database
  it("should return all penghasilan with status 200 if found", async () => {
    // Mock data penghasilan
    const mockPenghasilan = [
      { id: 1, nominal: 1000 },
      { id: 2, nominal: 2000 },
    ];

    // Mock Penghasilan.findAll untuk mengembalikan data penghasilan
    Penghasilan.findAll.mockResolvedValue(mockPenghasilan);

    // Panggil getAllPenghasilan
    await getAllPenghasilan(req, res, next);

    // Harapannya, Penghasilan.findAll dipanggil
    expect(Penghasilan.findAll).toHaveBeenCalled();
    // Harapannya, status response adalah 200
    expect(res.statusCode).toEqual(200);
    // Harapannya, data JSON yang dikirim sesuai dengan data yang diharapkan
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Penghasilan Success",
      jumlahData: mockPenghasilan.length,
      data: mockPenghasilan,
    });
  });

  // Kode uji 2 - Menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    // Pesan error yang diharapkan
    const errorMessage = "Database error";
    // Mock Penghasilan.findAll untuk mengembalikan error
    Penghasilan.findAll.mockRejectedValue(new Error(errorMessage));

    // Panggil getAllPenghasilan
    await getAllPenghasilan(req, res, next);

    // Harapannya, Penghasilan.findAll dipanggil
    expect(Penghasilan.findAll).toHaveBeenCalled();
    // Harapannya, next dipanggil dengan pesan error yang sesuai
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
