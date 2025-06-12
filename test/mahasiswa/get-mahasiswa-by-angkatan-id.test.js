const { getMahasiswaByAngkatanId } = require("../../src/modules/mahasiswa/controller");
const { Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Periode, Prodi, Angkatan, Semester } = require("../../models");
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

describe("getMahasiswaByAngkatanId", () => {
  it("should return 400 if Angkatan ID is not provided", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByAngkatanId(req, res, next);

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

    const req = httpMocks.createRequest({
      params: { id_angkatan: angkatanId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: angkatanId },
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Angkatan dengan ID ${angkatanId} tidak ditemukan`,
    });
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 404 if no Mahasiswa found for the given Angkatan ID", async () => {
    const angkatanId = "123";
    const mockAngkatan = { id: angkatanId, tahun: "2020" };
    Angkatan.findOne.mockResolvedValue(mockAngkatan);
    Mahasiswa.findAll.mockResolvedValue([]);

    const req = httpMocks.createRequest({
      params: { id_angkatan: angkatanId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: angkatanId },
    });
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        nama_periode_masuk: {
          [Op.like]: `${mockAngkatan.tahun}/%`,
        },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Mahasiswa dengan tahun angkatan ${mockAngkatan.tahun} tidak ditemukan`,
    });
  });

  it("should get Mahasiswa by Angkatan ID successfully", async () => {
    const angkatanId = "123";
    const mockAngkatan = { id: angkatanId, tahun: "2020" };
    const mockMahasiswa = [
      { id: 1, name: "Mahasiswa 1" },
      { id: 2, name: "Mahasiswa 2" },
    ];

    Angkatan.findOne.mockResolvedValue(mockAngkatan);
    Mahasiswa.findAll.mockResolvedValue(mockMahasiswa);

    const req = httpMocks.createRequest({
      params: { id_angkatan: angkatanId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: angkatanId },
    });
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        nama_periode_masuk: {
          [Op.like]: `${mockAngkatan.tahun}/%`,
        },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `GET Mahasiswa By Angkatan ID ${angkatanId} Success`,
      jumlahData: mockMahasiswa.length,
      data: mockMahasiswa,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    Angkatan.findOne.mockRejectedValue(mockError);

    const req = httpMocks.createRequest({
      params: { id_angkatan: "123" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByAngkatanId(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
