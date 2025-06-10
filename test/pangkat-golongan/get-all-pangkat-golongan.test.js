const httpMocks = require("node-mocks-http");
const { getAllPangkatGolongan } = require("../../src/modules/pangkat-golongan/controller");
const { PangkatGolongan } = require("../../models");

jest.mock("../../models");

describe("getAllPangkatGolongan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Menjalankan fungsi dan mendapatkan semua data pangkat golongan
  it("should return all pangkat golongan with status 200 if found", async () => {
    const mockPangkatGolongan = [
      { id: 1, nama: "Pangkat 1", golongan: "A" },
      { id: 2, nama: "Pangkat 2", golongan: "B" },
    ];

    PangkatGolongan.findAll.mockResolvedValue(mockPangkatGolongan);

    await getAllPangkatGolongan(req, res, next);

    expect(PangkatGolongan.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Pangkat Golongan Success",
      jumlahData: mockPangkatGolongan.length,
      data: mockPangkatGolongan,
    });
  });

  // Kode uji 2 - Menguji penanganan error saat terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    PangkatGolongan.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllPangkatGolongan(req, res, next);

    expect(PangkatGolongan.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
