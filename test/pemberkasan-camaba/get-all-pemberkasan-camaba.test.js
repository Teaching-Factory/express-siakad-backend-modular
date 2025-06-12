const httpMocks = require("node-mocks-http");
const { getAllPemberkasanCamaba } = require("../../src/modules/pemberkasan-camaba/controller");
const { PemberkasanCamaba, BerkasPeriodePendaftaran, JenisBerkas, Camaba } = require("../../models");

jest.mock("../../models");

describe("getAllPemberkasanCamaba", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all pemberkasan_camabas with status 200", async () => {
    const mockPemberkasanCamabas = [
      {
        id: 1,
        file_berkas: "file1.pdf",
        BerkasPeriodePendaftaran: {
          id: 1,
          JenisBerkas: { id: 1, nama: "KTP" }
        },
        Camaba: { id: 1, nama: "Camaba 1" }
      },
      {
        id: 2,
        file_berkas: "file2.pdf",
        BerkasPeriodePendaftaran: {
          id: 2,
          JenisBerkas: { id: 2, nama: "KK" }
        },
        Camaba: { id: 2, nama: "Camaba 2" }
      }
    ];

    PemberkasanCamaba.findAll.mockResolvedValue(mockPemberkasanCamabas);

    await getAllPemberkasanCamaba(req, res, next);

    expect(PemberkasanCamaba.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: BerkasPeriodePendaftaran,
          include: [{ model: JenisBerkas, as: "JenisBerkas" }]
        },
        { model: Camaba }
      ]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Pemberkasan Camaba Success",
      jumlahData: mockPemberkasanCamabas.length,
      data: mockPemberkasanCamabas
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PemberkasanCamaba.findAll.mockRejectedValue(error);

    await getAllPemberkasanCamaba(req, res, next);

    expect(PemberkasanCamaba.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
