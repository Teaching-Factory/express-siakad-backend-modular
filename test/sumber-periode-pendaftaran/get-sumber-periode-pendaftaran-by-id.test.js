const httpMocks = require("node-mocks-http");
const { getSumberPeriodePendaftaranById } = require("../../src/controllers/sumber-periode-pendaftaran");
const { SumberPeriodePendaftaran, Sumber, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getSumberPeriodePendaftaranById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return sumber_periode_pendaftaran by ID with status 200", async () => {
    const mockSumberPeriodePendaftaran = {
      id: 1,
      Sumber: { id: 1, nama_sumber: "Sumber 1" },
      PeriodePendaftaran: { id: 1, nama_periode: "Periode 1" }
    };
    req.params.id = 1;

    SumberPeriodePendaftaran.findByPk.mockResolvedValue(mockSumberPeriodePendaftaran);

    await getSumberPeriodePendaftaranById(req, res, next);

    expect(SumberPeriodePendaftaran.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Sumber }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Sumber Periode Pendaftaran By ID 1 Success:`,
      data: mockSumberPeriodePendaftaran
    });
  });

  it("should return 404 if sumber_periode_pendaftaran is not found", async () => {
    req.params.id = 999;

    SumberPeriodePendaftaran.findByPk.mockResolvedValue(null);

    await getSumberPeriodePendaftaranById(req, res, next);

    expect(SumberPeriodePendaftaran.findByPk).toHaveBeenCalledWith(999, {
      include: [{ model: Sumber }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Sumber Periode Pendaftaran With ID 999 Not Found:"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id = 1;

    SumberPeriodePendaftaran.findByPk.mockRejectedValue(error);

    await getSumberPeriodePendaftaranById(req, res, next);

    expect(SumberPeriodePendaftaran.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Sumber }, { model: PeriodePendaftaran }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
