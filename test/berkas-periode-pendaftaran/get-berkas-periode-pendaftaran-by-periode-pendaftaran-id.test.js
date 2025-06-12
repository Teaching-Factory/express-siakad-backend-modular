const httpMocks = require("node-mocks-http");
const { getBerkasPeriodePendaftaranByPeriodePendaftaranId } = require("../../src/modules/berkas-periode-pendaftaran/controller");
const { BerkasPeriodePendaftaran, JenisBerkas, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getBerkasPeriodePendaftaranByPeriodePendaftaranId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if periode_pendaftaran ID is not provided", async () => {
    req.params.id_periode_pendaftaran = undefined;

    await getBerkasPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Periode Pendaftaran ID is required",
    });
  });

  it("should return berkas_periode_pendaftaran by periode_pendaftaran ID with status 200", async () => {
    const mockBerkasPeriodePendaftarans = [
      {
        id: 1,
        JenisBerkas: { id: 1, nama_berkas: "Berkas 1" },
        PeriodePendaftaran: { id: 1, nama_periode: "Periode 1" },
      },
      {
        id: 2,
        JenisBerkas: { id: 2, nama_berkas: "Berkas 2" },
        PeriodePendaftaran: { id: 2, nama_periode: "Periode 2" },
      },
    ];
    req.params.id_periode_pendaftaran = 1;

    BerkasPeriodePendaftaran.findAll.mockResolvedValue(mockBerkasPeriodePendaftarans);

    await getBerkasPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(BerkasPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 1 },
      include: [{ model: JenisBerkas, as: "JenisBerkas" }, { model: PeriodePendaftaran }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Berkas Periode Pendaftaran By ID Periode Pendaftaran 1 Success:`,
      data: mockBerkasPeriodePendaftarans,
    });
  });

  it("should return 404 if berkas_periode_pendaftaran is not found", async () => {
    req.params.id_periode_pendaftaran = 999;

    BerkasPeriodePendaftaran.findAll.mockResolvedValue(null);

    await getBerkasPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(BerkasPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 999 },
      include: [{ model: JenisBerkas, as: "JenisBerkas" }, { model: PeriodePendaftaran }],
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Berkas Periode Pendaftaran With ID Periode Pendaftaran 999 Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id_periode_pendaftaran = 1;

    BerkasPeriodePendaftaran.findAll.mockRejectedValue(error);

    await getBerkasPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(BerkasPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 1 },
      include: [{ model: JenisBerkas, as: "JenisBerkas" }, { model: PeriodePendaftaran }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
