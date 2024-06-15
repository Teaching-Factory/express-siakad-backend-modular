const { getAlatTransportasiById } = require("../../src/controllers/alat-transportasi");
const { AlatTransportasi } = require("../../models");

jest.mock("../../models");

describe("getAlatTransportasiById", () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return alat_transportasi data by ID with status code 200", async () => {
    const alatTransportasiId = 1;
    const mockAlatTransportasiData = {
      id: alatTransportasiId,
      name: "Alat Transportasi 1",
    };

    AlatTransportasi.findByPk.mockResolvedValue(mockAlatTransportasiData);

    req.params.id = alatTransportasiId;

    await getAlatTransportasiById(req, res, next);

    expect(AlatTransportasi.findByPk).toHaveBeenCalledWith(alatTransportasiId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== GET Alat Transportasi By ID ${alatTransportasiId} Success:`,
      data: mockAlatTransportasiData,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle alat_transportasi not found and return status code 404", async () => {
    const alatTransportasiId = 999;
    AlatTransportasi.findByPk.mockResolvedValue(null);

    req.params.id = alatTransportasiId;

    await getAlatTransportasiById(req, res, next);

    expect(AlatTransportasi.findByPk).toHaveBeenCalledWith(alatTransportasiId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== Alat Transportasi With ID ${alatTransportasiId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle error and pass it to next middleware", async () => {
    const alatTransportasiId = 1;
    const errorMessage = "Database error";
    AlatTransportasi.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = alatTransportasiId;

    await getAlatTransportasiById(req, res, next);

    expect(AlatTransportasi.findByPk).toHaveBeenCalledWith(alatTransportasiId);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
