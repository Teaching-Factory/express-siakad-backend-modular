const httpMocks = require("node-mocks-http");
const { getFakultasById } = require("../../src/controllers/fakultas");
const { Fakultas, JenjangPendidikan } = require("../../models");

jest.mock("../../models");

describe("getFakultasById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan fakultas dengan ID yang valid dan status 200 jika ditemukan
  it("should return fakultas by ID with status 200 if found", async () => {
    const fakultasId = 1;
    const mockFakultas = { id: fakultasId, name: "Fakultas 1" };
    Fakultas.findByPk.mockResolvedValue(mockFakultas);

    req.params.id = fakultasId;

    await getFakultasById(req, res, next);

    expect(Fakultas.findByPk).toHaveBeenCalledWith(fakultasId, {
      include: [{ model: JenjangPendidikan }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Fakultas By ID ${fakultasId} Success:`,
      data: mockFakultas,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 404 jika fakultas dengan ID yang valid tidak ditemukan
  it("should return 404 if fakultas by ID is not found", async () => {
    const fakultasId = 1;
    Fakultas.findByPk.mockResolvedValue(null);

    req.params.id = fakultasId;

    await getFakultasById(req, res, next);

    expect(Fakultas.findByPk).toHaveBeenCalledWith(fakultasId, {
      include: [{ model: JenjangPendidikan }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Fakultas With ID ${fakultasId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - Mengembalikan respons 400 jika ID tidak disediakan
  it("should return 400 if fakultas ID is not provided", async () => {
    req.params.id = undefined;

    await getFakultasById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Fakultas ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 4 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    Fakultas.findByPk.mockRejectedValue(new Error(errorMessage));

    const fakultasId = 1;
    req.params.id = fakultasId;

    await getFakultasById(req, res, next);

    expect(Fakultas.findByPk).toHaveBeenCalledWith(fakultasId, {
      include: [{ model: JenjangPendidikan }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
