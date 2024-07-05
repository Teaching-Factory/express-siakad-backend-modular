const httpMocks = require("node-mocks-http");
const { createJenisTagihan } = require("../../src/controllers/jenis-tagihan");
const { JenisTagihan } = require("../../models");

jest.mock("../../models");

describe("createJenisTagihan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if nama_jenis_tagihan is not provided", async () => {
    req.body = { status: true };

    await createJenisTagihan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_jenis_tagihan is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if status is not provided", async () => {
    req.body = { nama_jenis_tagihan: "Tagihan Baru" };

    await createJenisTagihan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "status is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should create a new Jenis Tagihan and return it with status 201 if successful", async () => {
    const mockJenisTagihan = { id: 1, nama_jenis_tagihan: "Tagihan Baru", status: true };
    JenisTagihan.create.mockResolvedValue(mockJenisTagihan);

    req.body = { nama_jenis_tagihan: "Tagihan Baru", status: true };

    await createJenisTagihan(req, res, next);

    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Jenis Tagihan Success",
      data: mockJenisTagihan,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    JenisTagihan.create.mockRejectedValue(new Error(errorMessage));

    req.body = { nama_jenis_tagihan: "Tagihan Baru", status: true };

    await createJenisTagihan(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
