const httpMocks = require("node-mocks-http");
const { updateAngkatanById } = require("../../src/controllers/angkatan");
const { Angkatan } = require("../../models");

jest.mock("../../models");

describe("updateAngkatanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update angkatan and return 200 if 'tahun' and 'id' are provided", async () => {
    const angkatanId = 1;
    const updatedAngkatan = { id: angkatanId, tahun: 2025 };
    req.params.id = angkatanId;
    req.body.tahun = 2025;

    Angkatan.findByPk.mockResolvedValue({
      id: angkatanId,
      tahun: 2024,
      save: jest.fn().mockResolvedValue(updatedAngkatan),
    });

    await updateAngkatanById(req, res, next);

    expect(Angkatan.findByPk).toHaveBeenCalledWith(angkatanId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Angkatan With ID ${angkatanId} Success:`,
      data: updatedAngkatan,
    });
  });

  it("should return 400 if 'tahun' is not provided", async () => {
    req.body.tahun = undefined;

    await updateAngkatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "tahun is required",
    });
    expect(Angkatan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if 'id' is not provided", async () => {
    req.params.id = undefined;
    req.body.tahun = 2025;

    await updateAngkatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Angkatan ID is required",
    });
    expect(Angkatan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if angkatan is not found", async () => {
    const angkatanId = 999; // ID yang tidak ada dalam database
    req.params.id = angkatanId;
    req.body.tahun = 2025;

    Angkatan.findByPk.mockResolvedValue(null);

    await updateAngkatanById(req, res, next);

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
    req.body.tahun = 2025;

    Angkatan.findByPk.mockRejectedValue(error);

    await updateAngkatanById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
