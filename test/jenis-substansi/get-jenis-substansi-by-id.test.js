const httpMocks = require("node-mocks-http");
const { getJenisSubstansiById } = require("../../src/modules/jenis-substansi/controller");
const { JenisSubstansi } = require("../../models");

jest.mock("../../models");

describe("getJenisSubstansiById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil data jenis_substansi berdasarkan ID yang diberikan
  it("should return jenis_substansi by ID with status 200 if found", async () => {
    const mockJenisSubstansi = { id: 1, name: "Substansi 1" };
    JenisSubstansi.findByPk.mockResolvedValue(mockJenisSubstansi);
    req.params.id = 1;

    await getJenisSubstansiById(req, res, next);

    expect(JenisSubstansi.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Jenis Substansi By ID 1 Success:",
      data: mockJenisSubstansi,
    });
  });

  // Kode uji 2 - Mengembalikan respons 404 jika jenis_substansi berdasarkan ID tidak ditemukan
  it("should return 404 if jenis_substansi by ID is not found", async () => {
    JenisSubstansi.findByPk.mockResolvedValue(null);
    req.params.id = 2;

    await getJenisSubstansiById(req, res, next);

    expect(JenisSubstansi.findByPk).toHaveBeenCalledWith(2);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Jenis Substansi With ID 2 Not Found:",
    });
  });

  // Kode uji 3 - Mengembalikan respons 400 jika ID tidak disediakan
  it("should return 400 if Jenis Substansi ID is not provided", async () => {
    req.params.id = null;

    await getJenisSubstansiById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Substansi ID is required",
    });
  });

  // Kode uji 4 - Menangani kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    JenisSubstansi.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = 3;

    await getJenisSubstansiById(req, res, next);

    expect(JenisSubstansi.findByPk).toHaveBeenCalledWith(3);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
