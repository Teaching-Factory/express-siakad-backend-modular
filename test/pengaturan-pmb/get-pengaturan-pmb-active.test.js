const httpMocks = require("node-mocks-http");
const { getPengaturanPMBActive } = require("../../src/controllers/pengaturan-pmb");
const { PengaturanPMB } = require("../../models");

jest.mock("../../models");

describe("getPengaturanPMBActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 200 and the active Pengaturan PMB if found", async () => {
    const mockPengaturanPMB = { id: 1, nama: "Pengaturan Active", status: true };

    // Mock findOne to return active Pengaturan PMB
    PengaturanPMB.findOne.mockResolvedValue(mockPengaturanPMB);

    await getPengaturanPMBActive(req, res, next);

    expect(PengaturanPMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Pengaturan PMB Active Success",
      data: mockPengaturanPMB
    });
  });

  it("should return 200 and null if no active Pengaturan PMB is found", async () => {
    // Mock findOne to return null (no active Pengaturan PMB found)
    PengaturanPMB.findOne.mockResolvedValue(null);

    await getPengaturanPMBActive(req, res, next);

    expect(PengaturanPMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Pengaturan PMB Active Success",
      data: null
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    // Mock findOne to throw an error
    PengaturanPMB.findOne.mockRejectedValue(error);

    await getPengaturanPMBActive(req, res, next);

    expect(PengaturanPMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
