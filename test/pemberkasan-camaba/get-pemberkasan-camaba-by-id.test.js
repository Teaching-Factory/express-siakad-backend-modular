const httpMocks = require("node-mocks-http");
const { getPemberkasanCamabaById } = require("../../src/controllers/pemberkasan-camaba");
const { PemberkasanCamaba, BerkasPeriodePendaftaran, JenisBerkas, Camaba } = require("../../models");

jest.mock("../../models");

describe("getPemberkasanCamabaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return pemberkasan_camaba by ID with status 200", async () => {
    const mockPemberkasanCamaba = {
      id: 1,
      file_berkas: "file.pdf",
      BerkasPeriodePendaftaran: {
        id: 1,
        JenisBerkas: { id: 1, nama: "KTP" }
      },
      Camaba: { id: 1, nama: "Camaba 1" }
    };

    const pemberkasanCamabaId = "1";
    req.params.id = pemberkasanCamabaId;

    PemberkasanCamaba.findByPk.mockResolvedValue(mockPemberkasanCamaba);

    await getPemberkasanCamabaById(req, res, next);

    expect(PemberkasanCamaba.findByPk).toHaveBeenCalledWith(pemberkasanCamabaId, {
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
      message: `<===== GET Pemberkasan Camaba By ID ${pemberkasanCamabaId} Success:`,
      data: mockPemberkasanCamaba
    });
  });

  it("should return 400 if ID is not provided", async () => {
    req.params.id = undefined;

    await getPemberkasanCamabaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Pemberkasan Camaba ID is required"
    });
    expect(PemberkasanCamaba.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if pemberkasan_camaba is not found", async () => {
    const pemberkasanCamabaId = "1";
    req.params.id = pemberkasanCamabaId;

    PemberkasanCamaba.findByPk.mockResolvedValue(null);

    await getPemberkasanCamabaById(req, res, next);

    expect(PemberkasanCamaba.findByPk).toHaveBeenCalledWith(pemberkasanCamabaId, {
      include: [
        {
          model: BerkasPeriodePendaftaran,
          include: [{ model: JenisBerkas, as: "JenisBerkas" }]
        },
        { model: Camaba }
      ]
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Pemberkasan Camaba With ID ${pemberkasanCamabaId} Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PemberkasanCamaba.findByPk.mockRejectedValue(error);

    await getPemberkasanCamabaById(req, res, next);
  });
});
