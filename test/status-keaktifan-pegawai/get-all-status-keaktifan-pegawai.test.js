const httpMocks = require("node-mocks-http");
const { getAllStatusKeaktifanPegawai } = require("../../src/modules/status-keaktifan-pegawai/controller");
const { StatusKeaktifanPegawai } = require("../../models");

jest.mock("../../models");

describe("getAllStatusKeaktifanPegawai", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Menjalankan fungsi dan mendapatkan data status keaktifan pegawai
  it("should return all status keaktifan pegawai with status 200 if found", async () => {
    const mockStatusKeaktifanPegawai = [
      { id: 1, nama: "Status 1" },
      { id: 2, nama: "Status 2" },
    ];

    StatusKeaktifanPegawai.findAll.mockResolvedValue(mockStatusKeaktifanPegawai);

    await getAllStatusKeaktifanPegawai(req, res, next);

    expect(StatusKeaktifanPegawai.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Status Keaktifan Pegawai Success",
      jumlahData: mockStatusKeaktifanPegawai.length,
      data: mockStatusKeaktifanPegawai,
    });
  });

  // Kode uji 2 - Menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    StatusKeaktifanPegawai.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllStatusKeaktifanPegawai(req, res, next);

    expect(StatusKeaktifanPegawai.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
