const httpMocks = require("node-mocks-http");
const { getTahapTesPeriodePendaftaranById } = require("../../src/modules/tahap-tes-periode-pendaftaran/controller");
const { TahapTesPeriodePendaftaran, JenisTes, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getTahapTesPeriodePendaftaranById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return tahap_tes_periode_pendaftaran by ID with status 200", async () => {
    const mockTahapTesPeriodePendaftaran = {
      id: 1,
      JenisTes: { id: 1, nama_tes: "Tes 1" },
      PeriodePendaftaran: { id: 1, nama_periode: "Periode 1" }
    };
    req.params.id = 1;

    TahapTesPeriodePendaftaran.findByPk.mockResolvedValue(mockTahapTesPeriodePendaftaran);

    await getTahapTesPeriodePendaftaranById(req, res, next);

    expect(TahapTesPeriodePendaftaran.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Tahap Tes Periode Pendaftaran By ID 1 Success:`,
      data: mockTahapTesPeriodePendaftaran
    });
  });

  it("should return 400 if ID is not provided", async () => {
    req.params.id = undefined;

    await getTahapTesPeriodePendaftaranById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Tahap Tes Periode Pendaftaran ID is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if tahap_tes_periode_pendaftaran is not found", async () => {
    req.params.id = 999;

    TahapTesPeriodePendaftaran.findByPk.mockResolvedValue(null);

    await getTahapTesPeriodePendaftaranById(req, res, next);

    expect(TahapTesPeriodePendaftaran.findByPk).toHaveBeenCalledWith(999, {
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Tahap Tes Periode Pendaftaran With ID 999 Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id = 1;

    TahapTesPeriodePendaftaran.findByPk.mockRejectedValue(error);

    await getTahapTesPeriodePendaftaranById(req, res, next);

    expect(TahapTesPeriodePendaftaran.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
