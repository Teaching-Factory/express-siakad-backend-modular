const httpMocks = require("node-mocks-http");
const { getAllJenisSubstansi } = require("../../src/modules/jenis-substansi/controller");
const { JenisSubstansi } = require("../../models");

jest.mock("../../models");

describe("getAllJenisSubstansi", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil semua data jenis_substansi
  it("should return all jenis_substansi with status 200", async () => {
    const mockJenisSubstansi = [
      { id: 1, name: "Substansi 1" },
      { id: 2, name: "Substansi 2" },
    ];

    JenisSubstansi.findAll.mockResolvedValue(mockJenisSubstansi);

    await getAllJenisSubstansi(req, res, next);

    expect(JenisSubstansi.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jenis Substansi Success",
      jumlahData: mockJenisSubstansi.length,
      data: mockJenisSubstansi,
    });
  });

  // Kode uji 2 - Mengembalikan respons 200 dengan data kosong jika tidak ada jenis_substansi
  it("should return 200 with empty data if no jenis_substansi found", async () => {
    JenisSubstansi.findAll.mockResolvedValue([]);

    await getAllJenisSubstansi(req, res, next);

    expect(JenisSubstansi.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jenis Substansi Success",
      jumlahData: 0,
      data: [],
    });
  });

  // Kode uji 3 - Menangani kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    JenisSubstansi.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllJenisSubstansi(req, res, next);

    expect(JenisSubstansi.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
