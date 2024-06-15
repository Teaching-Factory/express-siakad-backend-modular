const httpMocks = require("node-mocks-http");
const { getAllRuangPerkuliahan } = require("../../src/controllers/ruang-perkuliahan");
const { RuangPerkuliahan } = require("../../models");

jest.mock("../../models");

describe("getAllRuangPerkuliahan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all ruang perkuliahan and return 200", async () => {
    const mockRuangPerkuliahan = [
      {
        id: 1,
        nama: "Ruang 101",
        kapasitas: 30,
        fasilitas: "Proyektor, AC",
      },
      {
        id: 2,
        nama: "Ruang 102",
        kapasitas: 25,
        fasilitas: "Proyektor",
      },
    ];

    RuangPerkuliahan.findAll.mockResolvedValue(mockRuangPerkuliahan);

    await getAllRuangPerkuliahan(req, res, next);

    expect(RuangPerkuliahan.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Ruang Perkuliahan Success",
      jumlahData: mockRuangPerkuliahan.length,
      data: mockRuangPerkuliahan,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    RuangPerkuliahan.findAll.mockRejectedValue(error);

    await getAllRuangPerkuliahan(req, res, next);

    expect(RuangPerkuliahan.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
