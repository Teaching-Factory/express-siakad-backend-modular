const httpMocks = require("node-mocks-http");
const { createJenisTes } = require("../../src/modules/jenis-tes/controller");
const { JenisTes } = require("../../models");

jest.mock("../../models");

describe("createJenisTes", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if nama_tes is not provided", async () => {
    req.body = {
      keterangan_singkat: "Deskripsi singkat"
    };

    await createJenisTes(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_tes is required"
    });
    expect(JenisTes.create).not.toHaveBeenCalled();
  });

  it("should create a new jenis tes and return 201", async () => {
    const mockJenisTes = {
      id: 1,
      nama_tes: "Tes A",
      keterangan_singkat: "Deskripsi singkat",
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    req.body = {
      nama_tes: "Tes A",
      keterangan_singkat: "Deskripsi singkat"
    };

    JenisTes.create.mockResolvedValue(mockJenisTes);

    await createJenisTes(req, res, next);

    expect(JenisTes.create).toHaveBeenCalledWith({
      nama_tes: "Tes A",
      keterangan_singkat: "Deskripsi singkat"
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Jenis Tes Success",
      data: mockJenisTes
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = {
      nama_tes: "Tes A",
      keterangan_singkat: "Deskripsi singkat"
    };

    JenisTes.create.mockRejectedValue(error);

    await createJenisTes(req, res, next);

    expect(JenisTes.create).toHaveBeenCalledWith({
      nama_tes: "Tes A",
      keterangan_singkat: "Deskripsi singkat"
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
