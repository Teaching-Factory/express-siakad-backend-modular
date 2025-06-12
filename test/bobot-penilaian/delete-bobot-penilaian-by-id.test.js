const httpMocks = require("node-mocks-http");
const { deleteBobotPenilaianById } = require("../../src/modules/bobot-penilaian/controller");
const { BobotPenilaian } = require("../../models");

jest.mock("../../models");

describe("deleteBobotPenilaianById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if bobotPenilaianId is not provided", async () => {
    await deleteBobotPenilaianById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Bobot Penilaian ID is required",
    });
    expect(BobotPenilaian.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if bobotPenilaian is not found", async () => {
    req.params.id = 1;

    BobotPenilaian.findByPk.mockResolvedValue(null);

    await deleteBobotPenilaianById(req, res, next);

    expect(BobotPenilaian.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Bobot Penilaian With ID ${req.params.id} Not Found:`,
    });
  });

  it("should delete bobotPenilaian and return 200 if bobotPenilaian is found", async () => {
    req.params.id = 1;

    const mockBobotPenilaian = {
      destroy: jest.fn(),
    };

    BobotPenilaian.findByPk.mockResolvedValue(mockBobotPenilaian);

    await deleteBobotPenilaianById(req, res, next);

    expect(BobotPenilaian.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(mockBobotPenilaian.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Bobot Penilaian With ID ${req.params.id} Success:`,
    });
  });

  it("should handle errors", async () => {
    req.params.id = 1;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    BobotPenilaian.findByPk.mockRejectedValue(error);

    await deleteBobotPenilaianById(req, res, next);

    expect(BobotPenilaian.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(next).toHaveBeenCalledWith(error);
  });
});
