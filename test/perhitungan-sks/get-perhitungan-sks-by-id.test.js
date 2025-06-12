const { getPerhitunganSKSById } = require("../../src/modules/perhitungan-sks/controller");
const { PerhitunganSKS, KelasKuliah, PenugasanDosen, Substansi } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  PerhitunganSKS: {
    findByPk: jest.fn(),
  },
}));

describe("getPerhitunganSKSById", () => {
  it("should return perhitungan sks by ID successfully", async () => {
    const mockPerhitunganSKS = { id: 1 /* mock data */ };

    PerhitunganSKS.findByPk.mockResolvedValue(mockPerhitunganSKS);

    const req = httpMocks.createRequest({ params: { id: 1 } });
    const res = httpMocks.createResponse();

    await getPerhitunganSKSById(req, res);

    expect(PerhitunganSKS.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: KelasKuliah }, { model: PenugasanDosen }, { model: Substansi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Perhitungan SKS By ID 1 Success:`,
      data: mockPerhitunganSKS,
    });
  });

  it("should handle error if Perhitungan SKS ID is not provided", async () => {
    const req = httpMocks.createRequest({ params: {} });
    const res = httpMocks.createResponse();

    const next = jest.fn();

    await getPerhitunganSKSById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Perhitungan SKS ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if perhitungan sks is not found", async () => {
    PerhitunganSKS.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { id: 1 } });
    const res = httpMocks.createResponse();

    await getPerhitunganSKSById(req, res);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Perhitungan SKS With ID 1 Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    PerhitunganSKS.findByPk.mockRejectedValue(mockError);

    const req = httpMocks.createRequest({ params: { id: 1 } });
    const res = httpMocks.createResponse();

    const next = jest.fn();

    await getPerhitunganSKSById(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
