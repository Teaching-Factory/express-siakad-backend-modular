const httpMocks = require("node-mocks-http");
const { getPeriodePendaftaranDibuka } = require("../../src/controllers/periode-pendaftaran");
const { PeriodePendaftaran, Semester, SistemKuliah, JalurMasuk } = require("../../models");

jest.mock("../../models");

describe("getPeriodePendaftaranDibuka", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all opened periode_pendaftarans with status 200", async () => {
    // Setup mock data
    const mockPeriodePendaftarans = [
      {
        id: 1,
        nama_periode_pendaftaran: "Periode 1",
        dibuka: true,
        Semester: { id: 1, nama_semester: "Semester 1" },
        SistemKuliah: { id: 1, nama_sistem: "Sistem 1" },
        JalurMasuk: { id: 1, nama_jalur: "Jalur 1" }
      },
      {
        id: 2,
        nama_periode_pendaftaran: "Periode 2",
        dibuka: true,
        Semester: { id: 1, nama_semester: "Semester 1" },
        SistemKuliah: { id: 1, nama_sistem: "Sistem 1" },
        JalurMasuk: { id: 1, nama_jalur: "Jalur 1" }
      }
    ];

    // Set up mock implementation
    PeriodePendaftaran.findAll.mockResolvedValue(mockPeriodePendaftarans);

    // Call the controller function
    await getPeriodePendaftaranDibuka(req, res, next);

    // Assertions
    expect(PeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { dibuka: true },
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Periode Pendaftaran Dibuka Success:",
      jumlahData: mockPeriodePendaftarans.length,
      data: mockPeriodePendaftarans
    });
  });

  it("should return 404 if no periode_pendaftarans are found", async () => {
    // Set up mock implementation to return null
    PeriodePendaftaran.findAll.mockResolvedValue(null);

    // Call the controller function
    await getPeriodePendaftaranDibuka(req, res, next);

    // Assertions
    expect(PeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { dibuka: true },
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Periode Pendaftaran Dibuka Not Found:"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PeriodePendaftaran.findAll.mockRejectedValue(error);

    await getPeriodePendaftaranDibuka(req, res, next);

    expect(PeriodePendaftaran.findAll).toHaveBeenCalledWith({
      where: { dibuka: true },
      include: [{ model: Semester }, { model: SistemKuliah }, { model: JalurMasuk }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
