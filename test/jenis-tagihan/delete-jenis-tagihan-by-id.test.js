const httpMocks = require("node-mocks-http");
const { deleteJenisTagihanById } = require("../../src/controllers/jenis-tagihan");
const { JenisTagihan } = require("../../models");

jest.mock("../../models");

describe("deleteJenisTagihanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should delete jenis tagihan and return success message with status 200 if successful", async () => {
    const mockJenisTagihan = { id: 1, destroy: jest.fn().mockResolvedValue(true) };

    JenisTagihan.findByPk.mockResolvedValue(mockJenisTagihan);

    req.params.id = 1;

    await deleteJenisTagihanById(req, res, next);

    expect(mockJenisTagihan.destroy).toHaveBeenCalled();

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== DELETE Jenis Tagihan With ID 1 Success:",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if Jenis Tagihan ID is not provided", async () => {
    req.params.id = undefined;

    await deleteJenisTagihanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Tagihan ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if jenis tagihan is not found", async () => {
    JenisTagihan.findByPk.mockResolvedValue(null);

    req.params.id = 1;

    await deleteJenisTagihanById(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Jenis Tagihan With ID 1 Not Found:",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    JenisTagihan.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = 1;

    await deleteJenisTagihanById(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
