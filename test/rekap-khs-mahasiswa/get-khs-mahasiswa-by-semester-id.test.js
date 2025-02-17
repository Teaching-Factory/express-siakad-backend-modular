const httpMocks = require("node-mocks-http");
const { getKHSMahasiswaBySemesterId } = require("../../src/controllers/rekap-khs-mahasiswa");
const { Mahasiswa } = require("../../models");

jest.mock("axios");
jest.mock("../../models");
jest.mock("../../src/controllers/api-feeder/get-token");

describe("getKHSMahasiswaBySemesterId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      params: {
        id_semester: "20241",
      },
      user: {
        username: "testuser",
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if semester ID is not provided", async () => {
    req.params.id_semester = null;

    await getKHSMahasiswaBySemesterId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Semester ID is required" });
  });

  it("should return 404 if mahasiswa is not found", async () => {
    Mahasiswa.findOne.mockResolvedValue(null);

    await getKHSMahasiswaBySemesterId(req, res, next);

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
