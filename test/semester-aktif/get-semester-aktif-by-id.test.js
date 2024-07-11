const httpMocks = require("node-mocks-http");
const { getSemesterAktifById } = require("../../src/controllers/semester-aktif");
const { SemesterAktif, Semester } = require("../../models");

jest.mock("../../models");

describe("getSemesterAktifById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if semesterAktifId is not provided", async () => {
    req.params.id = undefined;

    await getSemesterAktifById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Semester Aktif ID is required",
    });
  });

  it("should return 404 if semester_aktif is not found", async () => {
    req.params.id = 1;
    SemesterAktif.findByPk.mockResolvedValue(null);

    await getSemesterAktifById(req, res, next);

    expect(SemesterAktif.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Semester Aktif With ID 1 Not Found:`,
    });
  });

  it("should return 200 and the semester_aktif data if found", async () => {
    req.params.id = 1;
    const mockSemesterAktif = {
      id: 1,
      nama: "Semester 1",
      Semester: {
        id: 1,
        nama: "2023/2024",
      },
    };
    SemesterAktif.findByPk.mockResolvedValue(mockSemesterAktif);

    await getSemesterAktifById(req, res, next);

    expect(SemesterAktif.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Semester Aktif By ID 1 Success:`,
      data: mockSemesterAktif,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id = 1;
    SemesterAktif.findByPk.mockRejectedValue(error);

    await getSemesterAktifById(req, res, next);

    expect(SemesterAktif.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
