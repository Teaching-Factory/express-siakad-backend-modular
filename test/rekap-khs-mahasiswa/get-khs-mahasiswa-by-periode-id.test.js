const httpMocks = require("node-mocks-http");
const { getKHSMahasiswaByPeriodeId } = require("../../src/controllers/rekap-khs-mahasiswa");
const { Mahasiswa } = require("../../models");
const axios = require("axios");
const getToken = require("../../src/controllers/api-feeder/get-token");

jest.mock("axios");
jest.mock("../../models");
jest.mock("../../src/controllers/api-feeder/get-token");

describe("getKHSMahasiswaByPeriodeId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      params: {
        id_periode: "2024-01",
      },
      user: {
        username: "testuser",
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if periode ID is not provided", async () => {
    req.params.id_periode = null;

    await getKHSMahasiswaByPeriodeId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Periode ID is required" });
  });

  it("should return 404 if mahasiswa is not found", async () => {
    Mahasiswa.findOne.mockResolvedValue(null);

    await getKHSMahasiswaByPeriodeId(req, res, next);

    expect(Mahasiswa.findOne).toHaveBeenCalledWith({
      where: {
        nim: "testuser",
      },
      include: expect.any(Array),
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Mahasiswa not found" });
  });
});
