const httpMocks = require("node-mocks-http");
const { createAngkatan } = require("../../src/controllers/angkatan");
const { Angkatan } = require("../../models");

jest.mock("../../models");

describe("createAngkatan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a new angkatan and return 201 if 'tahun' is provided", async () => {
    const newAngkatan = { id: 1, tahun: 2024 };
    req.body.tahun = 2024;

    Angkatan.create.mockResolvedValue(newAngkatan);

    await createAngkatan(req, res, next);

    expect(Angkatan.create).toHaveBeenCalledWith({ tahun: 2024 });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Angkatan Success",
      data: newAngkatan,
    });
  });

  it("should return 400 if 'tahun' is not provided", async () => {
    req.body.tahun = undefined;

    await createAngkatan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "tahun is required",
    });
    expect(Angkatan.create).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.body.tahun = 2024;

    Angkatan.create.mockRejectedValue(error);

    await createAngkatan(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
