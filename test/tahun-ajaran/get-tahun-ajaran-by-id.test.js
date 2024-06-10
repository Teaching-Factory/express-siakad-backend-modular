const httpMocks = require("node-mocks-http");
const { getTahunAjaranById } = require("../../src/controllers/tahun-ajaran");
const { TahunAjaran } = require("../../models");

jest.mock("../../models");

describe("getTahunAjaranById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil tahun ajaran dengan ID tertentu dan mengembalikan status 200 jika berhasil
  it("should return tahun ajaran by ID with status 200 if found", async () => {
    const TahunAjaranId = 1;
    const mockTahunAjaran = { id: TahunAjaranId, name: "Tahun Ajaran 1" };
    req.params.id = TahunAjaranId;
    TahunAjaran.findByPk.mockResolvedValue(mockTahunAjaran);

    await getTahunAjaranById(req, res, next);

    expect(TahunAjaran.findByPk).toHaveBeenCalledWith(TahunAjaranId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Tahun Ajaran By ID ${TahunAjaranId} Success:`,
      data: mockTahunAjaran,
    });
  });

  // Kode uji 2 - Mengembalikan respons 404 jika tahun ajaran dengan ID tertentu tidak ditemukan
  it("should return 404 if tahun ajaran by ID is not found", async () => {
    const TahunAjaranId = 1;
    req.params.id = TahunAjaranId;
    TahunAjaran.findByPk.mockResolvedValue(null);

    await getTahunAjaranById(req, res, next);

    expect(TahunAjaran.findByPk).toHaveBeenCalledWith(TahunAjaranId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Tahun Ajaran With ID ${TahunAjaranId} Not Found:`,
    });
  });

  // Kode uji 3 - Mengembalikan respons 400 jika ID tahun ajaran tidak disediakan
  it("should return 400 if tahun ajaran ID is not provided", async () => {
    req.params.id = null;

    await getTahunAjaranById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Tahun Ajaran ID is required",
    });
  });

  // Kode uji 4 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if database query fails", async () => {
    const TahunAjaranId = 1;
    const errorMessage = "Database error";
    req.params.id = TahunAjaranId;
    TahunAjaran.findByPk.mockRejectedValue(new Error(errorMessage));

    await getTahunAjaranById(req, res, next);

    expect(TahunAjaran.findByPk).toHaveBeenCalledWith(TahunAjaranId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
