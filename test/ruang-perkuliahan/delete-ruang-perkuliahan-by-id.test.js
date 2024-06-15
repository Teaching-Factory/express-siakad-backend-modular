const httpMocks = require("node-mocks-http");
const { deleteRuangPerkuliahanById } = require("../../src/controllers/ruang-perkuliahan");
const { RuangPerkuliahan } = require("../../models");

jest.mock("../../models");

describe("deleteRuangPerkuliahanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete ruang perkuliahan by ID and return 200", async () => {
    const mockRuangPerkuliahanId = 1;
    const mockRuangPerkuliahan = {
      id: mockRuangPerkuliahanId,
      destroy: jest.fn().mockResolvedValue(true),
    };

    req.params.id = mockRuangPerkuliahanId;

    RuangPerkuliahan.findByPk.mockResolvedValue(mockRuangPerkuliahan);

    await deleteRuangPerkuliahanById(req, res, next);

    expect(RuangPerkuliahan.findByPk).toHaveBeenCalledWith(mockRuangPerkuliahanId);
    expect(mockRuangPerkuliahan.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Ruang Perkuliahan With ID ${mockRuangPerkuliahanId} Success:`,
    });
  });

  it("should return 400 if ruang perkuliahan ID is missing", async () => {
    req.params.id = undefined;

    await deleteRuangPerkuliahanById(req, res, next);

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

    await deleteRuangPerkuliahanById(req, res, next);

    expect(RuangPerkuliahan.findByPk).toHaveBeenCalledWith(mockRuangPerkuliahanId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Ruang Perkuliahan With ID ${mockRuangPerkuliahanId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockRuangPerkuliahanId = 1;
    req.params.id = mockRuangPerkuliahanId;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    RuangPerkuliahan.findByPk.mockRejectedValue(error);

    await deleteRuangPerkuliahanById(req, res, next);

    expect(RuangPerkuliahan.findByPk).toHaveBeenCalledWith(mockRuangPerkuliahanId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
