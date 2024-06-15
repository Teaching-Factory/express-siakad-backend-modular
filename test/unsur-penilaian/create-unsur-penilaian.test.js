const httpMocks = require("node-mocks-http");
const { createUnsurPenilaian } = require("../../src/controllers/unsur-penilaian");
const { UnsurPenilaian } = require("../../models");

jest.mock("../../models");

describe("createUnsurPenilaian", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a new unsur penilaian and return 201 if all required fields are provided", async () => {
    const mockRequestBody = {
      id_unsur: 1,
      nama_unsur_penilaian: "Unsur Penilaian Baru",
    };

    req.body = mockRequestBody;

    const mockNewUnsurPenilaian = {
      id: 1,
      id_unsur: mockRequestBody.id_unsur,
      nama_unsur_penilaian: mockRequestBody.nama_unsur_penilaian,
      nama_lembaga: "Universitas Bakti Indonesia",
    };

    UnsurPenilaian.create.mockResolvedValue(mockNewUnsurPenilaian);

    await createUnsurPenilaian(req, res, next);

    expect(UnsurPenilaian.create).toHaveBeenCalledWith({
      id_unsur: mockRequestBody.id_unsur,
      nama_unsur_penilaian: mockRequestBody.nama_unsur_penilaian,
      nama_lembaga: "Universitas Bakti Indonesia",
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Unsur Penilaian Success",
      data: mockNewUnsurPenilaian,
    });
  });

  it("should return 400 if id_unsur is not provided", async () => {
    const mockRequestBody = {
      nama_unsur_penilaian: "Unsur Penilaian Baru",
    };

    req.body = mockRequestBody;

    await createUnsurPenilaian(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_unsur is required",
    });
    expect(UnsurPenilaian.create).not.toHaveBeenCalled();
  });

  it("should return 400 if nama_unsur_penilaian is not provided", async () => {
    const mockRequestBody = {
      id_unsur: 1,
    };

    req.body = mockRequestBody;

    await createUnsurPenilaian(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_unsur_penilaian is required",
    });
    expect(UnsurPenilaian.create).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const mockRequestBody = {
      id_unsur: 1,
      nama_unsur_penilaian: "Unsur Penilaian Baru",
    };

    req.body = mockRequestBody;

    UnsurPenilaian.create.mockRejectedValue(error);

    await createUnsurPenilaian(req, res, next);

    expect(UnsurPenilaian.create).toHaveBeenCalledWith({
      id_unsur: mockRequestBody.id_unsur,
      nama_unsur_penilaian: mockRequestBody.nama_unsur_penilaian,
      nama_lembaga: "Universitas Bakti Indonesia",
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
