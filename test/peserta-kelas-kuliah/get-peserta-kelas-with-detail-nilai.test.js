const { getPesertaKelasWithDetailNilai } = require("../../src/controllers/peserta-kelas-kuliah");
const { PesertaKelasKuliah, DetailNilaiPerkuliahanKelas } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getPesertaKelasWithDetailNilai", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return peserta kelas with detail nilai and status 200", async () => {
    const idKelasKuliah = 1;
    req.params.id_kelas_kuliah = idKelasKuliah;

    const mockPesertaKelas = [
      { id_registrasi_mahasiswa: 1, Mahasiswa: { id: 1 }, toJSON: jest.fn().mockReturnValue({ id_registrasi_mahasiswa: 1, Mahasiswa: { id: 1 } }) },
      { id_registrasi_mahasiswa: 2, Mahasiswa: { id: 2 }, toJSON: jest.fn().mockReturnValue({ id_registrasi_mahasiswa: 2, Mahasiswa: { id: 2 } }) },
    ];

    const mockDetailNilaiPerkuliahan = [
      { id_registrasi_mahasiswa: 1, nilai: "A", toJSON: jest.fn().mockReturnValue({ id_registrasi_mahasiswa: 1, nilai: "A" }) },
      { id_registrasi_mahasiswa: 2, nilai: "B", toJSON: jest.fn().mockReturnValue({ id_registrasi_mahasiswa: 2, nilai: "B" }) },
    ];

    jest.spyOn(PesertaKelasKuliah, "findAll").mockResolvedValue(mockPesertaKelas);
    jest.spyOn(DetailNilaiPerkuliahanKelas, "findAll").mockResolvedValue(mockDetailNilaiPerkuliahan);

    await getPesertaKelasWithDetailNilai(req, res, next);

    const expectedData = [
      { id_registrasi_mahasiswa: 1, Mahasiswa: { id: 1 }, DetailNilaiPerkuliahanKelas: { id_registrasi_mahasiswa: 1, nilai: "A" } },
      { id_registrasi_mahasiswa: 2, Mahasiswa: { id: 2 }, DetailNilaiPerkuliahanKelas: { id_registrasi_mahasiswa: 2, nilai: "B" } },
    ];

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Peserta Kelas With Detail Nilai By Kelas ID ${idKelasKuliah} Success =====>`,
      jumlahData: expectedData.length,
      data: expectedData,
    });
  });

  it("should return 400 if kelas kuliah ID is not provided", async () => {
    await getPesertaKelasWithDetailNilai(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah ID is required",
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const idKelasKuliah = 1;
    req.params.id_kelas_kuliah = idKelasKuliah;

    jest.spyOn(PesertaKelasKuliah, "findAll").mockRejectedValue(new Error(errorMessage));

    await getPesertaKelasWithDetailNilai(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
