const httpMocks = require("node-mocks-http");
const { getAllTahapTesPeriodePendaftaran } = require("../../src/controllers/tahap-tes-periode-pendaftaran");
const { TahapTesPeriodePendaftaran, JenisTes, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getAllTahapTesPeriodePendaftaran", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all tahap_tes_periode_pendaftarans with status 200", async () => {
    const mockTahapTesPeriodePendaftarans = [
      {
        id: 1,
        JenisTes: { id: 1, nama_tes: "Tes 1" },
        PeriodePendaftaran: { id: 1, nama_periode: "Periode 1" }
      },
      {
        id: 2,
        JenisTes: { id: 2, nama_tes: "Tes 2" },
        PeriodePendaftaran: { id: 2, nama_periode: "Periode 2" }
      }
    ];

    TahapTesPeriodePendaftaran.findAll.mockResolvedValue(mockTahapTesPeriodePendaftarans);

    await getAllTahapTesPeriodePendaftaran(req, res, next);

    expect(TahapTesPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Tahap Tes Periode Pendaftaran Success",
      jumlahData: mockTahapTesPeriodePendaftarans.length,
      data: mockTahapTesPeriodePendaftarans
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    TahapTesPeriodePendaftaran.findAll.mockRejectedValue(error);

    await getAllTahapTesPeriodePendaftaran(req, res, next);

    expect(TahapTesPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      include: [{ model: JenisTes }, { model: PeriodePendaftaran }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
