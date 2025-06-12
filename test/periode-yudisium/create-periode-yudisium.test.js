const httpMocks = require("node-mocks-http");
const { createPeriodeYudisium } = require("../../src/modules/periode-yudisium/controller");
const { PeriodeYudisium } = require("../../models");

jest.mock("../../models");

describe("createPeriodeYudisium", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if nama_periode_yudisium is not provided", async () => {
    req.body = {
      id_semester: 1
    };

    await createPeriodeYudisium(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_periode_yudisium is required"
    });
  });

  it("should return 400 if id_semester is not provided", async () => {
    req.body = {
      nama_periode_yudisium: "Periode Yudisium 1"
    };

    await createPeriodeYudisium(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "id_semester is required"
    });
  });

  it("should create a new periode yudisium and return 201", async () => {
    const mockPeriodeYudisium = {
      id: 1,
      nama_periode_yudisium: "Periode Yudisium 1",
      id_semester: 1
    };

    req.body = {
      nama_periode_yudisium: "Periode Yudisium 1",
      id_semester: 1
    };

    PeriodeYudisium.create.mockResolvedValue(mockPeriodeYudisium);

    await createPeriodeYudisium(req, res, next);

    expect(PeriodeYudisium.create).toHaveBeenCalledWith({
      nama_periode_yudisium: "Periode Yudisium 1",
      id_semester: 1
    });
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Periode Yudisium Success",
      data: mockPeriodeYudisium
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = {
      nama_periode_yudisium: "Periode Yudisium 1",
      id_semester: 1
    };

    PeriodeYudisium.create.mockRejectedValue(error);

    await createPeriodeYudisium(req, res, next);

    expect(PeriodeYudisium.create).toHaveBeenCalledWith({
      nama_periode_yudisium: "Periode Yudisium 1",
      id_semester: 1
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
