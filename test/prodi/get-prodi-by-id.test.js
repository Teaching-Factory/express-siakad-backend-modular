const { getProdiById } = require("../../src/controllers/prodi");
const { Prodi } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getProdiById", () => {
  // mendefinisikan parameter fungsi
  let req, res, next;

  // membuat fungsi yang dipalsukan
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - ketika data prodi ditemukan
  it("should return prodi with status 200 when ID exists", async () => {
    // Mock data prodi yang diharapkan

    const expectedProdi = {
      id_prodi: "161ee729-6284-422d-b4b8-42640abb9ab4",
      nama_program_studi: "Pendidikan Guru Pendidikan Anak Usia Dini",
    };

    // Stub Prodi.findByPk untuk mengembalikan data prodi yang diharapkan
    jest.spyOn(Prodi, "findByPk").mockResolvedValue(expectedProdi);

    // Menyiapkan request dengan parameter ID Prodi
    req.params.id = expectedProdi.id_prodi;

    // Menjalankan fungsi yang akan diuji
    await getProdiById(req, res, next);

    // Memeriksa respons dari fungsi
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Prodi By ID ${expectedProdi.id_prodi} Success:`,
      data: expectedProdi,
    });
  });

  // Kode uji 2 - ketika data prodi tidak ditemukan
  it("should return 404 when prodi with ID does not exist", async () => {
    // ID Prodi yang akan diuji
    const nonExistentProdiId = "s";

    // Stub Prodi.findByPk untuk mengembalikan null (prodi tidak ditemukan)
    jest.spyOn(Prodi, "findByPk").mockResolvedValue(null);

    // Menyiapkan request dengan parameter ID Prodi
    req.params.id = nonExistentProdiId;

    // Menjalankan fungsi yang akan diuji
    await getProdiById(req, res, next);

    // Memeriksa respons dari fungsi
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Prodi With ID ${nonExistentProdiId} Not Found:`,
    });
  });

  // Kode uji 3 - tidak memasukkan id prodi pada parameter
  it("should return error response when id prodi is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID prodi dalam parameter

    await getProdiById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should handle errors", async () => {
    const errorMessage = "Database error";
    jest.spyOn(Prodi, "findByPk").mockRejectedValue(new Error(errorMessage));

    req.params.id = "some-id";

    await getProdiById(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
