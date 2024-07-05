const { getMahasiswaByProdiAndAngkatanId } = require("../../src/controllers/mahasiswa");
const { Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Prodi, Angkatan, Semester } = require("../../models");
const httpMocks = require("node-mocks-http");
const { Op } = require("sequelize");

jest.mock("../../models", () => ({
  Mahasiswa: {
    findAll: jest.fn(),
  },
  Angkatan: {
    findOne: jest.fn(),
  },
}));

describe("getMahasiswaByProdiAndAngkatanId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if Prodi ID is not provided", async () => {
    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
    expect(Angkatan.findOne).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 400 if Angkatan ID is not provided", async () => {
    req.params = { id_prodi: "123" };

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Angkatan ID is required",
    });
    expect(Angkatan.findOne).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 404 if Angkatan not found", async () => {
    const angkatanId = "123";
    Angkatan.findOne.mockResolvedValue(null);

    req.params = { id_prodi: "456", id_angkatan: angkatanId };

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: angkatanId },
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Angkatan dengan ID ${angkatanId} tidak ditemukan`,
    });
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 404 if no Mahasiswa found for the given Prodi ID and Angkatan ID", async () => {
    const prodiId = "456";
    const angkatanId = "123";
    const mockAngkatan = { id: angkatanId, tahun: "2020" };
    Angkatan.findOne.mockResolvedValue(mockAngkatan);
    Mahasiswa.findAll.mockResolvedValue([]);

    req.params = { id_prodi: prodiId, id_angkatan: angkatanId };

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: angkatanId },
    });
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_prodi: prodiId,
        nama_periode_masuk: { [Op.like]: "2020/%" },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Mahasiswa dengan Prodi ID ${prodiId} dan tahun angkatan 2020 tidak ditemukan`,
    });
  });

  it("should get Mahasiswa by Prodi ID and Angkatan ID successfully", async () => {
    const prodiId = "7d061c5d-829d-4c7d-ade2-52610155fab0";
    const angkatanId = "44";
    const mockAngkatan = { id: angkatanId, tahun: "2020" };
    const mockMahasiswa = [
      { id: 1, name: "Mahasiswa 1" },
      { id: 2, name: "Mahasiswa 2" },
    ];

    Angkatan.findOne.mockResolvedValue(mockAngkatan);
    Mahasiswa.findAll.mockResolvedValue(mockMahasiswa);

    req.params = { id_prodi: prodiId, id_angkatan: angkatanId };

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: angkatanId },
    });
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_prodi: prodiId,
        nama_periode_masuk: { [Op.like]: "2020/%" },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `GET Mahasiswa By Prodi ID ${prodiId} dan Angkatan ID ${angkatanId} Success`,
      jumlahData: mockMahasiswa.length,
      data: mockMahasiswa,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    Angkatan.findOne.mockRejectedValue(mockError);

    req.params = { id_prodi: "456", id_angkatan: "123" };

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
