const httpMocks = require("node-mocks-http");
const { deleteSumberById } = require("../../src/modules/sumber/controller");
const { Sumber } = require("../../models");

jest.mock("../../models");

describe("deleteSumberById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete sumber and return 200 if successful", async () => {
    const mockSumber = { id: 1, destroy: jest.fn() };
    req.params.id = 1;

    Sumber.findByPk.mockResolvedValue(mockSumber); // Simulasi sumber ditemukan

    await deleteSumberById(req, res, next);

    expect(Sumber.findByPk).toHaveBeenCalledWith(1);
    expect(mockSumber.destroy).toHaveBeenCalled(); // Pastikan `destroy` dipanggil
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== DELETE Sumber With ID 1 Success:"
    });
  });

  it("should return 404 if sumber not found", async () => {
    req.params.id = 1;

    Sumber.findByPk.mockResolvedValue(null); // Simulasi sumber tidak ditemukan

    await deleteSumberById(req, res, next);

    expect(Sumber.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Sumber With ID 1 Not Found:"
    });
  });

  it("should return 400 if sumber ID is not provided", async () => {
    req.params.id = null;

    await deleteSumberById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Sumber ID is required"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.params.id = 1;

    Sumber.findByPk.mockRejectedValue(error);

    await deleteSumberById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
