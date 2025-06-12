const httpMocks = require("node-mocks-http");
const { getAllTagihanCamaba } = require("../../src/modules/tagihan-camaba/controller");
const { TagihanCamaba, Semester, JenisTagihan } = require("../../models");

jest.mock("../../models");

describe("getAllTagihanCamaba", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 200 and all tagihan camaba data", async () => {
    const mockTagihanCamabas = [
      {
        id: 1,
        Semester: { nama: "Semester 1" },
        JenisTagihan: { nama: "Tagihan A" }
      },
      {
        id: 2,
        Semester: { nama: "Semester 2" },
        JenisTagihan: { nama: "Tagihan B" }
      }
    ];

    TagihanCamaba.findAll.mockResolvedValue(mockTagihanCamabas);

    await getAllTagihanCamaba(req, res, next);

    expect(TagihanCamaba.findAll).toHaveBeenCalledWith({
      include: [{ model: Semester }, { model: JenisTagihan }]
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Tagihan Camaba Success",
      jumlahData: mockTagihanCamabas.length,
      data: mockTagihanCamabas
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    TagihanCamaba.findAll.mockRejectedValue(error);

    await getAllTagihanCamaba(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
