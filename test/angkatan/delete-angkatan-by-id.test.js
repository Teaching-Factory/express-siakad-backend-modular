const httpMocks = require("node-mocks-http");
const { deleteAngkatanById } = require("../../src/modules/angkatan/controller");
const { Angkatan } = require("../../models");

jest.mock("../../models");

describe("deleteAngkatanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete angkatan and return 200 if 'id' is provided", async () => {
    const angkatanId = 1;
    req.params.id = angkatanId;

    const mockAngkatan = {
      id: angkatanId,
      destroy: jest.fn().mockResolvedValue(true),
    };

    Angkatan.findByPk.mockResolvedValue(mockAngkatan);

    await deleteAngkatanById(req, res, next);

    expect(Angkatan.findByPk).toHaveBeenCalledWith(angkatanId);
    expect(mockAngkatan.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Angkatan With ID ${angkatanId} Success:`,
    });
  });

  it("should return 400 if 'id' is not provided", async () => {
    req.params.id = undefined;

    await deleteAngkatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Angkatan ID is required",
    });
    expect(Angkatan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if angkatan is not found", async () => {
    const angkatanId = 999; // ID yang tidak ada dalam database
    req.params.id = angkatanId;

    Angkatan.findByPk.mockResolvedValue(null);

    await deleteAngkatanById(req, res, next);

    expect(Angkatan.findByPk).toHaveBeenCalledWith(angkatanId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Angkatan With ID ${angkatanId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const angkatanId = 1;
    req.params.id = angkatanId;

    Angkatan.findByPk.mockRejectedValue(error);

    await deleteAngkatanById(req, res, next);

    expect(Angkatan.findByPk).toHaveBeenCalledWith(angkatanId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
