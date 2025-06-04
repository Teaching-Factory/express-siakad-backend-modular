const httpMocks = require("node-mocks-http");
const { getStatusMahasiswaById } = require("../../src/modules/status-mahasiswa/controller");
const { StatusMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getStatusMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menguji dengan memasukkan ID status mahasiswa yang valid
  it("should return status mahasiswa data with status 200 if found", async () => {
    const statusMahasiswaId = "A";
    const mockStatusMahasiswa = { id: statusMahasiswaId, nama_status: "Aktif" };

    StatusMahasiswa.findByPk.mockResolvedValue(mockStatusMahasiswa);

    req.params.id = statusMahasiswaId;

    await getStatusMahasiswaById(req, res, next);

    expect(StatusMahasiswa.findByPk).toHaveBeenCalledWith(statusMahasiswaId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Status Mahasiswa By ID ${statusMahasiswaId} Success:`,
      data: mockStatusMahasiswa,
    });
  });

  // Kode uji 2 - menguji dengan memasukkan ID status mahasiswa yang tidak valid
  it("should return 404 if status mahasiswa is not found", async () => {
    const statusMahasiswaId = "A121"; // ID yang tidak ada
    const errorMessage = `<===== Status Mahasiswa With ID ${statusMahasiswaId} Not Found:`;

    StatusMahasiswa.findByPk.mockResolvedValue(null);

    req.params.id = statusMahasiswaId;

    await getStatusMahasiswaById(req, res, next);

    expect(StatusMahasiswa.findByPk).toHaveBeenCalledWith(statusMahasiswaId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: errorMessage });
  });

  // Kode uji 3 - menguji ketika ID status mahasiswa tidak disediakan
  it("should return error response when status mahasiswa ID is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID status mahasiswa dalam parameter

    await getStatusMahasiswaById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Status Mahasiswa ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat mengambil data dari database
  it("should call next with error if database query fails", async () => {
    const statusMahasiswaId = 1;
    const errorMessage = "Database error";

    StatusMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = statusMahasiswaId;

    await getStatusMahasiswaById(req, res, next);

    expect(StatusMahasiswa.findByPk).toHaveBeenCalledWith(statusMahasiswaId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
