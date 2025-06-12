const { createPesertaKelasByAngkatanAndKelasKuliahId } = require("../../src/modules/peserta-kelas-kuliah/controller");
const { Angkatan, Mahasiswa, PesertaKelasKuliah } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("createPesertaKelasByAngkatanAndKelasKuliahId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should create peserta kelas kuliah and return status 200", async () => {
    req.params.id_kelas_kuliah = 1;
    req.params.id_angkatan = 1;
    req.body = {
      mahasiswas: [{ id_registrasi_mahasiswa: "00159683-001a-487b-a798-7ed15a8c14e0" }, { id_registrasi_mahasiswa: "28e2e3e5-ce7d-4fe4-82ba-1477f211d0d0" }],
    };

    const mockAngkatanData = { id: 1, tahun: 2023 };
    const mockMahasiswaData = [{ id_registrasi_mahasiswa: "00159683-001a-487b-a798-7ed15a8c14e0" }, { id_registrasi_mahasiswa: "28e2e3e5-ce7d-4fe4-82ba-1477f211d0d0" }];
    const mockPesertaKelasData = [
      { angkatan: 2023, id_registrasi_mahasiswa: "00159683-001a-487b-a798-7ed15a8c14e0", id_kelas_kuliah: 1 },
      { angkatan: 2023, id_registrasi_mahasiswa: "28e2e3e5-ce7d-4fe4-82ba-1477f211d0d0", id_kelas_kuliah: 1 },
    ];

    jest.spyOn(Angkatan, "findByPk").mockResolvedValue(mockAngkatanData);
    jest.spyOn(Mahasiswa, "findOne").mockImplementation(({ where }) => {
      return mockMahasiswaData.find((m) => m.id_registrasi_mahasiswa === where.id_registrasi_mahasiswa);
    });
    jest.spyOn(PesertaKelasKuliah, "create").mockImplementation((data) => {
      return mockPesertaKelasData.find((p) => p.id_registrasi_mahasiswa === data.id_registrasi_mahasiswa);
    });

    await createPesertaKelasByAngkatanAndKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Peserta Kelas Kuliah Success",
      jumlahData: mockPesertaKelasData.length,
      data: mockPesertaKelasData,
    });
  });

  it("should return 400 if kelas kuliah ID is not provided", async () => {
    req.params.id_angkatan = 1;

    await createPesertaKelasByAngkatanAndKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah ID is required",
    });
  });

  it("should return 400 if angkatan ID is not provided", async () => {
    req.params.id_kelas_kuliah = 1;

    await createPesertaKelasByAngkatanAndKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Angkatan ID is required",
    });
  });

  it("should handle mahasiswa not found", async () => {
    req.params.id_kelas_kuliah = 1;
    req.params.id_angkatan = 1;
    req.body = {
      mahasiswas: [{ id_registrasi_mahasiswa: "000019b8" }],
    };

    const mockAngkatanData = { id: 1, tahun: 2023 };

    jest.spyOn(Angkatan, "findByPk").mockResolvedValue(mockAngkatanData);
    jest.spyOn(Mahasiswa, "findOne").mockResolvedValue(null);

    await createPesertaKelasByAngkatanAndKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Peserta Kelas Kuliah Success",
      jumlahData: 1,
      data: [{ message: "Mahasiswa with id 000019b8 not found" }],
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    req.params.id_kelas_kuliah = 1;
    req.params.id_angkatan = 1;
    req.body = { mahasiswas: [{ id_registrasi_mahasiswa: 1 }] };

    jest.spyOn(Angkatan, "findByPk").mockRejectedValue(new Error(errorMessage));

    await createPesertaKelasByAngkatanAndKelasKuliahId(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
