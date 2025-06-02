const httpMocks = require("node-mocks-http");
const { getPerguruanTinggiById } = require("../../src/modules/perguruan-tinggi/controller");
const { PerguruanTinggi } = require("../../models");

jest.mock("../../models");

describe("getPerguruanTinggiById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return perguruan_tinggi data by ID with status 200 if found", async () => {
    const mockPerguruanTinggi = { id: 1, nama: "Perguruan Tinggi 1" };
    const id = 1;

    PerguruanTinggi.findByPk.mockResolvedValue(mockPerguruanTinggi);
    req.params.id = id;

    await getPerguruanTinggiById(req, res, next);

    expect(PerguruanTinggi.findByPk).toHaveBeenCalledWith(id);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Perguruan Tinggi By ID ${id} Success:`,
      data: mockPerguruanTinggi,
    });
  });

  it("should return 404 if perguruan_tinggi data by ID is not found", async () => {
    const id = 999;

    PerguruanTinggi.findByPk.mockResolvedValue(null);
    req.params.id = id;

    await getPerguruanTinggiById(req, res, next);

    expect(PerguruanTinggi.findByPk).toHaveBeenCalledWith(id);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Perguruan Tinggi With ID ${id} Not Found:`,
    });
  });

  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    const id = 1;

    PerguruanTinggi.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = id;

    await getPerguruanTinggiById(req, res, next);

    expect(PerguruanTinggi.findByPk).toHaveBeenCalledWith(id);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
