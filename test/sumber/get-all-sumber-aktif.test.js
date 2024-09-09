const httpMocks = require("node-mocks-http");
const { getAllSumberAktif } = require("../../src/controllers/sumber");
const { Sumber } = require("../../models");

jest.mock("../../models");

describe("getAllSumberAktif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all active sumbers with status 200", async () => {
    const mockSumberAktif = [
      { id: 1, nama: "Sumber 1", status: true },
      { id: 2, nama: "Sumber 2", status: true }
    ];

    Sumber.findAll.mockResolvedValue(mockSumberAktif);

    await getAllSumberAktif(req, res, next);

    expect(Sumber.findAll).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Sumber Aktif Success",
      jumlahData: mockSumberAktif.length,
      data: mockSumberAktif
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Sumber.findAll.mockRejectedValue(error);

    await getAllSumberAktif(req, res, next);

    expect(Sumber.findAll).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
