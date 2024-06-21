const httpMocks = require("node-mocks-http");
const { getBeritaById } = require("../../src/controllers/berita");
const { Berita } = require("../../models");

jest.mock("../../models");

describe("getBeritaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return berita by ID and status 200", async () => {
    const mockBeritaId = 1;
    const mockBerita = { id: mockBeritaId, title: "Berita 1", content: "Content 1" };

    req.params.id = mockBeritaId;
    Berita.findByPk.mockResolvedValue(mockBerita);

    await getBeritaById(req, res, next);

    expect(Berita.findByPk).toHaveBeenCalledWith(mockBeritaId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Berita By ID ${mockBeritaId} Success:`,
      data: mockBerita,
    });
  });

  it("should return 400 if berita ID is missing", async () => {
    req.params.id = undefined;

    await getBeritaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Berita ID is required",
    });
    expect(Berita.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if berita not found", async () => {
    const mockBeritaId = 999; // Non-existent ID

    req.params.id = mockBeritaId;
    Berita.findByPk.mockResolvedValue(null);

    await getBeritaById(req, res, next);

    expect(Berita.findByPk).toHaveBeenCalledWith(mockBeritaId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Berita With ID ${mockBeritaId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const mockBeritaId = 1;

    req.params.id = mockBeritaId;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Berita.findByPk.mockRejectedValue(error);

    await getBeritaById(req, res, next);

    expect(Berita.findByPk).toHaveBeenCalledWith(mockBeritaId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
