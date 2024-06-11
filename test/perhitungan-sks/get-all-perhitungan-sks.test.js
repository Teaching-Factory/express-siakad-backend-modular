const { getAllPerhitunganSKS } = require("../../src/controllers/perhitungan-sks");
const { PerhitunganSKS } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  PerhitunganSKS: {
    findAll: jest.fn(),
  },
}));

describe("getAllPerhitunganSKS", () => {
  it("should return all perhitungan sks successfully", async () => {
    const mockPerhitunganSKS = [{ id: 1 }, { id: 2 }];

    PerhitunganSKS.findAll.mockResolvedValue(mockPerhitunganSKS);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await getAllPerhitunganSKS(req, res);

    expect(PerhitunganSKS.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Perhitungan SKS Success",
      jumlahData: mockPerhitunganSKS.length,
      data: mockPerhitunganSKS,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    PerhitunganSKS.findAll.mockRejectedValue(mockError);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    const next = jest.fn();

    await getAllPerhitunganSKS(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
