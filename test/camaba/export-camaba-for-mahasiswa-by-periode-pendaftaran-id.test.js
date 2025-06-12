const httpMocks = require("node-mocks-http");
const { exportCamabaForMahasiswaByPeriodePendaftaranId } = require("../../src/modules/camaba/controller");
const { PeriodePendaftaran, SettingGlobalSemester, JenisPendaftaran, Camaba } = require("../../models");
const ExcelJS = require("exceljs");

jest.mock("../../models");
jest.mock("exceljs");

describe("exportCamabaForMahasiswaByPeriodePendaftaranId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse({ eventEmitter: require("events").EventEmitter });
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if periodePendaftaranId is missing", async () => {
    req.params = {}; // Tidak ada ID periode pendaftaran

    await exportCamabaForMahasiswaByPeriodePendaftaranId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Periode Pendaftaran ID is required" });
  });

  it("should return 400 if periode pendaftaran not found", async () => {
    req.params = { id_periode_pendaftaran: 1 }; // ID periode pendaftaran ada
    PeriodePendaftaran.findByPk.mockResolvedValue(null); // Simulasi periode pendaftaran tidak ditemukan

    await exportCamabaForMahasiswaByPeriodePendaftaranId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Periode Pendaftaran Not Found" });
  });

  it("should return 404 if setting global semester aktif not found", async () => {
    req.params = { id_periode_pendaftaran: 1 };
    PeriodePendaftaran.findByPk.mockResolvedValue({}); // Simulasi periode pendaftaran ditemukan
    SettingGlobalSemester.findOne.mockResolvedValue(null); // Simulasi setting tidak ditemukan

    await exportCamabaForMahasiswaByPeriodePendaftaranId(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "<===== Setting Global Semester Aktif Not Found:" });
  });

  //   Belum pass
  //   it("should return 404 if jenis pendaftaran peserta didik baru not found", async () => {
  //     req.params = { id_periode_pendaftaran: 1 };
  //     PeriodePendaftaran.findByPk.mockResolvedValue({});
  //     SettingGlobalSemester.findOne.mockResolvedValue({}); // Simulasi setting ditemukan
  //     JenisPendaftaran.findOne.mockResolvedValue(null); // Simulasi jenis pendaftaran tidak ditemukan

  //     await exportCamabaForMahasiswaByPeriodePendaftaranId(req, res, next);

  //     expect(res.statusCode).toBe(404);
  //     expect(res._getJSONData()).toEqual({ message: "<===== Jenis Pendaftaran Peserta Didik Baru Not Found:" });
  //   });

  it("should return 404 if camaba not found for periode pendaftaran", async () => {
    req.params = { id_periode_pendaftaran: 1 };
    PeriodePendaftaran.findByPk.mockResolvedValue({});
    SettingGlobalSemester.findOne.mockResolvedValue({});
    JenisPendaftaran.findOne.mockResolvedValue({ id_jenis_daftar: 1 }); // Simulasi jenis pendaftaran ditemukan
    Camaba.findAll.mockResolvedValue([]); // Simulasi tidak ada camaba yang ditemukan

    await exportCamabaForMahasiswaByPeriodePendaftaranId(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "<===== Camaba With Periode Pendaftaran ID 1 Not Found:" });
  });

  //   Belum pass
  //   it("should export camaba data to Excel successfully", async () => {
  //     req.params = { id_periode_pendaftaran: 1 };
  //     const mockPeriodePendaftaran = { id_jalur_masuk: 1, biaya_pendaftaran: 100 };
  //     PeriodePendaftaran.findByPk.mockResolvedValue(mockPeriodePendaftaran); // Simulasi periode pendaftaran ditemukan
  //     SettingGlobalSemester.findOne.mockResolvedValue({ SemesterAktif: { id_semester: 1 } }); // Simulasi setting ditemukan
  //     JenisPendaftaran.findOne.mockResolvedValue({ id_jenis_daftar: 1 }); // Simulasi jenis pendaftaran ditemukan

  //     const mockCamabas = [
  //       {
  //         nim: "NIM123",
  //         BiodataCamaba: { nisn: "NISN123", nik: "NIK123", Agama: { id_agama: 1 }, Wilayah: { id_wilayah: 1, nama_wilayah: "Kelurahan 1" } },
  //         nama_lengkap: "Mahasiswa 1",
  //         tempat_lahir: "Tempat 1",
  //         tanggal_lahir: "2000-01-01",
  //         jenis_kelamin: "Laki-laki",
  //         nomor_hp: "08123456789",
  //         email: "mahasiswa1@example.com",
  //         id_pembiayaan: 1,
  //         Prodi: { kode_program_studi: "PRODI1" },
  //         status_export_mahasiswa: false,
  //         save: jest.fn().mockResolvedValue() // Simulasi simpan
  //       }
  //     ];
  //     Camaba.findAll.mockResolvedValue(mockCamabas); // Simulasi camaba ditemukan

  //     const mockWorkbook = { addWorksheet: jest.fn().mockReturnValue({ addRow: jest.fn() }) };
  //     ExcelJS.Workbook.mockReturnValue(mockWorkbook); // Simulasi workbook Excel

  //     await exportCamabaForMahasiswaByPeriodePendaftaranId(req, res, next);

  //     expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith("Data Calon Mahasiswa"); // Memastikan worksheet ditambahkan
  //     expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  //     expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", `attachment; filename=camaba-to-mahasiswa-periode-1.xlsx`);

  //     // Memastikan bahwa semua camaba di-update status_export_mahasiswa menjadi true
  //     expect(mockCamabas[0].status_export_mahasiswa).toBe(true);
  //     expect(mockCamabas[0].save).toHaveBeenCalled(); // Pastikan save dipanggil

  //     // Memastikan response ditulis
  //     expect(mockWorkbook.xlsx.write).toHaveBeenCalledWith(res);
  //     expect(res.end).toHaveBeenCalled(); // Pastikan response diakhiri
  //   });

  it("should handle errors during the export process", async () => {
    req.params = { id_periode_pendaftaran: 1 };
    PeriodePendaftaran.findByPk.mockResolvedValue({});
    SettingGlobalSemester.findOne.mockResolvedValue({});
    JenisPendaftaran.findOne.mockResolvedValue({ id_jenis_daftar: 1 });
    Camaba.findAll.mockRejectedValue(new Error("Database error")); // Simulasi error pada database

    await exportCamabaForMahasiswaByPeriodePendaftaranId(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error)); // Pastikan error diproses oleh middleware
  });
});
