const { Mahasiswa, Prodi, JenjangPendidikan, Agama, SettingGlobalSemester, Semester, DosenWali, Dosen, KRSMahasiswa } = require("../../models");
const httpMocks = require("node-mocks-http");
const { getKRSMahasiswaBySemesterAktif } = require("../../src/controllers/mahasiswa");

describe("getKRSMahasiswaBySemesterAktif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kasus uji 1 - Mahasiswa tidak ditemukan
  it("should return 404 if mahasiswa is not found", async () => {
    jest.spyOn(Mahasiswa, "findOne").mockResolvedValue(null);

    req.user = { username: "1234567890" };

    await getKRSMahasiswaBySemesterAktif(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Mahasiswa not found"
    });
  });

  // Kasus uji 2 - Setting global semester aktif tidak ditemukan
  it("should return 404 if setting global semester aktif is not found", async () => {
    const mockMahasiswa = { id_registrasi_mahasiswa: 1 };
    jest.spyOn(Mahasiswa, "findOne").mockResolvedValue(mockMahasiswa);
    jest.spyOn(SettingGlobalSemester, "findOne").mockResolvedValue(null);

    req.user = { username: "1234567890" };

    await getKRSMahasiswaBySemesterAktif(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Setting Global Semester Aktif not found"
    });
  });

  // Kasus uji 3 - Mengambil data KRS mahasiswa dengan sukses
  it("should return 200 and KRS data if successful", async () => {
    const mockMahasiswa = { id_registrasi_mahasiswa: 1 };
    const mockSettingGlobalSemester = {
      SemesterAktif: { id_semester: 1, id_tahun_ajaran: 1 }
    };
    const mockDosenWali = { id_dosen_wali: 1, Dosen: { nama: "Dosen Wali" } };
    const mockKRSMahasiswas = [{ id_krs: 1 }, { id_krs: 2 }];

    jest.spyOn(Mahasiswa, "findOne").mockResolvedValue(mockMahasiswa);
    jest.spyOn(SettingGlobalSemester, "findOne").mockResolvedValue(mockSettingGlobalSemester);
    jest.spyOn(DosenWali, "findOne").mockResolvedValue(mockDosenWali);
    jest.spyOn(KRSMahasiswa, "findAll").mockResolvedValue(mockKRSMahasiswas);

    req.user = { username: "1234567890" };

    await getKRSMahasiswaBySemesterAktif(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "Get KRS Mahasiswa By Semester Active Success",
      id_semester: mockSettingGlobalSemester.SemesterAktif.id_semester,
      jumlahDataKRSMahasiswa: mockKRSMahasiswas.length,
      dosenWali: mockDosenWali,
      dataMahasiswa: mockMahasiswa,
      dataKRSMahasiswa: mockKRSMahasiswas
    });
  });

  // Kasus uji 4 - Penanganan error
  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Something went wrong");
    jest.spyOn(Mahasiswa, "findOne").mockRejectedValue(mockError);

    req.user = { username: "1234567890" };

    await getKRSMahasiswaBySemesterAktif(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
