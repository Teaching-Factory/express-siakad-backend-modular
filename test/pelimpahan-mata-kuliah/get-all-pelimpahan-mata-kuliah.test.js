const httpMocks = require("node-mocks-http");
const { getAllPelimpahanMataKuliah } = require("../../src/controllers/pelimpahan-mata-kuliah");
const { PelimpahanMataKuliah, Dosen, MataKuliah } = require("../../models");

jest.mock("../../models");

describe("getAllPelimpahanMataKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all pelimpahan mata kuliahs and return 200", async () => {
    const mockPelimpahanMataKuliahs = [
      {
        id: 1,
        Dosen: { id: 1, nama: "Dosen A" },
        MataKuliah: { id: 1, nama: "Mata Kuliah A" },
      },
      {
        id: 2,
        Dosen: { id: 2, nama: "Dosen B" },
        MataKuliah: { id: 2, nama: "Mata Kuliah B" },
      },
    ];

    PelimpahanMataKuliah.findAll.mockResolvedValue(mockPelimpahanMataKuliahs);

    await getAllPelimpahanMataKuliah(req, res, next);

    expect(PelimpahanMataKuliah.findAll).toHaveBeenCalledWith({
      include: [{ model: Dosen }, { model: MataKuliah }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Pelimpahan Mata Kuliah Success",
      jumlahData: mockPelimpahanMataKuliahs.length,
      data: mockPelimpahanMataKuliahs,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PelimpahanMataKuliah.findAll.mockRejectedValue(error);

    await getAllPelimpahanMataKuliah(req, res, next);

    expect(PelimpahanMataKuliah.findAll).toHaveBeenCalledWith({
      include: [{ model: Dosen }, { model: MataKuliah }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
