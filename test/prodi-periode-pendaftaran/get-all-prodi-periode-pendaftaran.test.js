const httpMocks = require("node-mocks-http");
const { getAllProdiPeriodePendaftaran } = require("../../src/modules/prodi-periode-pendaftaran/controller");
const { ProdiPeriodePendaftaran, Prodi, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getAllProdiPeriodePendaftaran", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all prodi_periode_pendaftarans with status 200", async () => {
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

    ProdiPeriodePendaftaran.findAll.mockResolvedValue(mockProdiPeriodePendaftarans);

    await getAllProdiPeriodePendaftaran(req, res, next);

    expect(ProdiPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      include: [{ model: Prodi }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Prodi Periode Pendaftaran Success",
      jumlahData: mockProdiPeriodePendaftarans.length,
      data: mockProdiPeriodePendaftarans
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    ProdiPeriodePendaftaran.findAll.mockRejectedValue(error);

    await getAllProdiPeriodePendaftaran(req, res, next);

    expect(ProdiPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      include: [{ model: Prodi }, { model: PeriodePendaftaran }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
