const httpMocks = require("node-mocks-http");
const { getBobotPenilaianById } = require("../../src/controllers/bobot-penilaian");
const { BobotPenilaian, Prodi, UnsurPenilaian } = require("../../models");

jest.mock("../../models");

describe("getBobotPenilaianById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if Bobot Penilaian ID is not provided", async () => {
    req.params.id = undefined;

    await getBobotPenilaianById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Bobot Penilaian ID is required",
    });
  });

  it("should return 404 if Bobot Penilaian not found", async () => {
    const BobotPenilaianId = 1;
    req.params.id = BobotPenilaianId;

    BobotPenilaian.findByPk.mockResolvedValue(null);

    await getBobotPenilaianById(req, res, next);

    expect(BobotPenilaian.findByPk).toHaveBeenCalledWith(BobotPenilaianId, {
      include: [{ model: Prodi }, { model: UnsurPenilaian }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Bobot Penilaian With ID ${BobotPenilaianId} Not Found:`,
    });
  });

  it("should return 200 and the bobot penilaian data if found", async () => {
    const BobotPenilaianId = 1;
    req.params.id = BobotPenilaianId;

    const mockBobotPenilaian = {
      id: BobotPenilaianId,
      prodi_id: 1,
      unsur_penilaian_id: 1,
      nilai: 20,
      Prodi: { id: 1, name: "Prodi A" },
      UnsurPenilaian: { id: 1, name: "Unsur A" },
    };

    BobotPenilaian.findByPk.mockResolvedValue(mockBobotPenilaian);

    await getBobotPenilaianById(req, res, next);

    expect(BobotPenilaian.findByPk).toHaveBeenCalledWith(BobotPenilaianId, {
      include: [{ model: Prodi }, { model: UnsurPenilaian }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Bobot Penilaian By ID ${BobotPenilaianId} Success:`,
      data: mockBobotPenilaian,
    });
  });

  it("should handle errors", async () => {
    const BobotPenilaianId = 1;
    req.params.id = BobotPenilaianId;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    BobotPenilaian.findByPk.mockRejectedValue(error);

    await getBobotPenilaianById(req, res, next);

    expect(BobotPenilaian.findByPk).toHaveBeenCalledWith(BobotPenilaianId, {
      include: [{ model: Prodi }, { model: UnsurPenilaian }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
