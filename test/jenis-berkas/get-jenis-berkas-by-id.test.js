const httpMocks = require("node-mocks-http");
const { getJenisBerkasById } = require("../../src/modules/jenis-berkas/controller");
const { JenisBerkas } = require("../../models");

jest.mock("../../models");

describe("getJenisBerkasById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if jenisBerkasId is not provided", async () => {
    req.params.id = undefined;

    await getJenisBerkasById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Berkas ID is required"
    });
  });

  it("should return 404 if jenis berkas not found", async () => {
    req.params.id = 1;
    JenisBerkas.findByPk.mockResolvedValue(null);

    await getJenisBerkasById(req, res, next);

    expect(JenisBerkas.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Jenis Berkas With ID 1 Not Found:"
    });
  });

  it("should return 200 and the jenis berkas if found", async () => {
    const mockJenisBerkas = {
      id: 1,
      nama_berkas: "Berkas A",
      deskripsi: "Deskripsi Berkas A",
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    req.params.id = 1;
    JenisBerkas.findByPk.mockResolvedValue(mockJenisBerkas);

    await getJenisBerkasById(req, res, next);

    expect(JenisBerkas.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Jenis Berkas By ID 1 Success:",
      data: mockJenisBerkas
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;
    JenisBerkas.findByPk.mockRejectedValue(error);

    await getJenisBerkasById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
