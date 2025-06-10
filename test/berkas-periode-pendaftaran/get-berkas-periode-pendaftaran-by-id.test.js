const httpMocks = require("node-mocks-http");
const { getBerkasPeriodePendaftaranById } = require("../../src/controllers/berkas-periode-pendaftaran");
const { BerkasPeriodePendaftaran, JenisBerkas, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getBerkasPeriodePendaftaranById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if berkas_periode_pendaftaran ID is not provided", async () => {
    req.params.id = undefined;

    await getBerkasPeriodePendaftaranById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Berkas Periode Pendaftaran ID is required",
    });
  });

  it("should return berkas_periode_pendaftaran by ID with status 200", async () => {
    const mockBerkasPeriodePendaftaran = {
      id: 1,
      JenisBerkas: { id: 1, nama_berkas: "Berkas 1" },
      PeriodePendaftaran: { id: 1, nama_periode: "Periode 1" },
    };
    req.params.id = 1;

    BerkasPeriodePendaftaran.findByPk.mockResolvedValue(mockBerkasPeriodePendaftaran);

    await getBerkasPeriodePendaftaranById(req, res, next);

    expect(BerkasPeriodePendaftaran.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: JenisBerkas, as: "JenisBerkas" }, { model: PeriodePendaftaran }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Berkas Periode Pendaftaran By ID 1 Success:`,
      data: mockBerkasPeriodePendaftaran,
    });
  });

  it("should return 404 if berkas_periode_pendaftaran is not found", async () => {
    req.params.id = 999;

    BerkasPeriodePendaftaran.findByPk.mockResolvedValue(null);

    await getBerkasPeriodePendaftaranById(req, res, next);

    expect(BerkasPeriodePendaftaran.findByPk).toHaveBeenCalledWith(999, {
      include: [{ model: JenisBerkas, as: "JenisBerkas" }, { model: PeriodePendaftaran }],
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Berkas Periode Pendaftaran With ID 999 Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id = 1;

    BerkasPeriodePendaftaran.findByPk.mockRejectedValue(error);

    await getBerkasPeriodePendaftaranById(req, res, next);

    expect(BerkasPeriodePendaftaran.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: JenisBerkas, as: "JenisBerkas" }, { model: PeriodePendaftaran }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
