const httpMocks = require("node-mocks-http");
const { getNegaraById } = require("../../src/modules/negara/controller");
const { Negara } = require("../../models");

jest.mock("../../models");

describe("getNegaraById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return negara with status 200 if found", async () => {
    const negaraId = 1;
    const mockNegara = { id: negaraId, nama: "Indonesia" };

    Negara.findByPk.mockResolvedValue(mockNegara);
    req.params.id = negaraId;

    await getNegaraById(req, res, next);

    expect(Negara.findByPk).toHaveBeenCalledWith(negaraId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Negara By ID ${negaraId} Success:`,
      data: mockNegara,
    });
  });

  it("should return 404 if negara not found", async () => {
    const negaraId = 1;
    Negara.findByPk.mockResolvedValue(null);
    req.params.id = negaraId;

    await getNegaraById(req, res, next);

    expect(Negara.findByPk).toHaveBeenCalledWith(negaraId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Negara With ID ${negaraId} Not Found:`,
    });
  });

  it("should call next with error if database query fails", async () => {
    const negaraId = 1;
    const errorMessage = "Database error";
    Negara.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = negaraId;

    await getNegaraById(req, res, next);

    expect(Negara.findByPk).toHaveBeenCalledWith(negaraId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
