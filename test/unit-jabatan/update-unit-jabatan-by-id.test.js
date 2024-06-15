const httpMocks = require("node-mocks-http");
const { updateUnitJabatanById } = require("../../src/controllers/unit-jabatan");
const { UnitJabatan } = require("../../models");

jest.mock("../../models");

describe("updateUnitJabatanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update unit jabatan and return 200 if 'id_dosen', 'id_jabatan', and 'id' are provided", async () => {
    const unitJabatanId = 1;
    const mockRequestBody = {
      id_dosen: 1,
      id_jabatan: 1,
    };

    req.params.id = unitJabatanId;
    req.body = mockRequestBody;

    const mockUpdatedUnitJabatan = {
      id: unitJabatanId,
      id_dosen: mockRequestBody.id_dosen,
      id_jabatan: mockRequestBody.id_jabatan,
    };

    UnitJabatan.findByPk.mockResolvedValue(mockUpdatedUnitJabatan);
    mockUpdatedUnitJabatan.save = jest.fn().mockResolvedValue(mockUpdatedUnitJabatan); // pastikan save dipanggil jika diperlukan

    await updateUnitJabatanById(req, res, next);

    expect(UnitJabatan.findByPk).toHaveBeenCalledWith(unitJabatanId);
    expect(mockUpdatedUnitJabatan.save).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Unit Jabatan With ID ${unitJabatanId} Success:`,
      data: {
        id: unitJabatanId,
        id_dosen: mockUpdatedUnitJabatan.id_dosen,
        id_jabatan: mockUpdatedUnitJabatan.id_jabatan,
      },
    });
  });

  it("should return 400 if 'id_dosen' is not provided", async () => {
    const unitJabatanId = 1;
    const mockRequestBody = {
      id_jabatan: 1,
    };

    req.params.id = unitJabatanId;
    req.body = mockRequestBody;

    await updateUnitJabatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_dosen is required",
    });
    expect(UnitJabatan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if 'id_jabatan' is not provided", async () => {
    const unitJabatanId = 1;
    const mockRequestBody = {
      id_dosen: 1,
    };

    req.params.id = unitJabatanId;
    req.body = mockRequestBody;

    await updateUnitJabatanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_jabatan is required",
    });
    expect(UnitJabatan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if unit jabatan is not found", async () => {
    const unitJabatanId = 999; // ID yang tidak ada dalam database
    req.params.id = unitJabatanId;
    req.body = {
      id_dosen: 1,
      id_jabatan: 1,
    };

    UnitJabatan.findByPk.mockResolvedValue(null);

    await updateUnitJabatanById(req, res, next);

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
    req.body = {
      id_dosen: 1,
      id_jabatan: 1,
    };

    UnitJabatan.findByPk.mockRejectedValue(error);

    await updateUnitJabatanById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
