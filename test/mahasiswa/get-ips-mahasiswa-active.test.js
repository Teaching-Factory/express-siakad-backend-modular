const httpMocks = require("node-mocks-http");
const { getIpsMahasiswaActive } = require("../../src/controllers/mahasiswa");
const { Mahasiswa, Prodi, JenjangPendidikan, Agama } = require("../../models");
const axios = require("axios");
const getToken = require("../../src/controllers/api-feeder/get-token");

jest.mock("axios");
jest.mock("../../models");
jest.mock("../../src/controllers/api-feeder/get-token");

describe("getIpsMahasiswaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      user: {
        username: "testuser",
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 404 if mahasiswa is not found", async () => {
    Mahasiswa.findOne.mockResolvedValue(null);

    await getIpsMahasiswaActive(req, res, next);

    expect(Mahasiswa.findOne).toHaveBeenCalledWith({
      where: {
        nim: "testuser",
      },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }, { model: Agama }],
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Mahasiswa not found" });
  });
});
