const httpMocks = require("node-mocks-http");
const { getJabatanById } = require("../../src/modules/jabatan/controller");
const { Jabatan } = require("../../models");

jest.mock("../../models");

describe("getJabatanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return jabatan by ID with status 200 if found", async () => {
    const jabatanId = 1;
    const mockJabatan = {
      id: jabatanId,
      nama: "Jabatan Test",
    };

    Jabatan.findByPk.mockResolvedValue(mockJabatan);

    req.params.id = jabatanId;

    await getJabatanById(req, res, next);

    expect(Jabatan.findByPk).toHaveBeenCalledWith(jabatanId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Jabatan By ID ${jabatanId} Success:`,
      data: mockJabatan,
    });
  });

  it("should return 404 if jabatan with ID not found", async () => {
    const jabatanId = 999; // ID yang tidak ada dalam database

    Jabatan.findByPk.mockResolvedValue(null);

    req.params.id = jabatanId;

    await getJabatanById(req, res, next);

    expect(Jabatan.findByPk).toHaveBeenCalledWith(jabatanId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Jabatan With ID ${jabatanId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const jabatanId = 1;
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Jabatan.findByPk.mockRejectedValue(error);

    req.params.id = jabatanId;

    await getJabatanById(req, res, next);

    expect(Jabatan.findByPk).toHaveBeenCalledWith(jabatanId);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should handle missing Jabatan ID", async () => {
    req.params.id = undefined;

    await getJabatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jabatan ID is required",
    });

    expect(Jabatan.findByPk).not.toHaveBeenCalled();
  });
});
