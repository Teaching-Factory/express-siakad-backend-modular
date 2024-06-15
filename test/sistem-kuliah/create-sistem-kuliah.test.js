const httpMocks = require("node-mocks-http");
const { createSistemKuliah } = require("../../src/controllers/sistem-kuliah");
const { SistemKuliah } = require("../../models");

jest.mock("../../models");

describe("createSistemKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a new sistem kuliah and return 201 if all required fields are provided", async () => {
    const mockRequestBody = {
      nama_sk: "Sistem Kuliah Baru",
      kode_sk: "SKB001",
    };

    req.body = mockRequestBody;

    const mockNewSistemKuliah = {
      id: 1,
      nama_sk: mockRequestBody.nama_sk,
      kode_sk: mockRequestBody.kode_sk,
    };

    SistemKuliah.create.mockResolvedValue(mockNewSistemKuliah);

    await createSistemKuliah(req, res, next);

    expect(SistemKuliah.create).toHaveBeenCalledWith({
      nama_sk: mockRequestBody.nama_sk,
      kode_sk: mockRequestBody.kode_sk,
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Sistem Kuliah Success",
      data: mockNewSistemKuliah,
    });
  });

  it("should return 400 if nama_sk is not provided", async () => {
    const mockRequestBody = {
      kode_sk: "SKB001",
    };

    req.body = mockRequestBody;

    await createSistemKuliah(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_sk is required",
    });
    expect(SistemKuliah.create).not.toHaveBeenCalled();
  });

  it("should return 400 if kode_sk is not provided", async () => {
    const mockRequestBody = {
      nama_sk: "Sistem Kuliah Baru",
    };

    req.body = mockRequestBody;

    await createSistemKuliah(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "kode_sk is required",
    });
    expect(SistemKuliah.create).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const mockRequestBody = {
      nama_sk: "Sistem Kuliah Baru",
      kode_sk: "SKB001",
    };

    req.body = mockRequestBody;

    SistemKuliah.create.mockRejectedValue(error);

    await createSistemKuliah(req, res, next);

    expect(SistemKuliah.create).toHaveBeenCalledWith({
      nama_sk: mockRequestBody.nama_sk,
      kode_sk: mockRequestBody.kode_sk,
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
