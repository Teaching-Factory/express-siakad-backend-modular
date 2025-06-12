const httpMocks = require("node-mocks-http");
const { getAllKRSMahasiswa } = require("../../src/modules/krs-mahasiswa/controller");
const { KRSMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAllKRSMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan semua KRS mahasiswa dengan status 200 jika ditemukan
  it("should return all KRS mahasiswa with status 200 if found", async () => {
    const mockKRSMahasiswa = [
      { id: 1, nama: "KRS Mahasiswa 1" },
      { id: 2, nama: "KRS Mahasiswa 2" },
    ];
    KRSMahasiswa.findAll.mockResolvedValue(mockKRSMahasiswa);

    await getAllKRSMahasiswa(req, res, next);

    expect(KRSMahasiswa.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All KRS Mahasiswa Success",
      jumlahData: mockKRSMahasiswa.length,
      data: mockKRSMahasiswa,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    KRSMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllKRSMahasiswa(req, res, next);

    expect(KRSMahasiswa.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
