const httpMocks = require("node-mocks-http");
const { getAllSumber } = require("../../src/controllers/sumber");
const { Sumber } = require("../../models");

jest.mock("../../models");

describe("getAllSumber", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all sumbers with status 200", async () => {
    const mockSumbers = [
      { id: 1, nama: "Sumber 1" },
      { id: 2, nama: "Sumber 2" }
    ];

    Sumber.findAll.mockResolvedValue(mockSumbers);

    await getAllSumber(req, res, next);

    expect(Sumber.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Sumber Success",
      jumlahData: mockSumbers.length,
      data: mockSumbers
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Sumber.findAll.mockRejectedValue(error);

    await getAllSumber(req, res, next);

    expect(Sumber.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
