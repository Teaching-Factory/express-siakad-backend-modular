const httpMocks = require("node-mocks-http");
const { getUnsurPenilaianById } = require("../../src/controllers/unsur-penilaian");
const { UnsurPenilaian } = require("../../models");

jest.mock("../../models");

describe("getUnsurPenilaianById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return unsur penilaian by ID and return 200", async () => {
    const mockUnsurPenilaian = { id: 1, nama: "Unsur 1", bobot: 10 };
    const UnsurPenilaianId = 1;

    req.params.id = UnsurPenilaianId;

    UnsurPenilaian.findByPk.mockResolvedValue(mockUnsurPenilaian);

    await getUnsurPenilaianById(req, res, next);

    expect(UnsurPenilaian.findByPk).toHaveBeenCalledWith(UnsurPenilaianId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Unsur Penilaian By ID ${UnsurPenilaianId} Success:`,
      data: mockUnsurPenilaian,
    });
  });

  it("should return 400 if ID is not provided", async () => {
    req.params.id = undefined;

    await getUnsurPenilaianById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Unsur Penilaian ID is required",
    });
    expect(UnsurPenilaian.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if unsur penilaian is not found", async () => {
    const UnsurPenilaianId = 999;

    req.params.id = UnsurPenilaianId;

    UnsurPenilaian.findByPk.mockResolvedValue(null);

    await getUnsurPenilaianById(req, res, next);

    expect(UnsurPenilaian.findByPk).toHaveBeenCalledWith(UnsurPenilaianId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Unsur Penilaian With ID ${UnsurPenilaianId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const UnsurPenilaianId = 1;

    req.params.id = UnsurPenilaianId;

    UnsurPenilaian.findByPk.mockRejectedValue(error);

    await getUnsurPenilaianById(req, res, next);

    expect(UnsurPenilaian.findByPk).toHaveBeenCalledWith(UnsurPenilaianId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
