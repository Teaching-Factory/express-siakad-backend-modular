const httpMocks = require("node-mocks-http");
const { getRuangPerkuliahanById } = require("../../src/modules/ruang-perkuliahan/controller");
const { RuangPerkuliahan } = require("../../models");

jest.mock("../../models");

describe("getRuangPerkuliahanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return ruang perkuliahan by ID and return 200", async () => {
    const mockRuangPerkuliahanId = 1;
    const mockRuangPerkuliahan = {
      id: mockRuangPerkuliahanId,
      nama: "Ruang 101",
      kapasitas: 30,
      fasilitas: "Proyektor, AC",
    };

    req.params.id = mockRuangPerkuliahanId;
    RuangPerkuliahan.findByPk.mockResolvedValue(mockRuangPerkuliahan);

    await getRuangPerkuliahanById(req, res, next);

    expect(RuangPerkuliahan.findByPk).toHaveBeenCalledWith(mockRuangPerkuliahanId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Ruang Perkuliahan By ID ${mockRuangPerkuliahanId} Success:`,
      data: mockRuangPerkuliahan,
    });
  });

  it("should return 400 if ruang perkuliahan ID is missing", async () => {
    req.params.id = undefined;

    await getRuangPerkuliahanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Ruang Perkuliahan ID is required",
    });
    expect(RuangPerkuliahan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if ruang perkuliahan not found", async () => {
    const mockRuangPerkuliahanId = 999; // Non-existent ID

    req.params.id = mockRuangPerkuliahanId;
    RuangPerkuliahan.findByPk.mockResolvedValue(null);

    await getRuangPerkuliahanById(req, res, next);

    expect(RuangPerkuliahan.findByPk).toHaveBeenCalledWith(mockRuangPerkuliahanId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Ruang Perkuliahan With ID ${mockRuangPerkuliahanId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const mockRuangPerkuliahanId = 1;
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = mockRuangPerkuliahanId;
    RuangPerkuliahan.findByPk.mockRejectedValue(error);

    await getRuangPerkuliahanById(req, res, next);

    expect(RuangPerkuliahan.findByPk).toHaveBeenCalledWith(mockRuangPerkuliahanId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
