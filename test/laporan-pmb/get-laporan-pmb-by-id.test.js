const httpMocks = require("node-mocks-http");
const { getLaporanPMBById } = require("../../src/modules/laporan-pmb/controller");
const { LaporanPMB } = require("../../models");

jest.mock("../../models");

describe("getLaporanPMBById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get laporan pmb by ID and return 200 if data is found", async () => {
    const mockLaporanPMB = {
      id: 1,
      jenis_laporan: "Laporan Rekap Pembayaran PMB",
      nama_penandatanganan: "Dr.Haya SHI, MPdI",
      nomor_identitas: "2109067402",
      id_jabatan: 1,
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    req.params.id = 1;
    LaporanPMB.findByPk.mockResolvedValue(mockLaporanPMB);

    await getLaporanPMBById(req, res, next);

    expect(LaporanPMB.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Laporan PMB By ID 1 Success:`,
      data: mockLaporanPMB
    });
  });

  it("should return 400 if ID is not provided", async () => {
    req.params.id = null;

    await getLaporanPMBById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Laporan PMB ID is required"
    });
  });

  it("should return 404 if laporan pmb is not found", async () => {
    req.params.id = 1;
    LaporanPMB.findByPk.mockResolvedValue(null);

    await getLaporanPMBById(req, res, next);

    expect(LaporanPMB.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Laporan PMB With ID 1 Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    LaporanPMB.findByPk.mockRejectedValue(error);

    await getLaporanPMBById(req, res, next);
  });
});
