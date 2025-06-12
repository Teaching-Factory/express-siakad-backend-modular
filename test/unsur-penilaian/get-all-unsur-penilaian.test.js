const httpMocks = require("node-mocks-http");
const { getAllUnsurPenilaian } = require("../../src/modules/unsur-penilaian/controller");
const { UnsurPenilaian } = require("../../models");

jest.mock("../../models");

describe("getAllUnsurPenilaian", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all unsur penilaian and return 200", async () => {
    const mockUnsurPenilaian = [
      { id: 1, nama: "Unsur 1", bobot: 10 },
      { id: 2, nama: "Unsur 2", bobot: 20 },
    ];

    UnsurPenilaian.findAll.mockResolvedValue(mockUnsurPenilaian);

    await getAllUnsurPenilaian(req, res, next);

    expect(UnsurPenilaian.findAll).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Unsur Penilaian Success",
      jumlahData: mockUnsurPenilaian.length,
      data: mockUnsurPenilaian,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    UnsurPenilaian.findAll.mockRejectedValue(error);

    await getAllUnsurPenilaian(req, res, next);

    expect(UnsurPenilaian.findAll).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
