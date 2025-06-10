const httpMocks = require("node-mocks-http");
const { getAllBiodataDosen } = require("../../src/modules/biodata-dosen/controller");
const { BiodataDosen } = require("../../models");

jest.mock("../../models");

describe("getAllBiodataDosen", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil semua data biodata dosen jika berhasil
  it("should return all biodata dosen with status 200 if found", async () => {
    const mockBiodataDosen = [
      { id: 1, nama: "Biodata Dosen 1" },
      { id: 2, nama: "Biodata Dosen 2" },
    ];

    BiodataDosen.findAll.mockResolvedValue(mockBiodataDosen);

    await getAllBiodataDosen(req, res, next);

    expect(BiodataDosen.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Biodata Dosen Success",
      jumlahData: mockBiodataDosen.length,
      data: mockBiodataDosen,
    });
  });

  // Kode uji 2 - Menangani kasus jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";

    BiodataDosen.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllBiodataDosen(req, res, next);

    expect(BiodataDosen.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
