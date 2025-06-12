const httpMocks = require("node-mocks-http");
const { getKRSMahasiswaByMahasiswaId } = require("../../src/modules/krs-mahasiswa/controller");
const { KRSMahasiswa, Mahasiswa, Semester, Prodi, MataKuliah, KelasKuliah, SettingGlobalSemester, DetailKelasKuliah, RuangPerkuliahan, DosenPengajarKelasKuliah, Dosen } = require("../../models");

jest.mock("../../models");

describe("getKRSMahasiswaByMahasiswaId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return KRS mahasiswa by ID with status 200 if found", async () => {
    const idRegistrasiMahasiswa = 1;

    const mockSemesterAktif = { id_semester_krs: 2 };

    const mockKRSData = [
      {
        id: 1,
        MataKuliah: { sks_mata_kuliah: "3" },
        KelasKuliah: {
          nama_kelas_kuliah: "Kelas A",
          sks: 3,
          jumlah_mahasiswa: 20,
          lingkup: "Teori",
          mode: "Online",
          id_prodi: 1,
          id_semester: 2,
          id_matkul: 10,
          id_dosen: 5,
        },
        setDataValue: jest.fn(),
      },
      {
        id: 2,
        MataKuliah: { sks_mata_kuliah: "2" },
        KelasKuliah: {
          nama_kelas_kuliah: null, // Tidak lengkap
          sks: 2,
          jumlah_mahasiswa: 0,
          lingkup: "Praktikum",
          mode: "Offline",
          id_prodi: 1,
          id_semester: 2,
          id_matkul: 11,
          id_dosen: 6,
        },
        setDataValue: jest.fn(),
      },
    ];

    SettingGlobalSemester.findOne.mockResolvedValue(mockSemesterAktif);
    KRSMahasiswa.findAll.mockResolvedValue(mockKRSData);

    req.params.id_registrasi_mahasiswa = idRegistrasiMahasiswa;

    await getKRSMahasiswaByMahasiswaId(req, res, next);

    expect(SettingGlobalSemester.findOne).toHaveBeenCalledWith({ where: { status: true } });
    expect(KRSMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_registrasi_mahasiswa: idRegistrasiMahasiswa,
        id_semester: mockSemesterAktif.id_semester_krs,
      },
      include: [
        { model: Mahasiswa },
        { model: Semester },
        { model: Prodi },
        { model: MataKuliah },
        {
          model: KelasKuliah,
          include: [
            { model: DetailKelasKuliah, include: [{ model: RuangPerkuliahan }] },
            { model: DosenPengajarKelasKuliah, include: [{ model: Dosen }] },
          ],
        },
      ],
    });

    expect(mockKRSData[0].setDataValue).toHaveBeenCalledWith("status_kelas", "Kelas Sudah Lengkap");
    expect(mockKRSData[1].setDataValue).toHaveBeenCalledWith("status_kelas", "Kelas Belum Lengkap");

    const result = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(result.jumlahData).toBe(2);
    expect(result.total_sks_mata_kuliah).toBe(5);
    expect(result.message).toBe(`<===== GET KRS Mahasiswa By ID ${idRegistrasiMahasiswa} Success:`);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if no KRS data found", async () => {
    const idRegistrasiMahasiswa = 1;
    SettingGlobalSemester.findOne.mockResolvedValue({ id_semester_krs: 2 });
    KRSMahasiswa.findAll.mockResolvedValue([]);

    req.params.id_registrasi_mahasiswa = idRegistrasiMahasiswa;

    await getKRSMahasiswaByMahasiswaId(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== KRS Mahasiswa With ID ${idRegistrasiMahasiswa} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if ID registrasi mahasiswa is not provided", async () => {
    req.params.id_registrasi_mahasiswa = undefined;

    await getKRSMahasiswaByMahasiswaId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "ID Registrasi Mahasiswa is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    SettingGlobalSemester.findOne.mockRejectedValueOnce(new Error(errorMessage));

    const idRegistrasiMahasiswa = 1;
    req.params.id_registrasi_mahasiswa = idRegistrasiMahasiswa;

    await getKRSMahasiswaByMahasiswaId(req, res, next);

    expect(SettingGlobalSemester.findOne).toHaveBeenCalledWith({ where: { status: true } });
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
