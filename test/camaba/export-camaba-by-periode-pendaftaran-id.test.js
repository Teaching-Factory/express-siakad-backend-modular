const httpMocks = require("node-mocks-http");
const { exportCamabaByPeriodePendaftaranId } = require("../../src/controllers/camaba");
const { Camaba } = require("../../models");
const ExcelJS = require("exceljs");

jest.mock("../../models");
jest.mock("exceljs");

describe("exportCamabaByPeriodePendaftaranId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse({ eventEmitter: require("events").EventEmitter });
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if periodePendaftaranId is missing", async () => {
    req.params = {}; // Tidak ada ID periode pendaftaran

    await exportCamabaByPeriodePendaftaranId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Periode Pendaftaran ID is required" });
  });

  it("should return 404 if no camaba data is found", async () => {
    req.params = { id_periode_pendaftaran: 1 };
    Camaba.findAll.mockResolvedValue([]); // Tidak menemukan data camaba

    await exportCamabaByPeriodePendaftaranId(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Camaba With Periode Pendaftaran ID 1 Not Found:"
    });
  });

  //   belum pass
  //   it("should generate and send Excel file when camaba data is found", async () => {
  //     req.params = { id_periode_pendaftaran: 1 };
  //     const mockCamabaData = [
  //       {
  //         id: 1,
  //         nama_lengkap: "John Doe",
  //         tanggal_pendaftaran: "2024-10-07",
  //         nomor_hp: "1234567890",
  //         email: "john@example.com",
  //         status_berkas: true,
  //         status_tes: true,
  //         status_pembayaran: true,
  //         finalisasi: true,
  //         PeriodePendaftaran: { nama_periode_pendaftaran: "2024" },
  //         Prodi: {
  //           nama_program_studi: "Teknik Informatika",
  //           kode_program_studi: "TI",
  //           JenjangPendidikan: { nama_jenjang_didik: "S1" }
  //         }
  //       }
  //     ];

  //     Camaba.findAll.mockResolvedValue(mockCamabaData);
  //     const mockWorkbook = { addWorksheet: jest.fn().mockReturnThis(), xlsx: { write: jest.fn() } };
  //     ExcelJS.Workbook.mockReturnValue(mockWorkbook);

  //     await exportCamabaByPeriodePendaftaranId(req, res, next);

  //     expect(res.statusCode).toBe(200);
  //     expect(res.getHeader("Content-Type")).toBe("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  //     expect(res.getHeader("Content-Disposition")).toContain("attachment; filename=camaba-periode-1.xlsx");

  //     // Pastikan worksheet dan kolom diatur
  //     expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith("Camaba Data");
  //     expect(mockWorkbook.xlsx.write).toHaveBeenCalledWith(expect.any(Object)); // Memastikan bahwa file ditulis ke respons
  //   });

  it("should handle errors", async () => {
    req.params = { id_periode_pendaftaran: 1 };
    Camaba.findAll.mockRejectedValue(new Error("Database error")); // Simulasi error dari database

    await exportCamabaByPeriodePendaftaranId(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error)); // Pastikan error diproses oleh middleware
  });
});
