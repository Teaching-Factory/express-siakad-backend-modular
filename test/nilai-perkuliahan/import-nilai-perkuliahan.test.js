const httpMocks = require("node-mocks-http");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { importNilaiPerkuliahan } = require("../../src/controllers/nilai-perkuliahan");
const { Mahasiswa, KelasKuliah, Prodi, JenjangPendidikan, DetailNilaiPerkuliahanKelas } = require("../../models");

jest.mock("../../models");

describe("importNilaiPerkuliahan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      params: { id_kelas_kuliah: "1" },
      file: {
        mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        path: path.join(__dirname, "test.xlsx"),
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();

    // Generate a sample Excel file
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    worksheet.addRow(["MIN", "MAX", "INDEKS", "HURUF"]);
    worksheet.addRow([1, 45, 0, "E"]);
    worksheet.addRow([46, 54, 1, "D"]);
    worksheet.addRow([55, 70, 2, "C"]);
    worksheet.addRow([71, 85, 3, "B"]);
    worksheet.addRow([86, 100, 4, "A"]);
    worksheet.addRow([]);
    worksheet.addRow(["", "", "", "", "", "NIM", "", "PRESENSI", "TUGAS", "UAS", "UTS"]);
    worksheet.addRow(["", "", "", "", "", "123456", "", 80, 80, 80, 80]);

    return workbook.xlsx.writeFile(req.file.path);
  });

  afterEach(() => {
    // Cleanup the test file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  });

  it("should return 400 if kelasKuliahId is not provided", async () => {
    req.params.id_kelas_kuliah = undefined;

    await importNilaiPerkuliahan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Kelas Kuliah ID is required" });
  });

  it("should return 400 if file type is not supported", async () => {
    req.file.mimetype = "application/pdf";

    await importNilaiPerkuliahan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "File type not supported" });
  });
});
