const httpMocks = require("node-mocks-http");
const { getSubstansiById } = require("../../src/controllers/substansi");
const { Substansi, Prodi, JenisSubstansi } = require("../../models");

jest.mock("../../models");

describe("getSubstansiById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil substansi berdasarkan ID dengan status 200 jika berhasil
  it("should return substansi by ID with status 200 if found", async () => {
    const mockSubstansi = { id: 1, name: "Substansi 1", Prodi: {}, JenisSubstansi: {} };
    Substansi.findByPk.mockResolvedValue(mockSubstansi);
    req.params.id = 1;

    await getSubstansiById(req, res, next);

    expect(Substansi.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Prodi }, { model: JenisSubstansi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Substansi By ID 1 Success:",
      data: mockSubstansi,
    });
  });

  // Kode uji 2 - Mengembalikan respons 404 jika substansi dengan ID yang diberikan tidak ditemukan
  it("should return 404 if substansi by ID is not found", async () => {
    Substansi.findByPk.mockResolvedValue(null);
    req.params.id = 1;

    await getSubstansiById(req, res, next);

    expect(Substansi.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Prodi }, { model: JenisSubstansi }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Substansi With ID 1 Not Found:",
    });
  });

  // Kode uji 3 - Mengembalikan respons 400 jika ID tidak disediakan
  it("should return 400 if substansi ID is not provided", async () => {
    req.params.id = undefined;

    await getSubstansiById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Substansi ID is required",
    });
  });

  // Kode uji 4 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    Substansi.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = 1;

    await getSubstansiById(req, res, next);

    expect(Substansi.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Prodi }, { model: JenisSubstansi }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
