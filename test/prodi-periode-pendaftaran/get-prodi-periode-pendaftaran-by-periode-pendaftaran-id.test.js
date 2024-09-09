const httpMocks = require("node-mocks-http");
const { getProdiPeriodePendaftaranByPeriodePendaftaranId } = require("../../src/controllers/prodi-periode-pendaftaran");
const { ProdiPeriodePendaftaran, Prodi, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getProdiPeriodePendaftaranByPeriodePendaftaranId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if periode_pendaftaran ID is not provided", async () => {
    req.params.id_periode_pendaftaran = undefined;

    await getProdiPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Periode Pendaftaran ID is required"
    });
  });

  it("should return prodi_periode_pendaftarans by periode_pendaftaran ID with status 200", async () => {
    const mockProdiPeriodePendaftarans = [
      {
        id: 1,
        Prodi: { id: 1, nama_prodi: "Prodi 1" },
        PeriodePendaftaran: { id: 1, nama_periode: "Periode 1" }
      },
      {
        id: 2,
        Prodi: { id: 2, nama_prodi: "Prodi 2" },
        PeriodePendaftaran: { id: 2, nama_periode: "Periode 2" }
      }
    ];
    req.params.id_periode_pendaftaran = 1;

    ProdiPeriodePendaftaran.findAll.mockResolvedValue(mockProdiPeriodePendaftarans);

    await getProdiPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(ProdiPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 1 },
      include: [{ model: Prodi }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Prodi Periode Pendaftaran By ID Periode Pendaftaran 1 Success:`,
      data: mockProdiPeriodePendaftarans
    });
  });

  it("should return 404 if prodi_periode_pendaftaran is not found", async () => {
    req.params.id_periode_pendaftaran = 999;

    ProdiPeriodePendaftaran.findAll.mockResolvedValue(null);

    await getProdiPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(ProdiPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 999 },
      include: [{ model: Prodi }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Prodi Periode Pendaftaran With ID Periode Pendaftaran 999 Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id_periode_pendaftaran = 1;

    ProdiPeriodePendaftaran.findAll.mockRejectedValue(error);

    await getProdiPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(ProdiPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 1 },
      include: [{ model: Prodi }, { model: PeriodePendaftaran }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
