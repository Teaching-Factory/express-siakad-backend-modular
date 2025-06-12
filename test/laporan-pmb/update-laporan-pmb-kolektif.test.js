const httpMocks = require("node-mocks-http");
const { updateLaporanPMBKolektif } = require("../../src/modules/laporan-pmb/controller");
const { LaporanPMB } = require("../../models");

jest.mock("../../models");

describe("updateLaporanPMBKolektif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update multiple laporan pmbs and return 200 if successful", async () => {
    const mockLaporanPMB1 = {
      id: 1,
      jenis_laporan: "Laporan Rekap Pembayaran PMB",
      nama_penandatanganan: "Dr.Haya SHI, MPdI",
      nomor_identitas: "2109067402",
      id_jabatan: 1,
      save: jest.fn().mockResolvedValue() // Mock method save
    };

    const mockLaporanPMB2 = {
      id: 2,
      jenis_laporan: "Laporan Rekap Laporan PMB",
      nama_penandatanganan: "Dr.Haya SHI, MPdI",
      nomor_identitas: "2109067402",
      id_jabatan: 1,
      save: jest.fn().mockResolvedValue() // Mock method save
    };

    req.body = {
      laporan_pmbs: [
        {
          id: 1,
          jenis_laporan: "Laporan Rekap Pembayaran PMB",
          nama_penandatanganan: "Dr.Haya SHI, MPdI",
          nomor_identitas: "2109067402",
          id_jabatan: 1
        },
        {
          id: 2,
          jenis_laporan: "Laporan Rekap Laporan PMB",
          nama_penandatanganan: "Dr.Haya SHI, MPdI",
          nomor_identitas: "2109067402",
          id_jabatan: 1
        }
      ]
    };

    LaporanPMB.findByPk
      .mockResolvedValueOnce(mockLaporanPMB1) // First call
      .mockResolvedValueOnce(mockLaporanPMB2); // Second call

    await updateLaporanPMBKolektif(req, res, next);

    expect(LaporanPMB.findByPk).toHaveBeenCalledTimes(2);
    expect(LaporanPMB.findByPk).toHaveBeenCalledWith(1);
    expect(LaporanPMB.findByPk).toHaveBeenCalledWith(2);
    expect(mockLaporanPMB1.save).toHaveBeenCalled();
    expect(mockLaporanPMB2.save).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "Update Laporan PMB Success",
      data: req.body.laporan_pmbs
    });
  });

  it("should return 400 if laporan_pmbs is not an array", async () => {
    req.body = {
      laporan_pmbs: "not an array"
    };

    await updateLaporanPMBKolektif(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "laporan_pmbs is required and must be an array with at least one item"
    });
  });

  it("should return 400 if laporan_pmbs array is empty", async () => {
    req.body = {
      laporan_pmbs: []
    };

    await updateLaporanPMBKolektif(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "laporan_pmbs is required and must be an array with at least one item"
    });
  });

  it("should return 400 if ID is not provided in laporan_pmb", async () => {
    req.body = {
      laporan_pmbs: [
        {
          jenis_laporan: "Laporan Rekap Pembayaran PMB"
        }
      ]
    };

    await updateLaporanPMBKolektif(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "ID is required for each laporan_pmb"
    });
  });

  it("should return 404 if laporan_pmb is not found", async () => {
    req.body = {
      laporan_pmbs: [
        {
          id: 1,
          jenis_laporan: "Laporan Rekap Pembayaran PMB"
        }
      ]
    };

    LaporanPMB.findByPk.mockResolvedValue(null);

    await updateLaporanPMBKolektif(req, res, next);

    expect(LaporanPMB.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Laporan PMB With ID 1 Not Found:"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    LaporanPMB.findByPk.mockRejectedValue(error);

    await updateLaporanPMBKolektif(req, res, next);
  });
});
