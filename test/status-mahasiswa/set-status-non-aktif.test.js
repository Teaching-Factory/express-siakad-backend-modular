const httpMocks = require("node-mocks-http");
const { setStatusNonAktif } = require("../../src/modules/status-mahasiswa/controller");
const { Mahasiswa } = require("../../models");

jest.mock("../../models");

describe("setStatusNonAktif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - memasukkan id_registrasi mahasiswa yang sesuai
  it("should return success response when id_registrasi_mahasiswa is valid", async () => {
    const validMahasiswa = [{ id_registrasi_mahasiswa: "99aec4d5-5786-40d5-8579-2fe9dea3048b" }];
    const mockMahasiswa = {
      id_registrasi_mahasiswa: "99aec4d5-5786-40d5-8579-2fe9dea3048b",
      nama_status_mahasiswa: "Tidak Aktif",
      save: jest.fn().mockResolvedValue(true),
    };

    Mahasiswa.findByPk.mockResolvedValue(mockMahasiswa);

    req.body.mahasiswas = validMahasiswa;

    await setStatusNonAktif(req, res, next);

    expect(Mahasiswa.findByPk).toHaveBeenCalledWith(validMahasiswa[0].id_registrasi_mahasiswa);
    expect(mockMahasiswa.save).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "SET Status Non-Aktif Mahasiswa Success",
      jumlahData: validMahasiswa.length,
    });
  });

  // Kode uji 2 - memasukkan id_registrasi mahasiswa yang tidak sesuai
  it("should return error response when id_registrasi_mahasiswa is invalid", async () => {
    const invalidMahasiswa = [{ id_registrasi_mahasiswa: "000019b8-" }];

    Mahasiswa.findByPk.mockResolvedValue(null);

    req.body.mahasiswas = invalidMahasiswa;

    await setStatusNonAktif(req, res, next);

    expect(Mahasiswa.findByPk).toHaveBeenCalledWith(invalidMahasiswa[0].id_registrasi_mahasiswa);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `Mahasiswa dengan ID ${invalidMahasiswa[0].id_registrasi_mahasiswa} tidak ditemukan`,
    });
  });

  // Kode uji 3 - tidak mengisi id_registrasi_mahasiswa
  it("should return error response when id_registrasi_mahasiswa is not provided", async () => {
    const emptyMahasiswa = [{ id_registrasi_mahasiswa: "" }];

    req.body.mahasiswas = emptyMahasiswa;

    await setStatusNonAktif(req, res, next);

    expect(res.statusCode).toEqual(404); // Memastikan bahwa kondisi mahasiswa yang tidak ditemukan mengarah ke error 404
    expect(res._getJSONData()).toEqual({
      message: `Mahasiswa dengan ID ${emptyMahasiswa[0].id_registrasi_mahasiswa} tidak ditemukan`,
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const validMahasiswa = [{ id_registrasi_mahasiswa: "99aec4d5-5786-40d5-8579-2fe9dea3048b" }];
    const errorMessage = "Database error";

    Mahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    req.body.mahasiswas = validMahasiswa;

    await setStatusNonAktif(req, res, next);

    expect(Mahasiswa.findByPk).toHaveBeenCalledWith(validMahasiswa[0].id_registrasi_mahasiswa);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
