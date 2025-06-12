const httpMocks = require("node-mocks-http");
const { getAllPeriodePendaftaran } = require("../../src/modules/periode-pendaftaran/controller");
const { PeriodePendaftaran, Semester, SistemKuliah, JalurMasuk } = require("../../models");

jest.mock("../../models");

describe("getAllPeriodePendaftaran", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all periode_pendaftarans with status 200", async () => {
    const mockPeriodePendaftarans = [
      {
        id: 1,
        nama_periode_pendaftaran: "Periode 1",
        Semester: { id: 1, nama_semester: "Semester 1" },
        SistemKuliah: { id: 1, nama_sistem: "Sistem 1" },
        JalurMasuk: { id: 1, nama_jalur: "Jalur 1" }
      },
      {
        id: 2,
        nama_periode_pendaftaran: "Periode 2",
        Semester: { id: 2, nama_semester: "Semester 2" },
        SistemKuliah: { id: 2, nama_sistem: "Sistem 2" },
        JalurMasuk: { id: 2, nama_jalur: "Jalur 2" }
      }
    ];

    PeriodePendaftaran.findAll.mockResolvedValue(mockPeriodePendaftarans);

    await getAllPeriodePendaftaran(req, res, next);

    expect(PeriodePendaftaran.findAll).toHaveBeenCalledWith({
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Periode Pendaftaran Success",
      jumlahData: mockPeriodePendaftarans.length,
      data: mockPeriodePendaftarans
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PeriodePendaftaran.findAll.mockRejectedValue(error);

    await getAllPeriodePendaftaran(req, res, next);

    expect(PeriodePendaftaran.findAll).toHaveBeenCalledWith({
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
