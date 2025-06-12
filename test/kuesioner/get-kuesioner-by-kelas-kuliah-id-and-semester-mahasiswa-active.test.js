const { KelasKuliah, SettingGlobalSemester, Semester, Dosen, MataKuliah, Mahasiswa, Prodi, JenjangPendidikan, SettingGlobal, AspekPenilaianDosen, SkalaPenilaianDosen } = require("../../models");
const httpMocks = require("node-mocks-http");
const { getKuesionerByKelasKuliahIdAndSemesterMahasiswaActive } = require("../../src/modules/kuesioner/controller");

describe("getKuesionerByKelasKuliahIdAndSemesterMahasiswaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kasus uji 1 - Berhasil mendapatkan kuesioner
  it("should return 200 and kuesioner data when found", async () => {
    req.params.id_kelas_kuliah = 1;
    req.user = { username: "test_mahasiswa" };

    const mockKelasKuliah = {
      id: 1,
      Semester: { id_semester: 1, nama_semester: "Semester 1" },
      Dosen: { id_dosen: 1, nama_dosen: "Dosen 1" },
      MataKuliah: { id_matakuliah: 1, nama_matakuliah: "Matakuliah 1" }
    };

    const mockSettingGlobalSemester = {
      SemesterAktif: { id_semester: 1, id_tahun_ajaran: 1 }
    };

    const mockMahasiswa = {
      nim: "test_mahasiswa",
      id_prodi: 1,
      Prodi: { id: 1, JenjangPendidikan: { id: 1, nama_jenjang: "S1" } }
    };

    const mockSettingGlobalProdi = {
      id_prodi: 1,
      open_questionnaire: false
    };

    const mockAspekPenilaianDosen = [{ id: 1, nama_aspek: "Aspek 1" }];
    const mockSkalaPenilaianDosen = [{ id: 1, skala: 5 }];

    jest.spyOn(KelasKuliah, "findByPk").mockResolvedValue(mockKelasKuliah);
    jest.spyOn(SettingGlobalSemester, "findOne").mockResolvedValue(mockSettingGlobalSemester);
    jest.spyOn(Mahasiswa, "findOne").mockResolvedValue(mockMahasiswa);
    jest.spyOn(SettingGlobal, "findOne").mockResolvedValue(mockSettingGlobalProdi);
    jest.spyOn(AspekPenilaianDosen, "findAll").mockResolvedValue(mockAspekPenilaianDosen);
    jest.spyOn(SkalaPenilaianDosen, "findAll").mockResolvedValue(mockSkalaPenilaianDosen);

    await getKuesionerByKelasKuliahIdAndSemesterMahasiswaActive(req, res, next);

    expect(KelasKuliah.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }, { model: Dosen }, { model: MataKuliah }]
    });
    expect(SettingGlobalSemester.findOne).toHaveBeenCalled();
    expect(Mahasiswa.findOne).toHaveBeenCalledWith({
      where: { nim: "test_mahasiswa" },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });
    expect(SettingGlobal.findOne).toHaveBeenCalledWith({ where: { id_prodi: 1 } });
    expect(AspekPenilaianDosen.findAll).toHaveBeenCalledWith({ where: { id_semester: 1 } });
    expect(SkalaPenilaianDosen.findAll).toHaveBeenCalledWith({ where: { id_semester: 1 } });

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Pertanyaan Kuesioner By Kelas Kuliah ID 1 Success:",
      dataMahasiswa: mockMahasiswa,
      dataKelasKuliah: mockKelasKuliah,
      dataAspekPenilaian: mockAspekPenilaianDosen,
      dataSkalaPenilaian: mockSkalaPenilaianDosen
    });
  });

  // Kasus uji 2 - Kelas Kuliah ID tidak ditemukan
  it("should return 404 when kelas kuliah is not found", async () => {
    req.params.id_kelas_kuliah = 999;

    jest.spyOn(KelasKuliah, "findByPk").mockResolvedValue(null);

    await getKuesionerByKelasKuliahIdAndSemesterMahasiswaActive(req, res, next);

    expect(KelasKuliah.findByPk).toHaveBeenCalledWith(999, {
      include: [{ model: Semester }, { model: Dosen }, { model: MataKuliah }]
    });

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah With ID 999 Not Found:"
    });
  });

  // Kasus uji 3 - Kelas Kuliah ID tidak diberikan
  it("should return 400 if kelas kuliah ID is not provided", async () => {
    req.params.id_kelas_kuliah = undefined;

    await getKuesionerByKelasKuliahIdAndSemesterMahasiswaActive(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah ID is required"
    });
  });

  // Kasus uji 4 - Fitur kuesioner tidak diizinkan pada prodi
  it("should return 404 if the questionnaire feature is not allowed", async () => {
    req.params.id_kelas_kuliah = 1;
    req.user = { username: "test_mahasiswa" };

    const mockKelasKuliah = {
      id: 1,
      Semester: { id_semester: 1, nama_semester: "Semester 1" },
      Dosen: { id_dosen: 1, nama_dosen: "Dosen 1" },
      MataKuliah: { id_matakuliah: 1, nama_matakuliah: "Matakuliah 1" }
    };

    const mockSettingGlobalSemester = {
      SemesterAktif: { id_semester: 1, id_tahun_ajaran: 1 }
    };

    const mockMahasiswa = {
      nim: "test_mahasiswa",
      id_prodi: 1,
      Prodi: { id: 1, JenjangPendidikan: { id: 1, nama_jenjang: "S1" } }
    };

    const mockSettingGlobalProdi = {
      id_prodi: 1,
      open_questionnaire: true
    };

    jest.spyOn(KelasKuliah, "findByPk").mockResolvedValue(mockKelasKuliah);
    jest.spyOn(SettingGlobalSemester, "findOne").mockResolvedValue(mockSettingGlobalSemester);
    jest.spyOn(Mahasiswa, "findOne").mockResolvedValue(mockMahasiswa);
    jest.spyOn(SettingGlobal, "findOne").mockResolvedValue(mockSettingGlobalProdi);

    await getKuesionerByKelasKuliahIdAndSemesterMahasiswaActive(req, res, next);

    expect(SettingGlobal.findOne).toHaveBeenCalledWith({ where: { id_prodi: 1 } });

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Fitur Kusioner pada Prodi tidak dizinkan"
    });
  });

  // Kasus uji 5 - Penanganan error
  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Something went wrong");
    jest.spyOn(KelasKuliah, "findByPk").mockRejectedValue(mockError);

    req.params.id_kelas_kuliah = 1;
    await getKuesionerByKelasKuliahIdAndSemesterMahasiswaActive(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
