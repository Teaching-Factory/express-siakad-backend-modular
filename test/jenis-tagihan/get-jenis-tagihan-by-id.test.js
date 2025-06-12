const httpMocks = require("node-mocks-http");
const { getJenisTagihanById } = require("../../src/modules/jenis-tagihan/controller");
const { JenisTagihan } = require("../../models");

jest.mock("../../models");

describe("getJenisTagihanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if Jenis Tagihan ID is not provided", async () => {
    req.params.id = undefined;

    await getJenisTagihanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Tagihan ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if Jenis Tagihan is not found", async () => {
    const mockJenisTagihanId = 1;
    JenisTagihan.findByPk.mockResolvedValue(null);

    req.params.id = mockJenisTagihanId;

    await getJenisTagihanById(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Jenis Tagihan With ID ${mockJenisTagihanId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return Jenis Tagihan with status 200 if found", async () => {
    const mockJenisTagihanId = 1;
    const mockJenisTagihan = { id: mockJenisTagihanId, nama: "Tagihan 1" };

    JenisTagihan.findByPk.mockResolvedValue(mockJenisTagihan);

    req.params.id = mockJenisTagihanId;

    await getJenisTagihanById(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Jenis Tagihan By ID ${mockJenisTagihanId} Success:`,
      data: mockJenisTagihan,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    JenisTagihan.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = 1;

    await getJenisTagihanById(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
