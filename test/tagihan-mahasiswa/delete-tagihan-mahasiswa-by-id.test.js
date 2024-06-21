const httpMocks = require("node-mocks-http");
const { deleteTagihanMahasiswaById } = require("../../src/controllers/tagihan-mahasiswa");
const { TagihanMahasiswa } = require("../../models");

jest.mock("../../models");

describe("deleteTagihanMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete tagihan mahasiswa by ID and return 200", async () => {
    const mockTagihanMahasiswaId = 1;

    req.params.id = mockTagihanMahasiswaId;

    const mockTagihanMahasiswa = {
      id: mockTagihanMahasiswaId,
      jumlah_tagihan: 500000,
      jenis_tagihan: "SPP",
      tanggal_tagihan: "2024-06-10",
      deadline_tagihan: "2024-07-10",
      status_tagihan: "Lunas",
      id_periode: 1,
      id_registrasi_mahasiswa: 1,
      destroy: jest.fn(),
    };

    TagihanMahasiswa.findByPk.mockResolvedValue(mockTagihanMahasiswa);

    await deleteTagihanMahasiswaById(req, res, next);

    expect(TagihanMahasiswa.findByPk).toHaveBeenCalledWith(mockTagihanMahasiswaId);
    expect(mockTagihanMahasiswa.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Tagihan Mahasiswa With ID ${mockTagihanMahasiswaId} Success:`,
    });
  });

  it("should return 400 if tagihan mahasiswa ID is missing", async () => {
    req.params.id = undefined;

    await deleteTagihanMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Tagihan Mahasiswa ID is required",
    });
    expect(TagihanMahasiswa.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if tagihan mahasiswa not found", async () => {
    const mockTagihanMahasiswaId = 999; // Non-existent ID

    req.params.id = mockTagihanMahasiswaId;

    TagihanMahasiswa.findByPk.mockResolvedValue(null);

    await deleteTagihanMahasiswaById(req, res, next);

    expect(TagihanMahasiswa.findByPk).toHaveBeenCalledWith(mockTagihanMahasiswaId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Tagihan Mahasiswa With ID ${mockTagihanMahasiswaId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockTagihanMahasiswaId = 1;

    req.params.id = mockTagihanMahasiswaId;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    TagihanMahasiswa.findByPk.mockRejectedValue(error);

    await deleteTagihanMahasiswaById(req, res, next);

    expect(TagihanMahasiswa.findByPk).toHaveBeenCalledWith(mockTagihanMahasiswaId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
