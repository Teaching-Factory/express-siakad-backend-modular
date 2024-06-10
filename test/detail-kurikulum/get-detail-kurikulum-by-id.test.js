const httpMocks = require("node-mocks-http");
const { getDetailKurikulumById } = require("../../src/controllers/detail-kurikulum");
const { DetailKurikulum, Kurikulum } = require("../../models");

jest.mock("../../models");

describe("getDetailKurikulumById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan detail kurikulum dengan ID yang sesuai dengan status 200 jika berhasil
  it("should return curriculum detail with corresponding ID with status 200 if successful", async () => {
    const mockDetailKurikulum = { id: 1, name: "Detail Kurikulum 1", kurikulumId: 1 };
    DetailKurikulum.findByPk.mockResolvedValue(mockDetailKurikulum);

    req.params.id = 1;
    await getDetailKurikulumById(req, res, next);

    expect(DetailKurikulum.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Kurikulum }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Detail Kurikulum By ID 1 Success:",
      data: mockDetailKurikulum,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 404 jika detail kurikulum dengan ID yang sesuai tidak ditemukan
  it("should return 404 if curriculum detail with corresponding ID is not found", async () => {
    DetailKurikulum.findByPk.mockResolvedValue(null);

    req.params.id = 1;
    await getDetailKurikulumById(req, res, next);

    expect(DetailKurikulum.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Kurikulum }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Detail Kurikulum With ID 1 Not Found:",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - Mengembalikan respons 400 jika ID detail kurikulum tidak disediakan
  it("should return 400 if curriculum detail ID is not provided", async () => {
    req.params.id = undefined;

    await getDetailKurikulumById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Detail Kurikulum ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 4 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    DetailKurikulum.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = 1;
    await getDetailKurikulumById(req, res, next);

    expect(DetailKurikulum.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Kurikulum }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
