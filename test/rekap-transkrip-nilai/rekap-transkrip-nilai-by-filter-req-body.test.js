const httpMocks = require("node-mocks-http");
const { getRekapTranskripNilaiByFilterReqBody } = require("../../src/modules/rekap-transkrip-nilai/controller");
const { Mahasiswa } = require("../../models");

jest.mock("../../models");
jest.mock("../../src/modules/api-feeder/data-feeder/get-token.js");
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
    req.query = {
      tanggal_penandatanganan: "2024-01-01",
      format: "pdf",
    };

    await getRekapTranskripNilaiByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "nim is required" });
  });

  it("should return 400 if tanggal_penandatanganan is not provided", async () => {
    req.query = {
      nim: "123456",
      format: "pdf",
    };

    await getRekapTranskripNilaiByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "tanggal_penandatanganan is required" });
  });

  it("should return 400 if format is not provided", async () => {
    req.query = {
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

    req.query = {
      nim: "123456",
      tanggal_penandatanganan: "2024-01-01",
      format: "pdf",
    };

    await getRekapTranskripNilaiByFilterReqBody(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
