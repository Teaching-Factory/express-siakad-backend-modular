const httpMocks = require("node-mocks-http");
const { getAllJenisTagihanActive } = require("../../src/controllers/jenis-tagihan");
const { JenisTagihan } = require("../../models");

jest.mock("../../models");

describe("getAllJenisTagihanActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all active Jenis Tagihan with status 200 if successful", async () => {
    const mockJenisTagihans = [
      { id: 1, nama: "Tagihan 1", status: true },
      { id: 2, nama: "Tagihan 2", status: true },
    ];

    JenisTagihan.findAll.mockResolvedValue(mockJenisTagihans);

    await getAllJenisTagihanActive(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jenis Tagihan Active Success",
      jumlahData: mockJenisTagihans.length,
      data: mockJenisTagihans,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    JenisTagihan.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllJenisTagihanActive(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
