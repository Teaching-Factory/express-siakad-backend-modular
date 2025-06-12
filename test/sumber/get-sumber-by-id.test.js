const httpMocks = require("node-mocks-http");
const { getSumberById } = require("../../src/modules/sumber/controller");
const { Sumber } = require("../../models");

jest.mock("../../models");

describe("getSumberById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if sumberId is not provided", async () => {
    req.params.id = null; // Simulasi tidak ada ID yang diberikan

    await getSumberById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Sumber ID is required"
    });
  });

  it("should return 404 if sumber not found", async () => {
    const mockSumberId = 1;
    req.params.id = mockSumberId;

    Sumber.findByPk.mockResolvedValue(null); // Simulasi data tidak ditemukan

    await getSumberById(req, res, next);

    expect(Sumber.findByPk).toHaveBeenCalledWith(mockSumberId);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Sumber With ID ${mockSumberId} Not Found:`
    });
  });

  it("should return sumber with status 200 if sumber found", async () => {
    const mockSumberId = 1;
    const mockSumber = { id: mockSumberId, nama: "Sumber Test" };

    req.params.id = mockSumberId;

    Sumber.findByPk.mockResolvedValue(mockSumber); // Simulasi data ditemukan

    await getSumberById(req, res, next);

    expect(Sumber.findByPk).toHaveBeenCalledWith(mockSumberId);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Sumber By ID ${mockSumberId} Success:`,
      data: mockSumber
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;

    Sumber.findByPk.mockRejectedValue(error); // Simulasi error

    await getSumberById(req, res, next);

    expect(Sumber.findByPk).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
