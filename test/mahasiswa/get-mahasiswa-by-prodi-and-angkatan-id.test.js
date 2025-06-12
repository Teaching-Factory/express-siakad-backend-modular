const { getMahasiswaByProdiAndAngkatanId } = require("../../src/modules/mahasiswa/controller");
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
  BiodataMahasiswa: jest.fn(),
  PerguruanTinggi: jest.fn(),
  Agama: jest.fn(),
  Semester: jest.fn(),
  Prodi: jest.fn(),
}));

// Mock function helper yang digunakan di controller
jest.mock("../../src/modules/mahasiswa-lulus-do/controller", () => ({
  fetchAllMahasiswaLulusDOIds: jest.fn(),
}));

const { fetchAllMahasiswaLulusDOIds } = require("../../src/modules/mahasiswa-lulus-do/controller");

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

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
    expect(Angkatan.findOne).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 400 if Angkatan ID is not provided", async () => {
    req.params = { id_prodi: "123" };

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Angkatan ID is required",
    });
    expect(Angkatan.findOne).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 404 if Angkatan not found", async () => {
    const angkatanId = "123";
    req.params = { id_prodi: "456", id_angkatan: angkatanId };
    Angkatan.findOne.mockResolvedValue(null);

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: angkatanId },
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `Angkatan dengan ID ${angkatanId} tidak ditemukan`,
    });
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 404 if no Mahasiswa found for the given Prodi ID and Angkatan ID", async () => {
    const prodiId = "456";
    const angkatanId = "123";
    const tahunAngkatan = "2020";
    const mockAngkatan = { id: angkatanId, tahun: tahunAngkatan };
    const mockLulusDoIds = ["mhs1", "mhs2"];

    req.params = { id_prodi: prodiId, id_angkatan: angkatanId };

    Angkatan.findOne.mockResolvedValue(mockAngkatan);
    fetchAllMahasiswaLulusDOIds.mockResolvedValue(mockLulusDoIds);
    Mahasiswa.findAll.mockResolvedValue([]);

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({ where: { id: angkatanId } });
    expect(fetchAllMahasiswaLulusDOIds).toHaveBeenCalled();
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_prodi: prodiId,
        nama_periode_masuk: { [Op.like]: `${tahunAngkatan}/%` },
        id_registrasi_mahasiswa: { [Op.notIn]: mockLulusDoIds },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `Mahasiswa dengan Prodi ID ${prodiId} dan tahun angkatan ${tahunAngkatan} tidak ditemukan`,
    });
  });

  it("should return 200 and data if Mahasiswa found", async () => {
    const prodiId = "789";
    const angkatanId = "321";
    const tahunAngkatan = "2019";
    const mockAngkatan = { id: angkatanId, tahun: tahunAngkatan };
    const mockLulusDoIds = ["mhs1"];
    const mockMahasiswa = [
      { id: "mhs2", name: "Mahasiswa 1" },
      { id: "mhs3", name: "Mahasiswa 2" },
    ];

    req.params = { id_prodi: prodiId, id_angkatan: angkatanId };

    Angkatan.findOne.mockResolvedValue(mockAngkatan);
    fetchAllMahasiswaLulusDOIds.mockResolvedValue(mockLulusDoIds);
    Mahasiswa.findAll.mockResolvedValue(mockMahasiswa);

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `GET Mahasiswa By Prodi ID ${prodiId} dan Angkatan ID ${angkatanId} Success`,
      jumlahData: mockMahasiswa.length,
      data: mockMahasiswa,
    });
  });

  it("should handle internal server errors and call next with error", async () => {
    const mockError = new Error("Database error");
    req.params = { id_prodi: "999", id_angkatan: "888" };

    Angkatan.findOne.mockRejectedValue(mockError);

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
