const httpMocks = require("node-mocks-http");
const { getPengaturanPMBId } = require("../../src/modules/pengaturan-pmb/controller");
const { PengaturanPMB } = require("../../models");

jest.mock("../../models");

describe("getPengaturanPMBId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if no ID is provided", async () => {
    req.params.id = null;

    await getPengaturanPMBId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Pengaturan PMB ID is required"
    });
  });

  it("should return 200 and the Pengaturan PMB if found", async () => {
    const mockPengaturanPMB = { id: 1, nama: "Pengaturan A", nilai: "100" };
    req.params.id = "1";

    // Mock findByPk to return the data
    PengaturanPMB.findByPk.mockResolvedValue(mockPengaturanPMB);

    await getPengaturanPMBId(req, res, next);

    expect(PengaturanPMB.findByPk).toHaveBeenCalledWith("1");
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Pengaturan PMB By ID 1 Success:`,
      data: mockPengaturanPMB
    });
  });

  it("should return 404 if Pengaturan PMB not found", async () => {
    req.params.id = "1";

    // Mock findByPk to return null
    PengaturanPMB.findByPk.mockResolvedValue(null);

    await getPengaturanPMBId(req, res, next);

    expect(PengaturanPMB.findByPk).toHaveBeenCalledWith("1");
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Pengaturan PMB With ID 1 Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id = "1";

    // Mock findByPk to throw an error
    PengaturanPMB.findByPk.mockRejectedValue(error);

    await getPengaturanPMBId(req, res, next);

    expect(PengaturanPMB.findByPk).toHaveBeenCalledWith("1");
    expect(next).toHaveBeenCalledWith(error);
  });
});
