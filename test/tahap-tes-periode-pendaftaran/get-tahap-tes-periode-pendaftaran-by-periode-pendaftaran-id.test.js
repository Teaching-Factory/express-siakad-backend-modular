const httpMocks = require("node-mocks-http");
const { getTahapTesPeriodePendaftaranByPeriodePendaftaranId } = require("../../src/modules/tahap-tes-periode-pendaftaran/controller");
const { TahapTesPeriodePendaftaran, JenisTes, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getTahapTesPeriodePendaftaranByPeriodePendaftaranId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return tahap_tes_periode_pendaftaran by periode_pendaftaran_id with status 200", async () => {
    const mockTahapTesPeriodePendaftaran = [
      {
        id: 1,
        JenisTes: { id: 1, nama_tes: "Tes 1" },
        PeriodePendaftaran: { id: 1, nama_periode: "Periode 1" }
      }
    ];
    req.params.id_periode_pendaftaran = 1;

    TahapTesPeriodePendaftaran.findAll.mockResolvedValue(mockTahapTesPeriodePendaftaran);

    await getTahapTesPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(TahapTesPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 1 },
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Tahap Tes Periode Pendaftaran By ID Periode Pendaftaran 1 Success:`,
      data: mockTahapTesPeriodePendaftaran
    });
  });

  it("should return 400 if periode_pendaftaran_id is not provided", async () => {
    req.params.id_periode_pendaftaran = undefined;

    await getTahapTesPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Periode Pendaftaran ID is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if tahap_tes_periode_pendaftaran is not found", async () => {
    req.params.id_periode_pendaftaran = 999;

    TahapTesPeriodePendaftaran.findAll.mockResolvedValue(null);

    await getTahapTesPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(TahapTesPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 999 },
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Tahap Tes Periode Pendaftaran With ID Periode Pendaftaran 999 Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id_periode_pendaftaran = 1;

    TahapTesPeriodePendaftaran.findAll.mockRejectedValue(error);

    await getTahapTesPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(TahapTesPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 1 },
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
