const httpMocks = require("node-mocks-http");
const { getPeriodeYudisiumById } = require("../../src/controllers/periode-yudisium");
const { PeriodeYudisium, Semester } = require("../../models");

jest.mock("../../models");

describe("getPeriodeYudisiumById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if periodeYudisiumId is not provided", async () => {
    req.params.id = undefined;

    await getPeriodeYudisiumById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Periode Yudisium ID is required"
    });
  });

  it("should return 404 if periodeYudisium is not found", async () => {
    req.params.id = 1;

    PeriodeYudisium.findByPk.mockResolvedValue(null);

    await getPeriodeYudisiumById(req, res, next);

    expect(PeriodeYudisium.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Periode Yudisium With ID 1 Not Found:`
    });
  });

  it("should return 200 and the periode yudisium data if found", async () => {
    const mockPeriodeYudisium = {
      id: 1,
      nama: "Periode Yudisium 1",
      Semester: { id: 1, nama: "Semester 1" }
    };

    req.params.id = 1;

    PeriodeYudisium.findByPk.mockResolvedValue(mockPeriodeYudisium);

    await getPeriodeYudisiumById(req, res, next);

    expect(PeriodeYudisium.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Periode Yudisium By ID 1 Success:`,
      data: mockPeriodeYudisium
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;

    PeriodeYudisium.findByPk.mockRejectedValue(error);

    await getPeriodeYudisiumById(req, res, next);

    expect(PeriodeYudisium.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
