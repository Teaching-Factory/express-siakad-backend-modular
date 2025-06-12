const httpMocks = require("node-mocks-http");
const { deleteUjiMahasiswaById } = require("../../src/modules/uji-mahasiswa/controller");
const { UjiMahasiswa } = require("../../models");

jest.mock("../../models");

describe("deleteUjiMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete uji mahasiswa by ID and return 200", async () => {
    const ujiMahasiswaId = 1;
    const mockUjiMahasiswaData = {
      id: ujiMahasiswaId,
      penguji_ke: "Penguji A",
      id_aktivitas: 1,
      id_kategori_kegiatan: 1,
      id_dosen: 1,
    };

    req.params.id = ujiMahasiswaId;
    UjiMahasiswa.findByPk.mockResolvedValue(mockUjiMahasiswaData);
    mockUjiMahasiswaData.destroy = jest.fn().mockResolvedValue(true);

    await deleteUjiMahasiswaById(req, res, next);

    expect(UjiMahasiswa.findByPk).toHaveBeenCalledWith(ujiMahasiswaId);
    expect(mockUjiMahasiswaData.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Uji Mahasiswa With ID ${ujiMahasiswaId} Success:`,
    });
  });

  it("should return 400 if uji mahasiswa ID is not provided", async () => {
    req.params.id = undefined;

    await deleteUjiMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Uji Mahasiswa ID is required",
    });
    expect(UjiMahasiswa.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if uji mahasiswa is not found", async () => {
    const ujiMahasiswaId = 999; // ID yang tidak ada dalam database
    req.params.id = ujiMahasiswaId;

    UjiMahasiswa.findByPk.mockResolvedValue(null);

    await deleteUjiMahasiswaById(req, res, next);

    expect(UjiMahasiswa.findByPk).toHaveBeenCalledWith(ujiMahasiswaId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Uji Mahasiswa With ID ${ujiMahasiswaId} Not Found:`,
    });
    expect(res._isEndCalled()).toBeTruthy(); // Memastikan respons telah selesai
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const ujiMahasiswaId = 1;
    req.params.id = ujiMahasiswaId;

    UjiMahasiswa.findByPk.mockRejectedValue(error);

    await deleteUjiMahasiswaById(req, res, next);

    expect(UjiMahasiswa.findByPk).toHaveBeenCalledWith(ujiMahasiswaId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
