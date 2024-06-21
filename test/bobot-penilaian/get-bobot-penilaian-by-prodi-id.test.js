const { getBobotPenilaianByProdiId } = require("../../src/controllers/bobot-penilaian");
const { BobotPenilaian } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getBobotPenilaianByProdiId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return bobot penilaian and return status 200", async () => {
    req.params.id_prodi = 1;

    const mockBobotPenilaianData = [
      { id_prodi: 1, Prodi: { id: 1 }, UnsurPenilaian: { id: 1 } },
      { id_prodi: 1, Prodi: { id: 1 }, UnsurPenilaian: { id: 2 } },
    ];

    jest.spyOn(BobotPenilaian, "findAll").mockResolvedValue(mockBobotPenilaianData);

    await getBobotPenilaianByProdiId(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Bobot Penilaian By Prodi ID ${req.params.id_prodi} Success:`,
      dataJumlah: mockBobotPenilaianData.length,
      data: mockBobotPenilaianData,
    });
  });

  it("should return 400 if prodi ID is not provided", async () => {
    await getBobotPenilaianByProdiId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
  });

  it("should return 404 if bobot penilaian not found", async () => {
    const prodiId = 1;
    req.params.id_prodi = prodiId;

    jest.spyOn(BobotPenilaian, "findAll").mockResolvedValue(null);

    await getBobotPenilaianByProdiId(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Bobot Penilaian With Prodi ID ${prodiId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    req.params.id_prodi = 1;

    jest.spyOn(BobotPenilaian, "findAll").mockRejectedValue(new Error(errorMessage));

    await getBobotPenilaianByProdiId(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
