const httpMocks = require("node-mocks-http");
const { getProdiPeriodePendaftaranById } = require("../../src/controllers/prodi-periode-pendaftaran");
const { ProdiPeriodePendaftaran, Prodi, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getProdiPeriodePendaftaranById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if prodi_periode_pendaftaran ID is not provided", async () => {
    // ID tidak diberikan
    req.params.id = undefined;

    await getProdiPeriodePendaftaranById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi Periode Pendaftaran ID is required"
    });
  });

  it("should return prodi_periode_pendaftaran by ID with status 200", async () => {
    const mockProdiPeriodePendaftaran = {
      id: 1,
      Prodi: { id: 1, nama_prodi: "Prodi 1" },
      PeriodePendaftaran: { id: 1, nama_periode: "Periode 1" }
    };
    req.params.id = 1;

    ProdiPeriodePendaftaran.findByPk.mockResolvedValue(mockProdiPeriodePendaftaran);

    await getProdiPeriodePendaftaranById(req, res, next);

    expect(ProdiPeriodePendaftaran.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Prodi }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Prodi Periode Pendaftaran By ID 1 Success:`,
      data: mockProdiPeriodePendaftaran
    });
  });

  it("should return 404 if prodi_periode_pendaftaran is not found", async () => {
    req.params.id = 999;

    ProdiPeriodePendaftaran.findByPk.mockResolvedValue(null);

    await getProdiPeriodePendaftaranById(req, res, next);

    expect(ProdiPeriodePendaftaran.findByPk).toHaveBeenCalledWith(999, {
      include: [{ model: Prodi }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Prodi Periode Pendaftaran With ID 999 Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id = 1;

    ProdiPeriodePendaftaran.findByPk.mockRejectedValue(error);

    await getProdiPeriodePendaftaranById(req, res, next);

    expect(ProdiPeriodePendaftaran.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Prodi }, { model: PeriodePendaftaran }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
