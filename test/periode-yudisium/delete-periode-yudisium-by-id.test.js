const httpMocks = require("node-mocks-http");
const { deletePeriodeYudisiumById } = require("../../src/modules/periode-yudisium/controller");
const { PeriodeYudisium } = require("../../models");

jest.mock("../../models");

describe("deletePeriodeYudisiumById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete periode yudisium and return 200 if ID is provided", async () => {
    const periodeYudisiumId = 1;
    req.params.id = periodeYudisiumId;

    PeriodeYudisium.findByPk.mockResolvedValue({
      id: periodeYudisiumId,
      destroy: jest.fn().mockResolvedValue(true)
    });

    await deletePeriodeYudisiumById(req, res, next);

    expect(PeriodeYudisium.findByPk).toHaveBeenCalledWith(periodeYudisiumId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Periode Yudisium With ID ${periodeYudisiumId} Success:`
    });
  });

  it("should return 400 if Periode Yudisium ID is not provided", async () => {
    req.params.id = undefined;

    await deletePeriodeYudisiumById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Periode Yudisium ID is required"
    });
    expect(PeriodeYudisium.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if Periode Yudisium is not found", async () => {
    const periodeYudisiumId = 999; // ID yang tidak ada dalam database
    req.params.id = periodeYudisiumId;

    PeriodeYudisium.findByPk.mockResolvedValue(null);

    await deletePeriodeYudisiumById(req, res, next);

    expect(PeriodeYudisium.findByPk).toHaveBeenCalledWith(periodeYudisiumId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Periode Yudisium With ID ${periodeYudisiumId} Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const periodeYudisiumId = 1;
    req.params.id = periodeYudisiumId;

    PeriodeYudisium.findByPk.mockRejectedValue(error);

    await deletePeriodeYudisiumById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
