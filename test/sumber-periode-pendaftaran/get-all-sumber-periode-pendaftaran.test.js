const httpMocks = require("node-mocks-http");
const { getAllSumberPeriodePendaftaran } = require("../../src/modules/sumber-periode-pendaftaran/controller");
const { SumberPeriodePendaftaran, Sumber, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getAllSumberPeriodePendaftaran", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all sumber_periode_pendaftarans with status 200", async () => {
    const mockSumberPeriodePendaftarans = [
      {
        id: 1,
        Sumber: { id: 1, nama_sumber: "Sumber 1" },
        PeriodePendaftaran: { id: 1, nama_periode: "Periode 1" }
      },
      {
        id: 2,
        Sumber: { id: 2, nama_sumber: "Sumber 2" },
        PeriodePendaftaran: { id: 2, nama_periode: "Periode 2" }
      }
    ];

    SumberPeriodePendaftaran.findAll.mockResolvedValue(mockSumberPeriodePendaftarans);

    await getAllSumberPeriodePendaftaran(req, res, next);

    expect(SumberPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      include: [{ model: Sumber }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Sumber Periode Pendaftaran Success",
      jumlahData: mockSumberPeriodePendaftarans.length,
      data: mockSumberPeriodePendaftarans
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SumberPeriodePendaftaran.findAll.mockRejectedValue(error);

    await getAllSumberPeriodePendaftaran(req, res, next);

    expect(SumberPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      include: [{ model: Sumber }, { model: PeriodePendaftaran }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
