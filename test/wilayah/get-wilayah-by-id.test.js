const httpMocks = require("node-mocks-http");
const { getWilayahById } = require("../../src/controllers/wilayah");
const { Wilayah, Negara } = require("../../models");

jest.mock("../../models");

describe("getWilayahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return wilayah data with status 200 if found", async () => {
    const wilayahId = 1;
    const mockWilayah = {
      id: wilayahId,
      nama: "Wilayah 1",
      Negara: { nama: "Negara 1" },
    };

    Wilayah.findByPk.mockResolvedValue(mockWilayah);

    req.params.id = wilayahId;

    await getWilayahById(req, res, next);

    expect(Wilayah.findByPk).toHaveBeenCalledWith(wilayahId, {
      include: [{ model: Negara }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Wilayah By ID ${wilayahId} Success:`,
      data: mockWilayah,
    });
  });

  it("should return 404 if wilayah is not found", async () => {
    const wilayahId = 999; // ID yang tidak ada
    const errorMessage = `<===== Wilayah With ID ${wilayahId} Not Found:`;

    Wilayah.findByPk.mockResolvedValue(null);

    req.params.id = wilayahId;

    await getWilayahById(req, res, next);

    expect(Wilayah.findByPk).toHaveBeenCalledWith(wilayahId, {
      include: [{ model: Negara }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: errorMessage });
  });

  it("should call next with error if database query fails", async () => {
    const wilayahId = 1;
    const errorMessage = "Database error";

    Wilayah.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = wilayahId;

    await getWilayahById(req, res, next);

    expect(Wilayah.findByPk).toHaveBeenCalledWith(wilayahId, {
      include: [{ model: Negara }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
