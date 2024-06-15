const httpMocks = require("node-mocks-http");
const { getUnitJabatanById } = require("../../src/controllers/unit-jabatan");
const { UnitJabatan, Jabatan, Dosen } = require("../../models");

jest.mock("../../models");

describe("getUnitJabatanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get unit jabatan by ID and return 200", async () => {
    const unitJabatanId = 1;
    const mockUnitJabatanData = {
      id: unitJabatanId,
      nama_unit: "Unit Jabatan A",
      Jabatan: { nama_jabatan: "Jabatan A" },
      Dosen: { nama_dosen: "Dosen A" },
    };

    req.params.id = unitJabatanId;
    UnitJabatan.findByPk.mockResolvedValue(mockUnitJabatanData);

    await getUnitJabatanById(req, res, next);

    expect(UnitJabatan.findByPk).toHaveBeenCalledWith(unitJabatanId, {
      include: [{ model: Jabatan }, { model: Dosen }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Unit Jabatan By ID ${unitJabatanId} Success:`,
      data: mockUnitJabatanData,
    });
  });

  it("should return 400 if unit jabatan ID is not provided", async () => {
    req.params.id = undefined;

    await getUnitJabatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Unit Jabatan ID is required",
    });
    expect(UnitJabatan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if unit jabatan is not found", async () => {
    const unitJabatanId = 999; // ID yang tidak ada dalam database
    req.params.id = unitJabatanId;

    UnitJabatan.findByPk.mockResolvedValue(null);

    await getUnitJabatanById(req, res, next);

    expect(UnitJabatan.findByPk).toHaveBeenCalledWith(unitJabatanId, {
      include: [{ model: Jabatan }, { model: Dosen }],
    });
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

    await getUnitJabatanById(req, res, next);

    expect(UnitJabatan.findByPk).toHaveBeenCalledWith(unitJabatanId, {
      include: [{ model: Jabatan }, { model: Dosen }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
