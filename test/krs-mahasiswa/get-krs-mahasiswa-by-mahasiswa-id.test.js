const httpMocks = require("node-mocks-http");
const { getKRSMahasiswaByMahasiswaId } = require("../../src/controllers/krs-mahasiswa");
const { KRSMahasiswa, Mahasiswa, Periode, Prodi, MataKuliah, KelasKuliah, TahunAjaran } = require("../../models");

jest.mock("../../models");

describe("getKRSMahasiswaByMahasiswaId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan KRS mahasiswa dengan ID registrasi yang valid dan status 200 jika ditemukan
  it("should return KRS mahasiswa by ID registrasi with status 200 if found", async () => {
    const idRegistrasiMahasiswa = 1;
    const mockKRSMahasiswa = [{ id: 1, nama: "KRS Mahasiswa 1" }];
    const mockTahunAjaran = { id_tahun_ajaran: 1 };

    TahunAjaran.findOne.mockResolvedValue(mockTahunAjaran);
    KRSMahasiswa.findAll.mockResolvedValue(mockKRSMahasiswa);

    req.params.id_registrasi_mahasiswa = idRegistrasiMahasiswa;

    await getKRSMahasiswaByMahasiswaId(req, res, next);

    expect(TahunAjaran.findOne).toHaveBeenCalledWith({
      where: { a_periode: 1 },
    });
    expect(KRSMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_registrasi_mahasiswa: idRegistrasiMahasiswa,
        angkatan: mockTahunAjaran.id_tahun_ajaran,
      },
      include: [{ model: Mahasiswa }, { model: Periode }, { model: Prodi }, { model: MataKuliah }, { model: KelasKuliah }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET KRS Mahasiswa By ID ${idRegistrasiMahasiswa} Success:`,
      jumlahData: mockKRSMahasiswa.length,
      data: mockKRSMahasiswa,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 404 jika KRS mahasiswa tidak ditemukan
  it("should return 404 if KRS mahasiswa by ID registrasi is not found", async () => {
    const idRegistrasiMahasiswa = 1;
    const mockTahunAjaran = { id_tahun_ajaran: 1 };

    TahunAjaran.findOne.mockResolvedValue(mockTahunAjaran);
    KRSMahasiswa.findAll.mockResolvedValue([]);

    req.params.id_registrasi_mahasiswa = idRegistrasiMahasiswa;

    await getKRSMahasiswaByMahasiswaId(req, res, next);

    expect(TahunAjaran.findOne).toHaveBeenCalledWith({
      where: { a_periode: 1 },
    });
    expect(KRSMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_registrasi_mahasiswa: idRegistrasiMahasiswa,
        angkatan: mockTahunAjaran.id_tahun_ajaran,
      },
      include: [{ model: Mahasiswa }, { model: Periode }, { model: Prodi }, { model: MataKuliah }, { model: KelasKuliah }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== KRS Mahasiswa With ID ${idRegistrasiMahasiswa} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - Mengembalikan respons 400 jika ID registrasi mahasiswa tidak disediakan
  it("should return 400 if ID registrasi mahasiswa is not provided", async () => {
    req.params.id_registrasi_mahasiswa = undefined;

    await getKRSMahasiswaByMahasiswaId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "ID Registrasi Mahasiswa is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 4 - Mengembalikan respons 404 jika tahun ajaran dengan a_periode 1 tidak ditemukan
  it("should return 404 if tahun ajaran with a_periode 1 is not found", async () => {
    TahunAjaran.findOne.mockResolvedValue(null);

    const idRegistrasiMahasiswa = 1;
    req.params.id_registrasi_mahasiswa = idRegistrasiMahasiswa;

    await getKRSMahasiswaByMahasiswaId(req, res, next);

    expect(TahunAjaran.findOne).toHaveBeenCalledWith({
      where: { a_periode: 1 },
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Tahun Ajaran with a_periode 1 not found",
    });
  });

  // Kode uji 5 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    TahunAjaran.findOne.mockRejectedValue(new Error(errorMessage));

    const idRegistrasiMahasiswa = 1;
    req.params.id_registrasi_mahasiswa = idRegistrasiMahasiswa;

    await getKRSMahasiswaByMahasiswaId(req, res, next);

    expect(TahunAjaran.findOne).toHaveBeenCalledWith({
      where: { a_periode: 1 },
    });
  });
});
