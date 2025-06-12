const { Mahasiswa, Prodi, JenjangPendidikan, SettingGlobal, Kuesioner } = require("../../models");
const httpMocks = require("node-mocks-http");
const { createKuesionerByMahasiswaActive } = require("../../src/modules/kuesioner/controller");

jest.mock("../../models");

describe("createKuesionerByMahasiswaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Kasus uji 1 - Kuesioner answers tidak diberikan
  it("should return 400 if kuesioner_answers is missing or empty", async () => {
    req.body = { kuesioner_answers: [] };
    req.params = { id_kelas_kuliah: 1 };

    await createKuesionerByMahasiswaActive(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "kuesioner_answers is required and should be a non-empty array"
    });
  });

  // Kasus uji 2 - Kelas Kuliah ID tidak diberikan
  it("should return 400 if kelasKuliahId is not provided", async () => {
    req.body = {
      kuesioner_answers: [{ id_aspek_penilaian_dosen: 1, id_skala_penilaian_dosen: 1 }]
    };
    req.params = {}; // Tidak ada id_kelas_kuliah

    await createKuesionerByMahasiswaActive(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah ID is required"
    });
  });

  // Kasus uji 3 - Mahasiswa tidak ditemukan
  it("should return 404 if mahasiswa is not found", async () => {
    req.body = {
      kuesioner_answers: [{ id_aspek_penilaian_dosen: 1, id_skala_penilaian_dosen: 1 }]
    };
    req.params = { id_kelas_kuliah: 1 };
    req.user = { username: "test_mahasiswa" };

    Mahasiswa.findOne.mockResolvedValue(null); // Mock Mahasiswa tidak ditemukan

    await createKuesionerByMahasiswaActive(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Mahasiswa not found"
    });
  });

  // Kasus uji 4 - Fitur kuesioner tidak diizinkan pada prodi
  it("should return 404 if questionnaire feature is not allowed on the prodi", async () => {
    req.body = {
      kuesioner_answers: [{ id_aspek_penilaian_dosen: 1, id_skala_penilaian_dosen: 1 }]
    };
    req.params = { id_kelas_kuliah: 1 };
    req.user = { username: "test_mahasiswa" };

    const mockMahasiswa = {
      nim: "test_mahasiswa",
      id_prodi: 1,
      Prodi: { id: 1, JenjangPendidikan: { id: 1, nama_jenjang: "S1" } }
    };

    const mockSettingGlobalProdi = {
      id_prodi: 1,
      open_questionnaire: true
    };

    Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);
    SettingGlobal.findOne.mockResolvedValue(mockSettingGlobalProdi);

    await createKuesionerByMahasiswaActive(req, res, next);

    expect(SettingGlobal.findOne).toHaveBeenCalledWith({ where: { id_prodi: 1 } });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Fitur Kusioner pada Prodi tidak dizinkan"
    });
  });

  // Kasus uji 5 - Berhasil membuat kuesioner
  it("should create kuesioners and return 201 when successful", async () => {
    req.body = {
      kuesioner_answers: [{ id_aspek_penilaian_dosen: 1, id_skala_penilaian_dosen: 1 }]
    };
    req.params = { id_kelas_kuliah: 1 };
    req.user = { username: "test_mahasiswa" };

    const mockMahasiswa = {
      id_registrasi_mahasiswa: 1,
      nim: "test_mahasiswa",
      id_prodi: 1,
      Prodi: { id: 1, JenjangPendidikan: { id: 1, nama_jenjang: "S1" } }
    };

    const mockSettingGlobalProdi = {
      id_prodi: 1,
      open_questionnaire: false
    };

    const mockKuesioner = { id: 1, id_aspek_penilaian_dosen: 1 };

    Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);
    SettingGlobal.findOne.mockResolvedValue(mockSettingGlobalProdi);
    Kuesioner.create.mockResolvedValue(mockKuesioner);

    await createKuesionerByMahasiswaActive(req, res, next);

    expect(Kuesioner.create).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Kuesioner By Mahasiswa Active Success",
      data: [mockKuesioner]
    });
  });

  // Kasus uji 6 - Penanganan error
  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Something went wrong");
    Mahasiswa.findOne.mockRejectedValue(mockError);

    await createKuesionerByMahasiswaActive(req, res, next);
  });
});
