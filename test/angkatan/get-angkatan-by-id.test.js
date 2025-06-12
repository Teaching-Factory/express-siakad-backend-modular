const httpMocks = require("node-mocks-http");
const { getAllAngkatan } = require("../../src/modules/angkatan/controller");
const { Angkatan } = require("../../models");

jest.mock("../../models");

describe("getAllAngkatan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 200 and all angkatans", async () => {
    const mockAngkatans = [
      { id: 1, name: "Angkatan 1" },
      { id: 2, name: "Angkatan 2" },
    ];

    Angkatan.findAll.mockResolvedValue(mockAngkatans);

    await getAllAngkatan(req, res, next);

    expect(Angkatan.findAll).toHaveBeenCalled();

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Angkatan Success",
      jumlahData: mockAngkatans.length,
      data: mockAngkatans,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    Angkatan.findAll.mockRejectedValue(error);

    await getAllAngkatan(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
