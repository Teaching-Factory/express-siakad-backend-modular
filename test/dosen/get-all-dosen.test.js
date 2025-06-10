const httpMocks = require("node-mocks-http");
const { getAllDosen } = require("../../src/modules/dosen/controller");
const { Dosen } = require("../../models");

jest.mock("../../models");

describe("getAllDosen", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil semua data dosen jika berhasil
  it("should return all dosen with status 200 if found", async () => {
    const mockDosen = [
      { id: 1, nama: "Dosen 1", Agama: { id: 1, nama: "Islam" }, StatusKeaktifanPegawai: { id: 1, status: "Aktif" } },
      { id: 2, nama: "Dosen 2", Agama: { id: 2, nama: "Kristen" }, StatusKeaktifanPegawai: { id: 1, status: "Aktif" } },
    ];

    Dosen.findAll.mockResolvedValue(mockDosen);

    await getAllDosen(req, res, next);

    expect(Dosen.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Dosen Success",
      jumlahData: mockDosen.length,
      data: mockDosen,
    });
  });

  // Kode uji 2 - Menangani kasus jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";

    Dosen.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllDosen(req, res, next);

    expect(Dosen.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
