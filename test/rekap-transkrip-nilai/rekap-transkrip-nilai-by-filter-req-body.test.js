const httpMocks = require("node-mocks-http");
const axios = require("axios");
const { getRekapTranskripNilaiByFilterReqBody } = require("../../src/controllers/rekap-transkrip-nilai");
const { Mahasiswa, Prodi, UnitJabatan, Jabatan, Dosen } = require("../../models");
const { getToken } = require("../../src/controllers/api-feeder/get-token");

jest.mock("../../models");
jest.mock("../../src/controllers/api-feeder/get-token");
jest.mock("axios");

describe("getRekapTranskripNilaiByFilterReqBody", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if nim is not provided", async () => {
    req.body = {
      tanggal_penandatanganan: "2024-01-01",
      format: "pdf",
    };

    await getRekapTranskripNilaiByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "nim is required" });
  });

  it("should return 400 if tanggal_penandatanganan is not provided", async () => {
    req.body = {
      nim: "123456",
      format: "pdf",
    };

    await getRekapTranskripNilaiByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "tanggal_penandatanganan is required" });
  });

  it("should return 400 if format is not provided", async () => {
    req.body = {
      nim: "123456",
      tanggal_penandatanganan: "2024-01-01",
    };

    await getRekapTranskripNilaiByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "format is required" });
  });

  it("should call next with error when an exception occurs", async () => {
    const mockError = new Error("Test error");
    Mahasiswa.findOne.mockRejectedValue(mockError);

    req.body = {
      nim: "123456",
      tanggal_penandatanganan: "2024-01-01",
      format: "pdf",
    };

    await getRekapTranskripNilaiByFilterReqBody(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
