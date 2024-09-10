const httpMocks = require("node-mocks-http");
const { getPeriodePendaftaranById } = require("../../src/controllers/periode-pendaftaran");
const { PeriodePendaftaran, Semester, SistemKuliah, JalurMasuk } = require("../../models");

jest.mock("../../models");

describe("getPeriodePendaftaranById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return periode_pendaftaran by ID with status 200", async () => {
    const mockPeriodePendaftaran = {
      id: 1,
      nama_periode_pendaftaran: "Periode 1",
      Semester: { id: 1, nama_semester: "Semester 1" },
      SistemKuliah: { id: 1, nama_sistem: "Sistem 1" },
      JalurMasuk: { id: 1, nama_jalur: "Jalur 1" }
    };

    PeriodePendaftaran.findByPk.mockResolvedValue(mockPeriodePendaftaran);

    req.params.id = 1;

    await getPeriodePendaftaranById(req, res, next);

    expect(PeriodePendaftaran.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Periode Pendaftaran By ID 1 Success:",
      data: mockPeriodePendaftaran
    });
  });

  it("should return 400 if ID is missing", async () => {
    await getPeriodePendaftaranById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Periode Pendaftaran ID is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if periode_pendaftaran is not found", async () => {
    PeriodePendaftaran.findByPk.mockResolvedValue(null);

    req.params.id = 1;

    await getPeriodePendaftaranById(req, res, next);

    expect(PeriodePendaftaran.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Periode Pendaftaran With ID 1 Not Found:"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PeriodePendaftaran.findByPk.mockRejectedValue(error);

    req.params.id = 1;

    await getPeriodePendaftaranById(req, res, next);

    expect(PeriodePendaftaran.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
