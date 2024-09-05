const httpMocks = require("node-mocks-http");
const { createLaporanPMB } = require("../../src/controllers/laporan-pmb");
const { LaporanPMB } = require("../../models");

jest.mock("../../models");

describe("createLaporanPMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a new laporan pmb and return 201 if successful", async () => {
    const mockLaporanPMB = {
      id: 1,
      jenis_laporan: "Laporan Rekap Pembayaran PMB",
      nama_penandatanganan: "Dr.Haya SHI, MPdI",
      nomor_identitas: "2109067402",
      id_jabatan: 1,
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    req.body = {
      jenis_laporan: "Laporan Rekap Pembayaran PMB",
      nama_penandatanganan: "Dr.Haya SHI, MPdI",
      nomor_identitas: "2109067402",
      id_jabatan: 1
    };

    LaporanPMB.create.mockResolvedValue(mockLaporanPMB);

    await createLaporanPMB(req, res, next);

    expect(LaporanPMB.create).toHaveBeenCalledWith({
      jenis_laporan: "Laporan Rekap Pembayaran PMB",
      nama_penandatanganan: "Dr.Haya SHI, MPdI",
      nomor_identitas: "2109067402",
      id_jabatan: 1
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Laporan PMB Success",
      data: mockLaporanPMB
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    LaporanPMB.create.mockRejectedValue(error);

    await createLaporanPMB(req, res, next);

    expect(LaporanPMB.create).toHaveBeenCalledWith({
      jenis_laporan: req.body.jenis_laporan,
      nama_penandatanganan: req.body.nama_penandatanganan,
      nomor_identitas: req.body.nomor_identitas,
      id_jabatan: req.body.id_jabatan
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
