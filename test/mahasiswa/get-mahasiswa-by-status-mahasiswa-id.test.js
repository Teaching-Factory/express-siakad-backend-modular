const { getMahasiswaByStatusMahasiswaId } = require("../../src/modules/mahasiswa/controller");
const { Mahasiswa, BiodataMahasiswa, PerguruanTinggi, Agama, Periode, Prodi, StatusMahasiswa, Semester } = require("../../models");
const httpMocks = require("node-mocks-http");
const { Op } = require("sequelize");

jest.mock("../../models", () => ({
  Mahasiswa: {
    findAll: jest.fn(),
  },
  StatusMahasiswa: {
    findOne: jest.fn(),
  },
}));

describe("getMahasiswaByStatusMahasiswaId", () => {
  it("should return 400 if Status Mahasiswa ID is not provided", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByStatusMahasiswaId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Status Mahasiswa ID is required",
    });
    expect(StatusMahasiswa.findOne).not.toHaveBeenCalled();
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 404 if Status Mahasiswa not found", async () => {
    const statusMahasiswaId = "123";
    StatusMahasiswa.findOne.mockResolvedValue(null);

    const req = httpMocks.createRequest({
      params: { id_status_mahasiswa: statusMahasiswaId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByStatusMahasiswaId(req, res, next);

    expect(StatusMahasiswa.findOne).toHaveBeenCalledWith({
      where: { id_status_mahasiswa: statusMahasiswaId },
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Status Mahasiswa dengan ID ${statusMahasiswaId} tidak ditemukan`,
    });
    expect(Mahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 404 if no Mahasiswa found for the given Status Mahasiswa ID", async () => {
    const statusMahasiswaId = "123";
    const mockStatusMahasiswa = { id_status_mahasiswa: statusMahasiswaId, nama_status_mahasiswa: "Aktif" };
    StatusMahasiswa.findOne.mockResolvedValue(mockStatusMahasiswa);
    Mahasiswa.findAll.mockResolvedValue([]);

    const req = httpMocks.createRequest({
      params: { id_status_mahasiswa: statusMahasiswaId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByStatusMahasiswaId(req, res, next);

    expect(StatusMahasiswa.findOne).toHaveBeenCalledWith({
      where: { id_status_mahasiswa: statusMahasiswaId },
    });
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        nama_status_mahasiswa: mockStatusMahasiswa.nama_status_mahasiswa,
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Mahasiswa dengan status mahasiswa ${mockStatusMahasiswa.nama_status_mahasiswa} tidak ditemukan`,
    });
  });

  it("should get Mahasiswa by Status Mahasiswa ID successfully", async () => {
    const statusMahasiswaId = "123";
    const mockStatusMahasiswa = { id_status_mahasiswa: statusMahasiswaId, nama_status_mahasiswa: "Aktif" };
    const mockMahasiswa = [
      { id: 1, name: "Mahasiswa 1" },
      { id: 2, name: "Mahasiswa 2" },
    ];

    StatusMahasiswa.findOne.mockResolvedValue(mockStatusMahasiswa);
    Mahasiswa.findAll.mockResolvedValue(mockMahasiswa);

    const req = httpMocks.createRequest({
      params: { id_status_mahasiswa: statusMahasiswaId },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByStatusMahasiswaId(req, res, next);

    expect(StatusMahasiswa.findOne).toHaveBeenCalledWith({
      where: { id_status_mahasiswa: statusMahasiswaId },
    });
    expect(Mahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        nama_status_mahasiswa: mockStatusMahasiswa.nama_status_mahasiswa,
      },
      include: [{ model: BiodataMahasiswa }, { model: PerguruanTinggi }, { model: Agama }, { model: Semester }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `GET Mahasiswa By Status Mahasiswa ${mockStatusMahasiswa.nama_status_mahasiswa} Success`,
      jumlahData: mockMahasiswa.length,
      data: mockMahasiswa,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    StatusMahasiswa.findOne.mockRejectedValue(mockError);

    const req = httpMocks.createRequest({
      params: { id_status_mahasiswa: "123" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getMahasiswaByStatusMahasiswaId(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
