const httpMocks = require("node-mocks-http");
const { getSemesterAktifNow } = require("../../src/controllers/semester-aktif");
const { SemesterAktif, Semester } = require("../../models");

jest.mock("../../models");

describe("getSemesterAktifNow", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 404 if no active semester is found", async () => {
    SemesterAktif.findOne.mockResolvedValue(null);

    await getSemesterAktifNow(req, res, next);

    expect(SemesterAktif.findOne).toHaveBeenCalledWith({
      where: { status: true },
      include: [{ model: Semester }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Semester Aktif Not Found:",
    });
  });

  it("should return 200 and the active semester data if found", async () => {
    const mockSemesterAktif = {
      id: 1,
      nama: "Semester 1",
      status: true,
      Semester: {
        id: 1,
        nama: "2023/2024",
      },
    };
    SemesterAktif.findOne.mockResolvedValue(mockSemesterAktif);

    await getSemesterAktifNow(req, res, next);

    expect(SemesterAktif.findOne).toHaveBeenCalledWith({
      where: { status: true },
      include: [{ model: Semester }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Semester Aktif Success:",
      data: mockSemesterAktif,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SemesterAktif.findOne.mockRejectedValue(error);

    await getSemesterAktifNow(req, res, next);

    expect(SemesterAktif.findOne).toHaveBeenCalledWith({
      where: { status: true },
      include: [{ model: Semester }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
