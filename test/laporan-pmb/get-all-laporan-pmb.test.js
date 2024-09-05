const httpMocks = require("node-mocks-http");
const { getAllLaporanPMB } = require("../../src/controllers/laporan-pmb");
const { LaporanPMB } = require("../../models");

jest.mock("../../models");

describe("getAllLaporanPMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all laporan pmb and return 200 if data is found", async () => {
    const mockLaporanPMB = [
      {
        id: 1,
        jenis_laporan: "Laporan Rekap Pembayaran PMB",
        nama_penandatanganan: "Dr.Haya SHI, MPdI",
        nomor_identitas: "2109067402",
        id_jabatan: 1,
        createdAt: "2024-09-03T03:22:09.000Z",
        updatedAt: "2024-09-03T03:22:09.000Z"
      },
      {
        id: 2,
        jenis_laporan: "Laporan Rekap Laporan PMB",
        nama_penandatanganan: "Dr.Haya SHI, MPdI",
        nomor_identitas: "2109067402",
        id_jabatan: 1,
        createdAt: "2024-09-03T03:22:09.000Z",
        updatedAt: "2024-09-03T03:22:09.000Z"
      }
    ];

    LaporanPMB.findAll.mockResolvedValue(mockLaporanPMB);

    await getAllLaporanPMB(req, res, next);

    expect(LaporanPMB.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Laporan PMB Success",
      jumlahData: mockLaporanPMB.length,
      data: mockLaporanPMB
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    LaporanPMB.findAll.mockRejectedValue(error);

    await getAllLaporanPMB(req, res, next);

    expect(LaporanPMB.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
