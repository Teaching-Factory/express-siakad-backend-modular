const httpMocks = require("node-mocks-http");
const { getAllBerita } = require("../../src/controllers/berita");
const { Berita } = require("../../models");

jest.mock("../../models");

describe("getAllBerita", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all berita and status 200", async () => {
    const mockBeritas = [
      { id: 1, title: "Berita 1", content: "Content 1" },
      { id: 2, title: "Berita 2", content: "Content 2" },
    ];

    Berita.findAll.mockResolvedValue(mockBeritas);

    await getAllBerita(req, res, next);

    expect(Berita.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Berita Success",
      jumlahData: mockBeritas.length,
      data: mockBeritas,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Berita.findAll.mockRejectedValue(error);

    await getAllBerita(req, res, next);

    expect(Berita.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
