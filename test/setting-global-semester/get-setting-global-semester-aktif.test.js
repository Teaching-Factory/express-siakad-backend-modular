const httpMocks = require("node-mocks-http");
const { getSettingGlobalSemesterAktif } = require("../../src/controllers/setting-global-semester");
const { SettingGlobalSemester, Semester } = require("../../models");

jest.mock("../../models");

describe("getSettingGlobalSemesterAktif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 404 if active Setting Global Semester is not found", async () => {
    SettingGlobalSemester.findOne.mockResolvedValue(null);

    await getSettingGlobalSemesterAktif(req, res, next);

    expect(SettingGlobalSemester.findOne).toHaveBeenCalledWith({
      where: { status: true },
      include: [
        { model: Semester, as: "SemesterAktif" },
        { model: Semester, as: "SemesterNilai" },
        { model: Semester, as: "SemesterKrs" }
      ]
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Setting Global Semester Aktif Not Found:`
    });
  });

  it("should return 200 and the active Setting Global Semester data if found", async () => {
    const mockSettingGlobalSemesterAktif = {
      id: 1,
      batas_sks_krs: 24,
      wilayah_penandatanganan: "Banyuwangi",
      label_dosen_wali: "Pembimbing Akademik",
      status: true,
      id_semester_aktif: "20232",
      id_semester_nilai: "20232",
      id_semester_krs: "20241",
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z",
      SemesterAktif: {
        id_semester: "20232",
        nama_semester: "2023/2024 Genap",
        semester: 2,
        id_tahun_ajaran: 2023,
        createdAt: "2023-03-02T02:27:27.000Z",
        updatedAt: "2023-03-02T02:27:27.000Z"
      },
      SemesterNilai: {
        id_semester: "20232",
        nama_semester: "2023/2024 Genap",
        semester: 2,
        id_tahun_ajaran: 2023,
        createdAt: "2023-03-02T02:27:27.000Z",
        updatedAt: "2023-03-02T02:27:27.000Z"
      },
      SemesterKrs: {
        id_semester: "20241",
        nama_semester: "2024/2025 Ganjil",
        semester: 1,
        id_tahun_ajaran: 2024,
        createdAt: "2024-09-02T02:27:27.000Z",
        updatedAt: "2024-09-02T02:27:27.000Z"
      }
    };

    SettingGlobalSemester.findOne.mockResolvedValue(mockSettingGlobalSemesterAktif);

    await getSettingGlobalSemesterAktif(req, res, next);

    expect(SettingGlobalSemester.findOne).toHaveBeenCalledWith({
      where: { status: true },
      include: [
        { model: Semester, as: "SemesterAktif" },
        { model: Semester, as: "SemesterNilai" },
        { model: Semester, as: "SemesterKrs" }
      ]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Setting Global Semester Aktif Success:`,
      data: mockSettingGlobalSemesterAktif
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SettingGlobalSemester.findOne.mockRejectedValue(error);

    await getSettingGlobalSemesterAktif(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
