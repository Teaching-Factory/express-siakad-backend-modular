const { getMahasiswaDontHaveUserByProdiAndAngkatanId } = require("../../src/controllers/user");
const { Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Periode, Prodi, Angkatan, User } = require("../../models");
const httpMocks = require("node-mocks-http");
const { Op } = require("sequelize");

jest.mock("../../models", () => ({
  Mahasiswa: {
    findAll: jest.fn(),
  },
  Periode: {
    findAll: jest.fn(),
  },
  Angkatan: {
    findOne: jest.fn(),
  },
  User: {
    findAll: jest.fn(),
  },
}));

describe("getMahasiswaDontHaveUserByProdiAndAngkatanId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if Prodi ID is not provided", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaDontHaveUserByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
    expect(Angkatan.findOne).not.toHaveBeenCalled();
    expect(Periode.findAll).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 400 if Angkatan ID is not provided", async () => {
    const req = httpMocks.createRequest({
      params: { id_prodi: "123" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaDontHaveUserByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Angkatan ID is required",
    });
    expect(Angkatan.findOne).not.toHaveBeenCalled();
    expect(Periode.findAll).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 404 if Angkatan not found", async () => {
    const angkatanId = "123";
    Angkatan.findOne.mockResolvedValue(null);

    const req = httpMocks.createRequest({
      params: { id_prodi: "456", id_angkatan: angkatanId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaDontHaveUserByProdiAndAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: angkatanId },
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Angkatan dengan ID ${angkatanId} tidak ditemukan`,
    });
    expect(Periode.findAll).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should get Mahasiswa by Prodi ID and Angkatan ID successfully", async () => {
    const prodiId = "7d061c5d-829d-4c7d-ade2-52610155fab0";
    const angkatanId = 44;
    const mockAngkatan = { id: angkatanId, tahun: "2020" };
    const mockMahasiswa = [
      { id: 1, nim: "12345", name: "Mahasiswa 1" },
      { id: 2, nim: "67890", name: "Mahasiswa 2" },
    ];
    const mockUsers = [
      { username: "12345" }, // This user should cause one mahasiswa to be filtered out
    ];

    Angkatan.findOne.mockResolvedValue(mockAngkatan);
    Periode.findAll.mockResolvedValue([{ id_periode: "789" }]);
    Mahasiswa.findAll.mockResolvedValue(mockMahasiswa);
    User.findAll.mockResolvedValue(mockUsers);

    const req = httpMocks.createRequest({
      params: { id_prodi: prodiId, id_angkatan: angkatanId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaDontHaveUserByProdiAndAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: angkatanId },
    });
    expect(Periode.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      attributes: ["id_periode"],
    });
    expect(User.findAll).toHaveBeenCalledWith({
      attributes: ["username"],
    });
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_periode: { [Op.in]: ["789"] },
        nama_periode_masuk: { [Op.like]: "2020/%" },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Periode, include: [{ model: Prodi }] }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `GET Mahasiswa By Prodi ID ${prodiId} dan Angkatan ID ${angkatanId} Success`,
      jumlahData: 1, // Only one mahasiswa should remain after filtering
      data: [
        { id: 2, nim: "67890", name: "Mahasiswa 2" }, // This is the remaining mahasiswa
      ],
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    Angkatan.findOne.mockRejectedValue(mockError);

    const req = httpMocks.createRequest({
      params: { id_prodi: "456", id_angkatan: "123" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaDontHaveUserByProdiAndAngkatanId(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
