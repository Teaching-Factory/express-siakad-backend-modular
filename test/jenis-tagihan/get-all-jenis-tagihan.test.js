const httpMocks = require("node-mocks-http");
const { getAllJenisTagihan } = require("../../src/controllers/jenis-tagihan");
const { JenisTagihan } = require("../../models");

jest.mock("../../models");

describe("getAllJenisTagihan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all Jenis Tagihan with status 200 if successful", async () => {
    const mockJenisTagihans = [
      { id: 1, nama: "Tagihan 1" },
      { id: 2, nama: "Tagihan 2" },
    ];

    JenisTagihan.findAll.mockResolvedValue(mockJenisTagihans);

    await getAllJenisTagihan(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jenis Tagihan Success",
      jumlahData: mockJenisTagihans.length,
      data: mockJenisTagihans,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    JenisTagihan.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllJenisTagihan(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
