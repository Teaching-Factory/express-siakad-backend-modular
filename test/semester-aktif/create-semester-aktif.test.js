const httpMocks = require("node-mocks-http");
const { createSemesterAktif } = require("../../src/controllers/semester-aktif");
const { SemesterAktif } = require("../../models");

jest.mock("../../models");

describe("createSemesterAktif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if id_semester is not provided", async () => {
    req.body = { status: true };

    await createSemesterAktif(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_semester is required" });
  });

  it("should return 400 if status is not provided", async () => {
    req.body = { id_semester: 1 };

    await createSemesterAktif(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "status is required" });
  });

  it("should create a new semester aktif and return 201", async () => {
    const newSemesterAktif = { id: 1, id_semester: 1, status: true };
    req.body = { id_semester: 1, status: true };

    SemesterAktif.create.mockResolvedValue(newSemesterAktif);

    await createSemesterAktif(req, res, next);

    expect(SemesterAktif.create).toHaveBeenCalledWith({ id_semester: 1, status: true });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Semester Aktif Success",
      data: newSemesterAktif,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.body = { id_semester: 1, status: true };

    SemesterAktif.create.mockRejectedValue(error);

    await createSemesterAktif(req, res, next);

    expect(SemesterAktif.create).toHaveBeenCalledWith({ id_semester: 1, status: true });
    expect(next).toHaveBeenCalledWith(error);
  });
});
