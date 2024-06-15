const httpMocks = require("node-mocks-http");
const { getAllStatusMahasiswa } = require("../../src/controllers/status-mahasiswa");
const { StatusMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAllStatusMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menguji ketika data status mahasiswa ditemukan
  it("should return all status mahasiswa with status 200 if found", async () => {
    const mockStatusMahasiswa = [
      { id: 1, nama_status: "Aktif" },
      { id: 2, nama_status: "Cuti" },
    ];

    StatusMahasiswa.findAll.mockResolvedValue(mockStatusMahasiswa);

    await getAllStatusMahasiswa(req, res, next);

    expect(StatusMahasiswa.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Status Mahasiswa Success",
      jumlahData: mockStatusMahasiswa.length,
      data: mockStatusMahasiswa,
    });
  });

  // Kode uji 2 - menguji ketika data status mahasiswa tidak ditemukan
  it("should return an empty array if no status mahasiswa found", async () => {
    StatusMahasiswa.findAll.mockResolvedValue([]);

    await getAllStatusMahasiswa(req, res, next);

    expect(StatusMahasiswa.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Status Mahasiswa Success",
      jumlahData: 0,
      data: [],
    });
  });

  // Kode uji 3 - menguji penanganan error jika terjadi kesalahan saat mengambil data dari database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";

    StatusMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllStatusMahasiswa(req, res, next);

    expect(StatusMahasiswa.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
