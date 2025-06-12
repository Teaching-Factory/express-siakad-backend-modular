const httpMocks = require("node-mocks-http");
const { deleteSkalaPenilaianDosenById } = require("../../src/modules/skala-penilaian-dosen/controller");
const { SkalaPenilaianDosen } = require("../../models");

jest.mock("../../models");

describe("deleteSkalaPenilaianDosenById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if Skala Penilaian Dosen ID is not provided", async () => {
    req.params.id = undefined;

    await deleteSkalaPenilaianDosenById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Skala Penilaian Dosen ID is required"
    });
    expect(SkalaPenilaianDosen.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if Skala Penilaian Dosen is not found", async () => {
    req.params.id = 1;
    SkalaPenilaianDosen.findByPk.mockResolvedValue(null);

    await deleteSkalaPenilaianDosenById(req, res, next);

    expect(SkalaPenilaianDosen.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Skala Penilaian Dosen With ID 1 Not Found:"
    });
  });

  it("should delete Skala Penilaian Dosen and return 200 if successful", async () => {
    req.params.id = 1;

    const mockSkalaPenilaianDosen = {
      id: 1,
      destroy: jest.fn().mockResolvedValue(true)
    };

    SkalaPenilaianDosen.findByPk.mockResolvedValue(mockSkalaPenilaianDosen);

    await deleteSkalaPenilaianDosenById(req, res, next);

    expect(SkalaPenilaianDosen.findByPk).toHaveBeenCalledWith(1);
    expect(mockSkalaPenilaianDosen.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== DELETE Skala Penilaian Dosen With ID 1 Success:"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;
    SkalaPenilaianDosen.findByPk.mockRejectedValue(error);

    await deleteSkalaPenilaianDosenById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
