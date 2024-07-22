const httpMocks = require("node-mocks-http");
const { getMahasiswaActive } = require("../../src/controllers/mahasiswa");
const { Mahasiswa, SemesterAktif, DosenWali } = require("../../models");

jest.mock("../../models");

describe("getMahasiswaActive", () => {
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

    await getMahasiswaActive(req, res, next);

    expect(Mahasiswa.findOne).toHaveBeenCalledWith({
      where: {
        nim: "testuser",
      },
      include: expect.any(Array),
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Mahasiswa not found" });
  });

  it("should handle errors and call next with error", async () => {
    const error = new Error("Something went wrong");
    Mahasiswa.findOne.mockRejectedValue(error);

    await getMahasiswaActive(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
