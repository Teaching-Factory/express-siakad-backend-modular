const httpMocks = require("node-mocks-http");
const { updateSemesterAktifNow } = require("../../src/controllers/semester-aktif");
const { SemesterAktif } = require("../../models");

jest.mock("../../models");

describe("updateSemesterAktifNow", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if id_semester is not provided", async () => {
    req.body = {};

    await updateSemesterAktifNow(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_semester is required" });
  });

  it("should return 404 if no active semester is found", async () => {
    req.body = { id_semester: 1 };

    SemesterAktif.findOne.mockResolvedValue(null);

    await updateSemesterAktifNow(req, res, next);

    expect(SemesterAktif.findOne).toHaveBeenCalledWith({
      where: {
        status: true,
      },
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Semester Aktif Not Found:`,
    });
  });

  it("should update the active semester and return 200", async () => {
    const mockSemesterAktif = { id: 1, id_semester: 2, status: true, save: jest.fn().mockResolvedValue(true) };
    req.body = { id_semester: 1 };

    SemesterAktif.findOne.mockResolvedValue(mockSemesterAktif);

    await updateSemesterAktifNow(req, res, next);

    expect(SemesterAktif.findOne).toHaveBeenCalledWith({
      where: {
        status: true,
      },
    });
    expect(mockSemesterAktif.id_semester).toBe(1);
    expect(mockSemesterAktif.save).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);

    // Buat objek data yang diharapkan tanpa fungsi `save`
    const expectedData = {
      id: 1,
      id_semester: 1,
      status: true,
    };

    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Semester Aktif Success:`,
      data: expectedData,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.body = { id_semester: 1 };

    SemesterAktif.findOne.mockRejectedValue(error);

    await updateSemesterAktifNow(req, res, next);

    expect(SemesterAktif.findOne).toHaveBeenCalledWith({
      where: {
        status: true,
      },
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
