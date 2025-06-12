const httpMocks = require("node-mocks-http");
const { deleteJabatanById } = require("../../src/modules/jabatan/controller");
const { Jabatan } = require("../../models");

jest.mock("../../models");

describe("deleteJabatanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete jabatan and return 200 if ID is provided", async () => {
    const jabatanId = 1;
    req.params.id = jabatanId;

    Jabatan.findByPk.mockResolvedValue({
      id: jabatanId,
      destroy: jest.fn().mockResolvedValue(true),
    });

    await deleteJabatanById(req, res, next);

    expect(Jabatan.findByPk).toHaveBeenCalledWith(jabatanId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Jabatan With ID ${jabatanId} Success:`,
    });
  });

  it("should return 400 if Jabatan ID is not provided", async () => {
    req.params.id = undefined;

    await deleteJabatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jabatan ID is required",
    });
    expect(Jabatan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if jabatan is not found", async () => {
    const jabatanId = 999; // ID yang tidak ada dalam database
    req.params.id = jabatanId;

    Jabatan.findByPk.mockResolvedValue(null);

    await deleteJabatanById(req, res, next);

    expect(Jabatan.findByPk).toHaveBeenCalledWith(jabatanId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Jabatan With ID ${jabatanId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const jabatanId = 1;
    req.params.id = jabatanId;

    Jabatan.findByPk.mockRejectedValue(error);

    await deleteJabatanById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
