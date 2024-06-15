const httpMocks = require("node-mocks-http");
const { createJabatan } = require("../../src/controllers/jabatan");
const { Jabatan } = require("../../models");

jest.mock("../../models");

describe("createJabatan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create jabatan with status 201 if all required fields are provided", async () => {
    const nama_jabatan = "Test Jabatan";

    req.body = { nama_jabatan };

    const mockCreatedJabatan = {
      id: 1,
      nama_jabatan,
    };

    Jabatan.create.mockResolvedValue(mockCreatedJabatan);

    await createJabatan(req, res, next);

    expect(Jabatan.create).toHaveBeenCalledWith({ nama_jabatan });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Jabatan Success",
      data: mockCreatedJabatan,
    });
  });

  it("should return 400 if nama_jabatan is missing", async () => {
    req.body = {}; // nama_jabatan tidak disediakan

    await createJabatan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_jabatan is required",
    });

    expect(Jabatan.create).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const nama_jabatan = "Test Jabatan";
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = { nama_jabatan };

    Jabatan.create.mockRejectedValue(error);

    await createJabatan(req, res, next);

    expect(Jabatan.create).toHaveBeenCalledWith({ nama_jabatan });
    expect(next).toHaveBeenCalledWith(error);
  });
});
