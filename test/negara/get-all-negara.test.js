const httpMocks = require("node-mocks-http");
const { getAllNegaras } = require("../../src/modules/negara/controller");
const { Negara } = require("../../models");

jest.mock("../../models");

describe("getAllNegaras", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all negaras with status 200", async () => {
    const mockNegaras = [
      { id: 1, nama: "Indonesia" },
      { id: 2, nama: "Malaysia" },
    ];

    Negara.findAll.mockResolvedValue(mockNegaras);

    await getAllNegaras(req, res, next);

    expect(Negara.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Negara Success",
      jumlahData: mockNegaras.length,
      data: mockNegaras,
    });
  });

  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    Negara.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllNegaras(req, res, next);

    expect(Negara.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
