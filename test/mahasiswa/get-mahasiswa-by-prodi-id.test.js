const { getMahasiswaByProdiId } = require("../../src/controllers/mahasiswa");
const { Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Periode, Prodi } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  Mahasiswa: {
    findAll: jest.fn(),
  },
  Periode: {
    findAll: jest.fn(),
  },
}));

describe("getMahasiswaByProdiId", () => {
  it("should return 400 if Prodi ID is not provided", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByProdiId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
    expect(Periode.findAll).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should get mahasiswa by Prodi ID successfully", async () => {
    const prodiId = "7ea94a65-efc0-44ff-a0cb-00421a1e56bf";
    const mockPeriodeIds = [{ id_periode: 1 }, { id_periode: 2 }];
    const mockMahasiswa = [
      { id: 1, name: "Mahasiswa 1" },
      { id: 2, name: "Mahasiswa 2" },
    ];

    Periode.findAll.mockResolvedValue(mockPeriodeIds);
    Mahasiswa.findAll.mockResolvedValue(mockMahasiswa);

    const req = httpMocks.createRequest({
      params: { id_prodi: prodiId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByProdiId(req, res, next);

    expect(Periode.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      attributes: ["id_periode"],
    });
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_periode: [1, 2] },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Periode, include: [{ model: Prodi }] }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Mahasiswa By Prodi ID ${prodiId} Success:`,
      jumlahData: mockMahasiswa.length,
      data: mockMahasiswa,
    });
  });

  it("should return 404 if no mahasiswa found for the given Prodi ID", async () => {
    const prodiId = "7ea94a65-efc0-44ff-a0cb-00421a1e56bf";
    const mockPeriodeIds = [{ id_periode: 1 }, { id_periode: 2 }];

    Periode.findAll.mockResolvedValue(mockPeriodeIds);
    Mahasiswa.findAll.mockResolvedValue([]);

    const req = httpMocks.createRequest({
      params: { id_prodi: prodiId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByProdiId(req, res, next);

    expect(Periode.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      attributes: ["id_periode"],
    });
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_periode: [1, 2] },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Periode, include: [{ model: Prodi }] }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Mahasiswa With Prodi ID ${prodiId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    Periode.findAll.mockRejectedValue(mockError);

    const req = httpMocks.createRequest({
      params: { id_prodi: "7ea94a65-efc0-44ff-a0cb-00421a1e56bf" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByProdiId(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
