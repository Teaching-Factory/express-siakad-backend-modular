const httpMocks = require("node-mocks-http");
const { deleteAspekPenilaianDosenById } = require("../../src/modules/aspek-penilaian-dosen/controller");
const { AspekPenilaianDosen } = require("../../models");

jest.mock("../../models");

describe("deleteAspekPenilaianDosenById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete aspek_penilaian_dosen and return 200 if ID is provided", async () => {
    const aspekPenilaianDosenId = 1;
    req.params.id = aspekPenilaianDosenId;

    AspekPenilaianDosen.findByPk.mockResolvedValue({
      id: aspekPenilaianDosenId,
      destroy: jest.fn().mockResolvedValue(true)
    });

    await deleteAspekPenilaianDosenById(req, res, next);

    expect(AspekPenilaianDosen.findByPk).toHaveBeenCalledWith(aspekPenilaianDosenId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Aspek Penilaian Dosen With ID ${aspekPenilaianDosenId} Success:`
    });
  });

  it("should return 400 if Aspek Penilaian Dosen ID is not provided", async () => {
    req.params.id = undefined;

    await deleteAspekPenilaianDosenById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Aspek Penilaian Dosen ID is required"
    });
    expect(AspekPenilaianDosen.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if aspek_penilaian_dosen is not found", async () => {
    const aspekPenilaianDosenId = 999; // ID yang tidak ada dalam database
    req.params.id = aspekPenilaianDosenId;

    AspekPenilaianDosen.findByPk.mockResolvedValue(null);

    await deleteAspekPenilaianDosenById(req, res, next);

    expect(AspekPenilaianDosen.findByPk).toHaveBeenCalledWith(aspekPenilaianDosenId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Aspek Penilaian Dosen With ID ${aspekPenilaianDosenId} Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const aspekPenilaianDosenId = 1;
    req.params.id = aspekPenilaianDosenId;

    AspekPenilaianDosen.findByPk.mockRejectedValue(error);

    await deleteAspekPenilaianDosenById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
