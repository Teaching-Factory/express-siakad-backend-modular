const httpMocks = require("node-mocks-http");
const { getAllWilayahs } = require("../../src/modules/wilayah/controller");
const { Wilayah } = require("../../models");

jest.mock("../../models");

describe("getAllWilayahs", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menjalankan function wilayah dengan menggunakan method get
  it("should return all wilayahs with status 200 if found", async () => {
    const mockWilayahs = [
      { id: 1, nama: "Wilayah 1", Negara: { nama: "Negara 1" } },
      { id: 2, nama: "Wilayah 2", Negara: { nama: "Negara 2" } },
    ];

    Wilayah.findAll.mockResolvedValue(mockWilayahs);

    await getAllWilayahs(req, res, next);

    expect(Wilayah.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Wilayah Success",
      jumlahData: mockWilayahs.length,
      data: mockWilayahs,
    });
  });

  // Kode uji 2 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    Wilayah.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllWilayahs(req, res, next);

    expect(Wilayah.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
