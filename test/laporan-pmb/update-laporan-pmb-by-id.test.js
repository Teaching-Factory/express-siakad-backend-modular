const httpMocks = require("node-mocks-http");
const { updateLaporanPMB } = require("../../src/modules/laporan-pmb/controller");
const { LaporanPMB } = require("../../models");

jest.mock("../../models");

describe("updateLaporanPMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update laporan pmb and return 200 if successful", async () => {
    const mockLaporanPMB = {
      id: 1,
      jenis_laporan: "Laporan Rekap Pembayaran PMB",
      nama_penandatanganan: "Dr.Haya SHI, MPdI",
      nomor_identitas: "2109067402",
      id_jabatan: 1,
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z",
      save: jest.fn().mockResolvedValue() // Mock method save
    };

    req.params.id = 1;
    req.body = {
      jenis_laporan: "Laporan Rekap Pembayaran PMB",
      nama_penandatanganan: "Dr.Haya SHI, MPdI",
      nomor_identitas: "2109067402",
      id_jabatan: 1
    };

    LaporanPMB.findByPk.mockResolvedValue(mockLaporanPMB);

    await updateLaporanPMB(req, res, next);

    expect(LaporanPMB.findByPk).toHaveBeenCalledWith(1);
    expect(mockLaporanPMB.save).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Laporan PMB With ID 1 Success:`,
      data: {
        id: 1,
        jenis_laporan: "Laporan Rekap Pembayaran PMB",
        nama_penandatanganan: "Dr.Haya SHI, MPdI",
        nomor_identitas: "2109067402",
        id_jabatan: 1,
        createdAt: "2024-09-03T03:22:09.000Z",
        updatedAt: "2024-09-03T03:22:09.000Z"
      }
    });
  });

  it("should return 400 if laporan PMB ID is missing", async () => {
    req.params.id = null;
    req.body = {
      jenis_laporan: "Laporan Rekap Pembayaran PMB",
      nama_penandatanganan: "Dr.Haya SHI, MPdI",
      nomor_identitas: "2109067402",
      id_jabatan: 1
    };

    await updateLaporanPMB(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Laporan PMB ID is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if laporan PMB is not found", async () => {
    req.params.id = 1;
    req.body = {
      jenis_laporan: "Laporan Rekap Pembayaran PMB",
      nama_penandatanganan: "Dr.Haya SHI, MPdI",
      nomor_identitas: "2109067402",
      id_jabatan: 1
    };

    LaporanPMB.findByPk.mockResolvedValue(null);

    await updateLaporanPMB(req, res, next);

    expect(LaporanPMB.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Laporan PMB With ID 1 Not Found:`
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;
    req.body = {
      jenis_laporan: "Laporan Rekap Pembayaran PMB",
      nama_penandatanganan: "Dr.Haya SHI, MPdI",
      nomor_identitas: "2109067402",
      id_jabatan: 1
    };

    LaporanPMB.findByPk.mockRejectedValue(error);

    await updateLaporanPMB(req, res, next);

    expect(LaporanPMB.findByPk).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
