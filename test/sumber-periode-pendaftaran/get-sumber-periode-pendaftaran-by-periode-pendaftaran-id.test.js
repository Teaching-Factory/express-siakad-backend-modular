const httpMocks = require("node-mocks-http");
const { getSumberPeriodePendaftaranByPeriodePendaftaranId } = require("../../src/controllers/sumber-periode-pendaftaran");
const { SumberPeriodePendaftaran, Sumber, PeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("getSumberPeriodePendaftaranByPeriodePendaftaranId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return sumber_periode_pendaftaran by ID with status 200", async () => {
    const mockSumberPeriodePendaftaran = [
      {
        id_periode_pendaftaran: 1,
        Sumber: { id: 1, nama_sumber: "Sumber 1" },
        PeriodePendaftaran: { id: 1, nama_periode: "Periode 1" }
      }
    ];
    req.params.id_periode_pendaftaran = 1;

    SumberPeriodePendaftaran.findAll.mockResolvedValue(mockSumberPeriodePendaftaran);

    await getSumberPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(SumberPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 1 },
      include: [{ model: Sumber }, { model: PeriodePendaftaran }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Sumber Periode Pendaftaran By ID Periode Pendaftaran 1 Success:`,
      data: mockSumberPeriodePendaftaran
    });
  });

  it("should return 404 if sumber_periode_pendaftaran is not found", async () => {
    req.params.id_periode_pendaftaran = 999;

    // Mengatur mock untuk mengembalikan array kosong
    SumberPeriodePendaftaran.findAll.mockResolvedValue(null);

    // Memanggil fungsi yang akan diuji
    await getSumberPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    // Memastikan bahwa findAll dipanggil dengan parameter yang benar
    expect(SumberPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 999 },
      include: [{ model: Sumber }, { model: PeriodePendaftaran }]
    });

    // Memastikan bahwa statusCode adalah 404
    expect(res.statusCode).toBe(404);

    // Memastikan bahwa data JSON yang dikembalikan sesuai dengan yang diharapkan
    expect(res._getJSONData()).toEqual({
      message: `<===== Sumber Periode Pendaftaran With ID Periode Pendaftaran 999 Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id_periode_pendaftaran = 1;

    SumberPeriodePendaftaran.findAll.mockRejectedValue(error);

    await getSumberPeriodePendaftaranByPeriodePendaftaranId(req, res, next);

    expect(SumberPeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { id_periode_pendaftaran: 1 },
      include: [{ model: Sumber }, { model: PeriodePendaftaran }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
