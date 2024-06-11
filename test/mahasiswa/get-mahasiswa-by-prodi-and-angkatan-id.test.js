const { getMahasiswaByProdiAndAngkatanId } = require("../../src/controllers/mahasiswa");
const { Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Periode, Prodi, Angkatan } = require("../../models");
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
}));

describe("getMahasiswaByProdiAndAngkatanId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if Prodi ID is not provided", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

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

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Angkatan ID is required",
    });
    expect(Angkatan.findOne).not.toHaveBeenCalled();
    expect(Periode.findAll).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 400 if Prodi ID and Angkatan ID are not provided", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
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

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

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

  it("should return 404 if no Mahasiswa found for the given Prodi ID and Angkatan ID", async () => {
    const prodiId = "456";
    const angkatanId = "123";
    const mockAngkatan = { id: angkatanId, tahun: "2020" };
    Angkatan.findOne.mockResolvedValue(mockAngkatan);
    Periode.findAll.mockResolvedValue([{ id_periode: "789" }]);
    Mahasiswa.findAll.mockResolvedValue([]);

    const req = httpMocks.createRequest({
      params: { id_prodi: prodiId, id_angkatan: angkatanId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: angkatanId },
    });
    expect(Periode.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      attributes: ["id_periode"],
    });
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_periode: { [Op.in]: ["789"] },
        nama_periode_masuk: { [Op.like]: "2020/%" },
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Periode, include: [{ model: Prodi }] }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Mahasiswa dengan Prodi ID ${prodiId} dan tahun angkatan 2020 tidak ditemukan`,
    });
  });

  it("should get Mahasiswa by Prodi ID and Angkatan ID successfully", async () => {
    const prodiId = "7d061c5d-829d-4c7d-ade2-52610155fab0";
    const angkatanId = 44;
    const mockAngkatan = { id: angkatanId, tahun: "2020" };
    const mockMahasiswa = [
      { id: 1, name: "Mahasiswa 1" },
      { id: 2, name: "Mahasiswa 2" },
    ];

    Angkatan.findOne.mockResolvedValue(mockAngkatan);
    Periode.findAll.mockResolvedValue([{ id_periode: "789" }]);
    Mahasiswa.findAll.mockResolvedValue(mockMahasiswa);

    const req = httpMocks.createRequest({
      params: { id_prodi: prodiId, id_angkatan: angkatanId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: angkatanId },
    });
    expect(Periode.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      attributes: ["id_periode"],
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
      jumlahData: mockMahasiswa.length,
      data: mockMahasiswa,
    });
  });

  it("should return 404 if Prodi ID and Angkatan ID are invalid", async () => {
    // Mock Angkatan.findOne to return null
    Angkatan.findOne.mockResolvedValue(null);

    // Create request with invalid Prodi ID and Angkatan ID
    const req = httpMocks.createRequest({
      params: { id_prodi: "7ea94a65b-00421a1e56bf", id_angkatan: "151" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Call the controller function
    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    // Assert that Angkatan.findOne is called with the correct parameters
    expect(Angkatan.findOne).toHaveBeenCalledWith({
      where: { id: "151" },
    });
    // Assert that the response status code is 404
    expect(res.statusCode).toEqual(404);
    // Assert that the response message is correct
    expect(res._getJSONData()).toEqual({
      message: "Angkatan dengan ID 151 tidak ditemukan",
    });
    // Assert that Periode.findAll and Mahasiswa.findAll are not called
    expect(Periode.findAll).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    Angkatan.findOne.mockRejectedValue(mockError);

    const req = httpMocks.createRequest({
      params: { id_prodi: "456", id_angkatan: "123" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByProdiAndAngkatanId(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
