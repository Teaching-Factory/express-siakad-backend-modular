const httpMocks = require("node-mocks-http");
const { getPelimpahanMataKuliahById } = require("../../src/controllers/pelimpahan-mata-kuliah");
const { PelimpahanMataKuliah, Dosen, MataKuliah } = require("../../models");

jest.mock("../../models");

describe("getPelimpahanMataKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return pelimpahan mata kuliah by ID and return 200", async () => {
    const mockPelimpahanMataKuliahId = 1;
    const mockPelimpahanMataKuliah = {
      id: mockPelimpahanMataKuliahId,
      Dosen: { id: 1, nama: "Dosen A" },
      MataKuliah: { id: 1, nama: "Mata Kuliah A" },
    };

    req.params.id = mockPelimpahanMataKuliahId;
    PelimpahanMataKuliah.findByPk.mockResolvedValue(mockPelimpahanMataKuliah);

    await getPelimpahanMataKuliahById(req, res, next);

    expect(PelimpahanMataKuliah.findByPk).toHaveBeenCalledWith(mockPelimpahanMataKuliahId, {
      include: [{ model: Dosen }, { model: MataKuliah }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Pelimpahan Mata Kuliah By ID ${mockPelimpahanMataKuliahId} Success:`,
      data: mockPelimpahanMataKuliah,
    });
  });

  it("should return 404 if pelimpahan mata kuliah not found", async () => {
    const mockPelimpahanMataKuliahId = 1;

    req.params.id = mockPelimpahanMataKuliahId;
    PelimpahanMataKuliah.findByPk.mockResolvedValue(null);

    await getPelimpahanMataKuliahById(req, res, next);

    expect(PelimpahanMataKuliah.findByPk).toHaveBeenCalledWith(mockPelimpahanMataKuliahId, {
      include: [{ model: Dosen }, { model: MataKuliah }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Pelimpahan Mata Kuliah With ID ${mockPelimpahanMataKuliahId} Not Found:`,
    });
  });

  it("should return 400 if pelimpahan mata kuliah ID is not provided", async () => {
    await getPelimpahanMataKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Pelimpahan Mata Kuliah ID is required",
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;
    PelimpahanMataKuliah.findByPk.mockRejectedValue(error);

    await getPelimpahanMataKuliahById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
