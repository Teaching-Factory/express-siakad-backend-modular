const httpMocks = require("node-mocks-http");
const { getAllPeriodeYudisium } = require("../../src/modules/periode-yudisium/controller");
const { PeriodeYudisium, Semester } = require("../../models");

jest.mock("../../models");

describe("getAllPeriodeYudisium", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all periode_yudisiums with status 200", async () => {
    const mockPeriodeYudisiums = [
      {
        id: 1,
        nama: "Periode Yudisium 1",
        Semester: { id: 1, nama: "Semester 1" }
      },
      {
        id: 2,
        nama: "Periode Yudisium 2",
        Semester: { id: 2, nama: "Semester 2" }
      }
    ];

    PeriodeYudisium.findAll.mockResolvedValue(mockPeriodeYudisiums);

    await getAllPeriodeYudisium(req, res, next);

    expect(PeriodeYudisium.findAll).toHaveBeenCalledWith({
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Periode Yudisium Success",
      jumlahData: mockPeriodeYudisiums.length,
      data: mockPeriodeYudisiums
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PeriodeYudisium.findAll.mockRejectedValue(error);

    await getAllPeriodeYudisium(req, res, next);

    expect(PeriodeYudisium.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
