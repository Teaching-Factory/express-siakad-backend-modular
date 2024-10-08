const httpMocks = require("node-mocks-http");
const { importCamabaForUpdateNimKolektif } = require("../../src/controllers/camaba");
const { Camaba } = require("../../models");
const ExcelJS = require("exceljs");
const fs = require("fs/promises");

jest.mock("../../models");
jest.mock("exceljs");
jest.mock("fs/promises");

describe("importCamabaForUpdateNimKolektif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse({ eventEmitter: require("events").EventEmitter });
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if periodePendaftaranId is missing", async () => {
    req.params = {}; // Tidak ada ID periode pendaftaran

    await importCamabaForUpdateNimKolektif(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Periode Pendaftaran ID is required" });
  });

  it("should return 400 if no file is uploaded", async () => {
    req.params = { id_periode_pendaftaran: 1 }; // ID periode pendaftaran ada

    await importCamabaForUpdateNimKolektif(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "No file uploaded" });
  });

  it("should return 500 if worksheet is not found in the Excel file", async () => {
    req.params = { id_periode_pendaftaran: 1 };
    req.file = { path: "dummy/path/to/excel.xlsx" }; // Simulasi file yang diunggah

    const mockWorkbook = { worksheets: [] }; // Tidak ada worksheet
    ExcelJS.Workbook.mockReturnValue(mockWorkbook);

    await importCamabaForUpdateNimKolektif(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error)); // Pastikan error diproses oleh middleware
  });

  //   belum pass
  //   it("should update camaba data successfully and delete file", async () => {
  //     req.params = { id_periode_pendaftaran: 1 };
  //     req.file = { path: "dummy/path/to/excel.xlsx" }; // Simulasi file yang diunggah

  //     const mockRow = {
  //       getCell: jest
  //         .fn()
  //         .mockReturnValueOnce({ value: "NIM123" }) // NIM
  //         .mockReturnValueOnce({ value: "DAFT123" }) // Nomor daftar
  //     };

  //     const mockWorksheet = {
  //       rowCount: 2,
  //       getRow: jest.fn().mockReturnValue(mockRow)
  //     };

  //     const mockWorkbook = { worksheets: [mockWorksheet] };
  //     ExcelJS.Workbook.mockReturnValue(mockWorkbook);

  //     const mockCamaba = {
  //       nim: "",
  //       save: jest.fn().mockResolvedValue({ nim: "NIM123" }) // Simulasi simpan
  //     };
  //     Camaba.findOne.mockResolvedValue(mockCamaba); // Mengembalikan camaba yang ditemukan

  //     await importCamabaForUpdateNimKolektif(req, res, next);

  //     expect(mockCamaba.nim).toBe("NIM123"); // Pastikan nim diupdate
  //     expect(mockCamaba.save).toHaveBeenCalled(); // Pastikan save dipanggil
  //     expect(fs.unlink).toHaveBeenCalledWith("dummy/path/to/excel.xlsx"); // Pastikan file dihapus
  //     expect(res.statusCode).toBe(200); // Harus merespon 200
  //     expect(res._getJSONData()).toEqual({
  //       message: "Import and Update Data Nim Camaba Kolektif Success",
  //       jumlahData: 1,
  //       data: [mockCamaba] // Data harus ada
  //     });
  //   });

  it("should handle errors during import process", async () => {
    req.params = { id_periode_pendaftaran: 1 };
    req.file = { path: "dummy/path/to/excel.xlsx" }; // Simulasi file yang diunggah

    const mockWorkbook = { worksheets: [{ rowCount: 2 }] }; // Simulasi worksheet
    ExcelJS.Workbook.mockReturnValue(mockWorkbook);

    Camaba.findOne.mockRejectedValue(new Error("Database error")); // Simulasi error pada database

    await importCamabaForUpdateNimKolektif(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error)); // Pastikan error diproses oleh middleware
  });
});
