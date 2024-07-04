const { getMahasiswaByProdiId } = require("../../src/controllers/mahasiswa");
const { Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Prodi, Semester } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  Mahasiswa: {
    findAll: jest.fn(),
  },
}));

describe("getMahasiswaByProdiId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if Prodi ID is not provided", async () => {
    await getMahasiswaByProdiId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should get mahasiswa by Prodi ID successfully", async () => {
    const prodiId = "7ea94a65-efc0-44ff-a0cb-00421a1e56bf";
    const mockMahasiswa = [
      { id: 1, name: "Mahasiswa 1" },
      { id: 2, name: "Mahasiswa 2" },
    ];

    Mahasiswa.findAll.mockResolvedValue(mockMahasiswa);

    req.params = { id_prodi: prodiId };

    await getMahasiswaByProdiId(req, res, next);

    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
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

    Mahasiswa.findAll.mockResolvedValue([]);

    req.params = { id_prodi: prodiId };

    await getMahasiswaByProdiId(req, res, next);

    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Mahasiswa With Prodi ID ${prodiId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    Mahasiswa.findAll.mockRejectedValue(mockError);

    req.params = { id_prodi: "7ea94a65-efc0-44ff-a0cb-00421a1e56bf" };

    await getMahasiswaByProdiId(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
