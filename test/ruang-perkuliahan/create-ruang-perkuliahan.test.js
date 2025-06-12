const httpMocks = require("node-mocks-http");
const { createRuangPerkuliahan } = require("../../src/modules/ruang-perkuliahan/controller");
const { RuangPerkuliahan } = require("../../models");

jest.mock("../../models");

describe("createRuangPerkuliahan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a new ruang perkuliahan and return 201", async () => {
    const mockRuangPerkuliahan = {
      id_ruang: 1,
      nama_ruang_perkuliahan: "Ruang 101",
      lokasi: "Gedung A",
    };

    req.body = mockRuangPerkuliahan;
    RuangPerkuliahan.create.mockResolvedValue(mockRuangPerkuliahan);

    await createRuangPerkuliahan(req, res, next);

    expect(RuangPerkuliahan.create).toHaveBeenCalledWith(mockRuangPerkuliahan);
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Ruang Perkuliahan Success",
      data: mockRuangPerkuliahan,
    });
  });

  it("should return 400 if id_ruang is missing", async () => {
    req.body = {
      nama_ruang_perkuliahan: "Ruang 101",
      lokasi: "Gedung A",
    };

    await createRuangPerkuliahan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_ruang is required" });
    expect(RuangPerkuliahan.create).not.toHaveBeenCalled();
  });

  it("should return 400 if nama_ruang_perkuliahan is missing", async () => {
    req.body = {
      id_ruang: 1,
      lokasi: "Gedung A",
    };

    await createRuangPerkuliahan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "nama_ruang_perkuliahan is required" });
    expect(RuangPerkuliahan.create).not.toHaveBeenCalled();
  });

  it("should return 400 if lokasi is missing", async () => {
    req.body = {
      id_ruang: 1,
      nama_ruang_perkuliahan: "Ruang 101",
    };

    await createRuangPerkuliahan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "lokasi is required" });
    expect(RuangPerkuliahan.create).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockRuangPerkuliahan = {
      id_ruang: 1,
      nama_ruang_perkuliahan: "Ruang 101",
      lokasi: "Gedung A",
    };

    req.body = mockRuangPerkuliahan;
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    RuangPerkuliahan.create.mockRejectedValue(error);

    await createRuangPerkuliahan(req, res, next);

    expect(RuangPerkuliahan.create).toHaveBeenCalledWith(mockRuangPerkuliahan);
    expect(next).toHaveBeenCalledWith(error);
  });
});
