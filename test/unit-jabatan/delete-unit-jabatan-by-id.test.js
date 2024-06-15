const httpMocks = require("node-mocks-http");
const { deleteUnitJabatanById } = require("../../src/controllers/unit-jabatan");
const { UnitJabatan } = require("../../models");

jest.mock("../../models");

describe("deleteUnitJabatanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete unit jabatan and return 200 if valid unit jabatan ID is provided", async () => {
    const unitJabatanId = 1;

    req.params.id = unitJabatanId;

    UnitJabatan.findByPk.mockResolvedValue({
      id: unitJabatanId,
      destroy: jest.fn().mockResolvedValue(true),
    });

    await deleteUnitJabatanById(req, res, next);

    expect(UnitJabatan.findByPk).toHaveBeenCalledWith(unitJabatanId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Unit Jabatan With ID ${unitJabatanId} Success:`,
    });
  });

  it("should return 400 if unit jabatan ID is not provided", async () => {
    req.params.id = undefined;

    await deleteUnitJabatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Unit Jabatan ID is required",
    });
    expect(UnitJabatan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if unit jabatan with given ID is not found", async () => {
    const unitJabatanId = 999; // ID yang tidak ada dalam database

    req.params.id = unitJabatanId;

    UnitJabatan.findByPk.mockResolvedValue(null);

    await deleteUnitJabatanById(req, res, next);

    expect(UnitJabatan.findByPk).toHaveBeenCalledWith(unitJabatanId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Unit Jabatan With ID ${unitJabatanId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const unitJabatanId = 1;

    req.params.id = unitJabatanId;

    UnitJabatan.findByPk.mockRejectedValue(error);

    await deleteUnitJabatanById(req, res, next);

    expect(UnitJabatan.findByPk).toHaveBeenCalledWith(unitJabatanId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
