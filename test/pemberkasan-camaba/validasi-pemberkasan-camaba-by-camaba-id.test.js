const httpMocks = require("node-mocks-http");
const { validasiPemberkasanCamabaByCamabaId } = require("../../src/modules/pemberkasan-camaba/controller");
const { Camaba, PemberkasanCamaba } = require("../../models");

jest.mock("../../models");

describe("validasiPemberkasanCamabaByCamabaId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if camabaId is not provided", async () => {
    req.params = {};
    req.body = {
      pemberkasan_camabas: [],
    };

    await validasiPemberkasanCamabaByCamabaId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Camaba ID is required",
    });
  });

  it("should return 404 if camaba is not found", async () => {
    req.params = { id_camaba: 1 };
    req.body = {
      pemberkasan_camabas: [],
    };

    Camaba.findByPk.mockResolvedValue(null);

    await validasiPemberkasanCamabaByCamabaId(req, res, next);

    expect(Camaba.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Camaba not found",
    });
  });

  it("should return 404 if pemberkasan camaba not found", async () => {
    req.params = { id_camaba: 1 };
    req.body = {
      pemberkasan_camabas: [{ id: 1, status_berkas: "approved" }],
    };

    const mockCamaba = { id: 1 };
    Camaba.findByPk.mockResolvedValue(mockCamaba);
    PemberkasanCamaba.findOne.mockResolvedValue(null);

    await validasiPemberkasanCamabaByCamabaId(req, res, next);

    expect(PemberkasanCamaba.findOne).toHaveBeenCalledWith({
      where: {
        id: 1,
        id_camaba: 1,
      },
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Pemberkasan camaba dengan ID 1 tidak ditemukan",
    });
  });

  it("should update pemberkasan camaba status and return success message", async () => {
    req.params = { id_camaba: 1 };
    req.body = {
      pemberkasan_camabas: [{ id: 1, status_berkas: "approved" }],
    };

    const mockCamaba = { id: 1 };
    const mockPemberkasanCamaba = { id: 1, status_berkas: "pending", save: jest.fn() };

    Camaba.findByPk.mockResolvedValue(mockCamaba);
    PemberkasanCamaba.findOne.mockResolvedValue(mockPemberkasanCamaba);

    await validasiPemberkasanCamabaByCamabaId(req, res, next);

    expect(mockPemberkasanCamaba.status_berkas).toEqual("approved");
    expect(mockPemberkasanCamaba.save).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== VALIDASI Pemberkasan Camaba By Camaba ID 1 Success:`,
      data: req.body.pemberkasan_camabas,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params = { id_camaba: 1 };
    req.body = { pemberkasan_camabas: [{ id: 1, status_berkas: "approved" }] };

    Camaba.findByPk.mockRejectedValue(error);

    await validasiPemberkasanCamabaByCamabaId(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
