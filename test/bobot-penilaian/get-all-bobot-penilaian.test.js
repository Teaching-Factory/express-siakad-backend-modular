const httpMocks = require("node-mocks-http");
const { getAllBobotPenilaian } = require("../../src/modules/bobot-penilaian/controller");
const { BobotPenilaian, Prodi, UnsurPenilaian } = require("../../models");

jest.mock("../../models");

describe("getAllBobotPenilaian", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should retrieve all bobot penilaian and return 200", async () => {
    const mockBobotPenilaian = [
      {
        id: 1,
        prodi_id: 1,
        unsur_penilaian_id: 1,
        nilai: 20,
        Prodi: { id: 1, name: "Prodi A" },
        UnsurPenilaian: { id: 1, name: "Unsur A" },
      },
      {
        id: 2,
        prodi_id: 2,
        unsur_penilaian_id: 2,
        nilai: 30,
        Prodi: { id: 2, name: "Prodi B" },
        UnsurPenilaian: { id: 2, name: "Unsur B" },
      },
    ];

    BobotPenilaian.findAll.mockResolvedValue(mockBobotPenilaian);

    await getAllBobotPenilaian(req, res, next);

    expect(BobotPenilaian.findAll).toHaveBeenCalledWith({
      include: [{ model: Prodi }, { model: UnsurPenilaian }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Bobot Penilaian Success",
      jumlahData: mockBobotPenilaian.length,
      data: mockBobotPenilaian,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    BobotPenilaian.findAll.mockRejectedValue(error);

    await getAllBobotPenilaian(req, res, next);

    expect(BobotPenilaian.findAll).toHaveBeenCalledWith({
      include: [{ model: Prodi }, { model: UnsurPenilaian }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
