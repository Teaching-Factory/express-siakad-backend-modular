const httpMocks = require("node-mocks-http");
const { updateStatusKelulusanPendaftar } = require("../../src/controllers/camaba");
const { Camaba } = require("../../models");

jest.mock("../../models");

describe("updateStatusKelulusanPendaftar", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if required fields are missing", async () => {
    req.body = {}; // Tidak ada data dalam body

    await updateStatusKelulusanPendaftar(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "status_berkas is required" });
  });

  it("should return 400 if camaba ID is missing", async () => {
    req.body = {
      status_berkas: "Complete",
      status_tes: "Passed",
      nim: "12345678",
      id_prodi_diterima: 1,
      id_pembiayaan: 1,
      finalisasi: true,
      status_akun_pendaftar: "Active"
    };

    req.params = {}; // Tidak ada camaba ID

    await updateStatusKelulusanPendaftar(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Camaba ID is required" });
  });

  it("should update camaba and return 200 if successful", async () => {
    req.body = {
      status_berkas: "Complete",
      status_tes: "Passed",
      nim: "12345678",
      id_prodi_diterima: 1,
      id_pembiayaan: 1,
      finalisasi: true,
      status_akun_pendaftar: "Active"
    };
    req.params = { id: 1 };

    const mockCamaba = {
      id: 1,
      status_berkas: "Incomplete",
      status_tes: "Failed",
      nim: "00000000",
      id_prodi_diterima: null,
      id_pembiayaan: null,
      finalisasi: false,
      status_akun_pendaftar: "Inactive",
      save: jest.fn().mockResolvedValue(true)
    };

    Camaba.findByPk.mockResolvedValue(mockCamaba);

    await updateStatusKelulusanPendaftar(req, res, next);

    expect(mockCamaba.status_berkas).toBe("Complete");
    expect(mockCamaba.status_tes).toBe("Passed");
    expect(mockCamaba.nim).toBe("12345678");
    expect(mockCamaba.id_prodi_diterima).toBe(1);
    expect(mockCamaba.id_pembiayaan).toBe(1);
    expect(mockCamaba.finalisasi).toBe(true);
    expect(mockCamaba.status_akun_pendaftar).toBe("Active");
    expect(mockCamaba.save).toHaveBeenCalled();

    // Salin mockCamaba tanpa properti 'save' untuk perbandingan dengan respons
    const { save, ...expectedCamabaData } = mockCamaba;

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Status Kelulusan Pendaftar By Camaba ID 1 Success:`,
      data: expectedCamabaData // Perbandingan dilakukan tanpa fungsi 'save'
    });
  });

  it("should handle errors", async () => {
    req.body = {
      status_berkas: "Complete",
      status_tes: "Passed",
      nim: "12345678",
      id_prodi_diterima: 1,
      id_pembiayaan: 1,
      finalisasi: true,
      status_akun_pendaftar: "Active"
    };
    req.params = { id: 1 };

    Camaba.findByPk.mockRejectedValue(new Error("Database error"));

    await updateStatusKelulusanPendaftar(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
