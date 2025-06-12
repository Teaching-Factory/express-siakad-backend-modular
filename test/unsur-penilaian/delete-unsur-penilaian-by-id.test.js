const httpMocks = require("node-mocks-http");
const { deleteUnsurPenilaianById } = require("../../src/modules/unsur-penilaian/controller");
const { UnsurPenilaian } = require("../../models");

jest.mock("../../models");

describe("deleteUnsurPenilaianById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete an existing unsur penilaian and return 200", async () => {
    req.params.id = 1;

    const mockUnsurPenilaian = {
      id: 1,
      destroy: jest.fn().mockResolvedValue(true),
    };

    UnsurPenilaian.findByPk.mockResolvedValue(mockUnsurPenilaian);

    await deleteUnsurPenilaianById(req, res, next);

    expect(UnsurPenilaian.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(mockUnsurPenilaian.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Unsur Penilaian With ID ${req.params.id} Success:`,
    });
  });

  it("should return 400 if unsurPenilaianId is not provided", async () => {
    await deleteUnsurPenilaianById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Unsur Penilaian ID is required",
    });
    expect(UnsurPenilaian.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if unsur penilaian is not found", async () => {
    req.params.id = 1;

    UnsurPenilaian.findByPk.mockResolvedValue(null);

    await deleteUnsurPenilaianById(req, res, next);

    expect(UnsurPenilaian.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Unsur Penilaian With ID ${req.params.id} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;

    UnsurPenilaian.findByPk.mockRejectedValue(error);

    await deleteUnsurPenilaianById(req, res, next);

    expect(UnsurPenilaian.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(next).toHaveBeenCalledWith(error);
  });
});
