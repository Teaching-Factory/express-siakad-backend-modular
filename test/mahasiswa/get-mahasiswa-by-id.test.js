const { getMahasiswaById } = require("../../src/controllers/mahasiswa");
const { Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Periode, Prodi, Semester } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  Mahasiswa: {
    findByPk: jest.fn(),
  },
}));

describe("getMahasiswaById", () => {
  it("should return 400 if Mahasiswa ID is not provided", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Mahasiswa ID is required",
    });
    expect(Mahasiswa.findByPk).not.toHaveBeenCalled();
  });

  it("should get mahasiswa by ID successfully", async () => {
    const MahasiswaId = 1;
    const mockMahasiswa = { id: MahasiswaId /* mock data */ };

    Mahasiswa.findByPk.mockResolvedValue(mockMahasiswa);

    const req = httpMocks.createRequest({
      params: { id: MahasiswaId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaById(req, res, next);

    expect(Mahasiswa.findByPk).toHaveBeenCalledWith(MahasiswaId, {
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Mahasiswa By ID ${MahasiswaId} Success:`,
      data: mockMahasiswa,
    });
  });

  it("should return 404 if mahasiswa not found", async () => {
    const MahasiswaId = 1;

    Mahasiswa.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({
      params: { id: MahasiswaId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaById(req, res, next);

    expect(Mahasiswa.findByPk).toHaveBeenCalledWith(MahasiswaId, {
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Mahasiswa With ID ${MahasiswaId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    Mahasiswa.findByPk.mockRejectedValue(mockError);

    const req = httpMocks.createRequest({
      params: { id: 1 },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaById(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
