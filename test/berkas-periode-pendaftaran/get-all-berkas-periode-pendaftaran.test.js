const httpMocks = require("node-mocks-http");
const { getAllBerkasPeriodePendaftaran } = require("../../src/controllers/berkas-periode-pendaftaran");
const { BerkasPeriodePendaftaran, JenisBerkas, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getAllBerkasPeriodePendaftaran", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all berkas_periode_pendaftarans with status 200", async () => {
    const mockBerkasPeriodePendaftarans = [
      {
        id: 1,
        JenisBerkas: { id: 1, nama_berkas: "Berkas 1" },
        PeriodePendaftaran: { id: 1, nama_periode: "Periode 1" }
      },
      {
        id: 2,
        JenisBerkas: { id: 2, nama_berkas: "Berkas 2" },
        PeriodePendaftaran: { id: 2, nama_periode: "Periode 2" }
      }
    ];

    BerkasPeriodePendaftaran.findAll.mockResolvedValue(mockBerkasPeriodePendaftarans);

    await getAllBerkasPeriodePendaftaran(req, res, next);

    expect(BerkasPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      include: [{ model: JenisBerkas }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Berkas Periode Pendaftaran Success",
      jumlahData: mockBerkasPeriodePendaftarans.length,
      data: mockBerkasPeriodePendaftarans
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    BerkasPeriodePendaftaran.findAll.mockRejectedValue(error);

    await getAllBerkasPeriodePendaftaran(req, res, next);

    expect(BerkasPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      include: [{ model: JenisBerkas }, { model: PeriodePendaftaran }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
