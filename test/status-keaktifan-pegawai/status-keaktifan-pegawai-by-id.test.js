const httpMocks = require("node-mocks-http");
const { getStatusKeaktifanPegawaiById } = require("../../src/modules/status-keaktifan-pegawai/controller");
const { StatusKeaktifanPegawai } = require("../../models");

jest.mock("../../models");

describe("getStatusKeaktifanPegawaiById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Menjalankan fungsi dan mendapatkan data status keaktifan pegawai berdasarkan ID
  it("should return status keaktifan pegawai by ID with status 200 if found", async () => {
    const statusKeaktifanPegawaiId = 1;
    const mockStatusKeaktifanPegawai = { id: statusKeaktifanPegawaiId, nama: "Status 1" };

    StatusKeaktifanPegawai.findByPk.mockResolvedValue(mockStatusKeaktifanPegawai);
    req.params.id = statusKeaktifanPegawaiId;

    await getStatusKeaktifanPegawaiById(req, res, next);

    expect(StatusKeaktifanPegawai.findByPk).toHaveBeenCalledWith(statusKeaktifanPegawaiId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Status Keaktifan Pegawai By ID ${statusKeaktifanPegawaiId} Success:`,
      data: mockStatusKeaktifanPegawai,
    });
  });

  // Kode uji 2 - Menguji penanganan saat ID status keaktifan pegawai tidak diberikan
  it("should return 400 if status keaktifan pegawai ID is not provided", async () => {
    await getStatusKeaktifanPegawaiById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Status Keaktifan Pegawai ID is required",
    });
  });

  // Kode uji 3 - Menguji penanganan saat status keaktifan pegawai tidak ditemukan
  it("should return 404 if status keaktifan pegawai by ID is not found", async () => {
    const statusKeaktifanPegawaiId = 999; // ID yang tidak ada di database
    StatusKeaktifanPegawai.findByPk.mockResolvedValue(null);
    req.params.id = statusKeaktifanPegawaiId;

    await getStatusKeaktifanPegawaiById(req, res, next);

    expect(StatusKeaktifanPegawai.findByPk).toHaveBeenCalledWith(statusKeaktifanPegawaiId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Status Keaktifan Pegawai With ID ${statusKeaktifanPegawaiId} Not Found:`,
    });
  });

  // Kode uji 4 - Menguji penanganan error saat terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    // Set parameter id yang valid
    req.params.id = 1;

    const errorMessage = "Database error";
    StatusKeaktifanPegawai.findByPk.mockRejectedValue(new Error(errorMessage));

    await getStatusKeaktifanPegawaiById(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
