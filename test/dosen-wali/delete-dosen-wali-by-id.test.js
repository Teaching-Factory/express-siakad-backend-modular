const httpMocks = require("node-mocks-http");
const { deleteDosenWaliById } = require("../../src/modules/dosen-wali/controller");
const { DosenWali } = require("../../models");

jest.mock("../../models");

describe("deleteDosenWaliById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete dosen wali by ID and return 200", async () => {
    const mockDosenWaliId = 1;
    const mockDosenWali = {
      id: mockDosenWaliId,
      destroy: jest.fn().mockResolvedValue(true),
    };

    req.params.id = mockDosenWaliId;

    DosenWali.findByPk.mockResolvedValue(mockDosenWali);

    await deleteDosenWaliById(req, res, next);

    expect(DosenWali.findByPk).toHaveBeenCalledWith(mockDosenWaliId);
    expect(mockDosenWali.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Dosen Wali With ID ${mockDosenWaliId} Success:`,
    });
  });

  it("should return 400 if dosen wali ID is missing", async () => {
    req.params.id = undefined;

    await deleteDosenWaliById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Dosen Wali ID is required",
    });
    expect(DosenWali.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if dosen wali not found", async () => {
    const mockDosenWaliId = 999; // Non-existent ID

    req.params.id = mockDosenWaliId;

    DosenWali.findByPk.mockResolvedValue(null);

    await deleteDosenWaliById(req, res, next);

    expect(DosenWali.findByPk).toHaveBeenCalledWith(mockDosenWaliId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Dosen Wali With ID ${mockDosenWaliId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockDosenWaliId = 1;
    req.params.id = mockDosenWaliId;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    DosenWali.findByPk.mockRejectedValue(error);

    await deleteDosenWaliById(req, res, next);

    expect(DosenWali.findByPk).toHaveBeenCalledWith(mockDosenWaliId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
