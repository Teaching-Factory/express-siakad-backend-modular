const httpMocks = require("node-mocks-http");
const { getAgamaById } = require("../../src/controllers/agama");
const { Agama } = require("../../models");

jest.mock("../../models");

describe("getAgamaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return agama with status 200 if found", async () => {
    const agamaId = 1;
    const mockAgama = { id: agamaId, nama: "Islam" };

    Agama.findByPk.mockResolvedValue(mockAgama);

    req.params.id = agamaId;

    await getAgamaById(req, res, next);

    expect(Agama.findByPk).toHaveBeenCalledWith(agamaId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Agama By ID ${agamaId} Success:`,
      data: mockAgama,
    });
  });

  it("should handle not found error", async () => {
    const agamaId = 1;

    Agama.findByPk.mockResolvedValue(null);

    req.params.id = agamaId;

    await getAgamaById(req, res, next);

    expect(Agama.findByPk).toHaveBeenCalledWith(agamaId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Agama With ID ${agamaId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const agamaId = 1;
    const errorMessage = "Database error";

    Agama.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = agamaId;

    await getAgamaById(req, res, next);

    expect(Agama.findByPk).toHaveBeenCalledWith(agamaId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
