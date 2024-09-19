const httpMocks = require("node-mocks-http");
const { getAllPengaturanPMB } = require("../../src/controllers/pengaturan-pmb");
const { PengaturanPMB } = require("../../models");

jest.mock("../../models");

describe("getAllPengaturanPMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 200 and all Pengaturan PMB", async () => {
    // Mock data
    const mockPengaturanPMB = [
      { id: 1, nama: "Pengaturan A", nilai: "100" },
      { id: 2, nama: "Pengaturan B", nilai: "200" }
    ];

    // Mock PengaturanPMB.findAll
    PengaturanPMB.findAll.mockResolvedValue(mockPengaturanPMB);

    await getAllPengaturanPMB(req, res, next);

    expect(PengaturanPMB.findAll).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Pengaturan PMB Success",
      jumlahData: mockPengaturanPMB.length,
      data: mockPengaturanPMB
    });
  });

  it("should handle empty result", async () => {
    // Mock empty result
    PengaturanPMB.findAll.mockResolvedValue([]);

    await getAllPengaturanPMB(req, res, next);

    expect(PengaturanPMB.findAll).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Pengaturan PMB Success",
      jumlahData: 0,
      data: []
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    // Mock error on PengaturanPMB.findAll
    PengaturanPMB.findAll.mockRejectedValue(error);

    await getAllPengaturanPMB(req, res, next);

    expect(PengaturanPMB.findAll).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
