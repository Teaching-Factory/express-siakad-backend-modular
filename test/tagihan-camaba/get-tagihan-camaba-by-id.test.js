const httpMocks = require("node-mocks-http");
const { getTagihanCamabaById } = require("../../src/modules/tagihan-camaba/controller");
const { TagihanCamaba, Semester, JenisTagihan } = require("../../models");

jest.mock("../../models");

describe("getTagihanCamabaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if tagihanCamabaId is missing", async () => {
    req.params = {};

    await getTagihanCamabaById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Tagihan Camaba ID is required"
    });
  });

  it("should return 404 if tagihanCamaba not found", async () => {
    req.params = {
      id: 1
    };

    TagihanCamaba.findByPk.mockResolvedValue(null);

    await getTagihanCamabaById(req, res, next);

    expect(TagihanCamaba.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }, { model: JenisTagihan }]
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Tagihan Camaba With ID 1 Not Found:`
    });
  });

  it("should return 200 and the tagihan_camaba data if found", async () => {
    req.params = {
      id: 1
    };

    const mockTagihanCamaba = {
      id: 1,
      status_tagihan: "Lunas",
      Semester: { nama: "Semester 1" },
      JenisTagihan: { nama: "Tagihan A" }
    };

    TagihanCamaba.findByPk.mockResolvedValue(mockTagihanCamaba);

    await getTagihanCamabaById(req, res, next);

    expect(TagihanCamaba.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }, { model: JenisTagihan }]
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Tagihan Camaba By ID 1 Success:`,
      data: mockTagihanCamaba
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params = {
      id: 1
    };

    TagihanCamaba.findByPk.mockRejectedValue(error);

    await getTagihanCamabaById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
