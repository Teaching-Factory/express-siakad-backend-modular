const { rekapSumberInformasiPMB } = require("../../src/controllers/rekap-laporan-pmb");
const { PeriodePendaftaran, Semester, SumberInfoCamaba, SumberPeriodePendaftaran, Camaba } = require("../../models");

jest.mock("../../models");

describe("rekapSumberInformasiPMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {
        id_semester: 1,
        id_periode_pendaftaran: 1,
        tanggal_penandatanganan: "2024-09-23",
        format: "pdf"
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if id_semester is missing", async () => {
    delete req.query.id_semester;

    await rekapSumberInformasiPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_semester is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if id_periode_pendaftaran is missing", async () => {
    delete req.query.id_periode_pendaftaran;

    await rekapSumberInformasiPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_periode_pendaftaran is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if tanggal_penandatanganan is missing", async () => {
    delete req.query.tanggal_penandatanganan;

    await rekapSumberInformasiPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "tanggal_penandatanganan is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if format is missing", async () => {
    delete req.query.format;

    await rekapSumberInformasiPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "format is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if PeriodePendaftaran is not found", async () => {
    PeriodePendaftaran.findByPk.mockResolvedValue(null);

    await rekapSumberInformasiPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== Periode Pendaftaran With ID ${req.query.id_periode_pendaftaran} Not Found:`
    });
  });

  it("should return 200 with the correct data if all queries are valid", async () => {
    const mockPeriodePendaftaran = { id: 1, Semester: { id: 1, name: "Semester 1" } };
    const mockSumberInformasiCamaba = [
      {
        id: 1,
        Camaba: { id: 1, name: "John Doe" },
        SumberPeriodePendaftaran: { PeriodePendaftaran: { id: 1 } }
      }
    ];

    PeriodePendaftaran.findByPk.mockResolvedValue(mockPeriodePendaftaran);
    SumberInfoCamaba.findAll.mockResolvedValue(mockSumberInformasiCamaba);

    await rekapSumberInformasiPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "GET Rekap Sumber Informasi PMB By Request Query Success",
      tanggalPenandatanganan: req.query.tanggal_penandatanganan,
      format: req.query.format,
      dataPeriodePendaftaran: mockPeriodePendaftaran,
      totalData: mockSumberInformasiCamaba.length,
      data: mockSumberInformasiCamaba
    });
  });

  it("should call next with an error if an exception occurs", async () => {
    const error = new Error("Database error");
    PeriodePendaftaran.findByPk.mockRejectedValue(error);

    await rekapSumberInformasiPMB(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
