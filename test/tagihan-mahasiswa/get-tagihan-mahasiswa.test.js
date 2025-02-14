const httpMocks = require("node-mocks-http");
const { getTagihanMahasiswaById } = require("../../src/controllers/tagihan-mahasiswa");
const { TagihanMahasiswa, Semester, Mahasiswa, JenisTagihan } = require("../../models");

jest.mock("../../models");

describe("getTagihanMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch tagihan mahasiswa by ID and return 200", async () => {
    const tagihanMahasiswaId = 1;
    const mockTagihanMahasiswa = {
      id: tagihanMahasiswaId,
      semesterId: 1,
      mahasiswaId: 1,
      nominal_tagihan: 500000,
      status_pembayaran: "Belum Lunas",
      Semester: { id: 1, nama: "Semester Genap 2023/2024" },
      Mahasiswa: { id: 1, nama: "John Doe", nim: "A12345678" },
    };

    req.params.id = tagihanMahasiswaId;
    TagihanMahasiswa.findByPk.mockResolvedValue(mockTagihanMahasiswa);

    await getTagihanMahasiswaById(req, res, next);

    expect(TagihanMahasiswa.findByPk).toHaveBeenCalledWith(tagihanMahasiswaId, {
      include: [{ model: Semester }, { model: Mahasiswa }, { model: JenisTagihan }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Tagihan Mahasiswa By ID ${tagihanMahasiswaId} Success:`,
      data: mockTagihanMahasiswa,
    });
  });

  it("should return 400 if tagihan mahasiswa ID is not provided", async () => {
    req.params.id = undefined;

    await getTagihanMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Tagihan Mahasiswa ID is required",
    });
    expect(TagihanMahasiswa.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if tagihan mahasiswa is not found", async () => {
    const tagihanMahasiswaId = 999;
    req.params.id = tagihanMahasiswaId;
    TagihanMahasiswa.findByPk.mockResolvedValue(null);

    await getTagihanMahasiswaById(req, res, next);

    expect(TagihanMahasiswa.findByPk).toHaveBeenCalledWith(tagihanMahasiswaId, {
      include: [{ model: Semester }, { model: Mahasiswa }, { model: JenisTagihan }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Tagihan Mahasiswa With ID ${tagihanMahasiswaId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const tagihanMahasiswaId = 1;
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = tagihanMahasiswaId;
    TagihanMahasiswa.findByPk.mockRejectedValue(error);

    await getTagihanMahasiswaById(req, res, next);

    expect(TagihanMahasiswa.findByPk).toHaveBeenCalledWith(tagihanMahasiswaId, {
      include: [{ model: Semester }, { model: Mahasiswa }, { model: JenisTagihan }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
