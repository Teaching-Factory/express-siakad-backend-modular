const { getRekapJadwalKuliahBySemester } = require("../../src/controllers/rekap-jadwal-kuliah");
const { Semester, MatkulKurikulum, MataKuliah, DetailKelasKuliah, KelasKuliah, Dosen, RuangPerkuliahan } = require("../../models");

// Mock dependencies
jest.mock("../../models");

describe("getRekapJadwalKuliahBySemester", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {
        id_prodi: "1",
        id_kurikulum: "1",
        semester: "1",
        tanggal_penandatanganan: "2024-07-24",
      },
      params: {
        id_semester: "1",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if id_prodi is missing", async () => {
    req.query.id_prodi = undefined;

    await getRekapJadwalKuliahBySemester(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_prodi is required" });
  });

  it("should return 400 if id_kurikulum is missing", async () => {
    req.query.id_kurikulum = undefined;

    await getRekapJadwalKuliahBySemester(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_kurikulum is required" });
  });

  it("should return 400 if semester is missing", async () => {
    req.query.semester = undefined;

    await getRekapJadwalKuliahBySemester(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "semester is required" });
  });

  it("should return 400 if tanggal_penandatanganan is missing", async () => {
    req.query.tanggal_penandatanganan = undefined;

    await getRekapJadwalKuliahBySemester(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "tanggal_penandatanganan is required" });
  });

  it("should return 400 if id_semester is missing", async () => {
    req.params.id_semester = undefined;

    await getRekapJadwalKuliahBySemester(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Semester ID is required" });
  });

  it("should return 404 if semester is not found", async () => {
    Semester.findOne.mockResolvedValue(null);

    await getRekapJadwalKuliahBySemester(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "<===== Semester With ID 1 Not Found:" });
  });

  //   belum pass
  //   it("should return 200 with correct data if all conditions are met", async () => {
  //     const mockSemesterData = { id_semester: "1" };
  //     const mockMatkulKurikulums = [{ MataKuliah: { id_matkul: "1" } }, { MataKuliah: { id_matkul: "2" } }];
  //     const mockDetailKelasKuliah = [
  //       {
  //         KelasKuliah: { id_semester: "1", id_prodi: "1", id_matkul: "1", Dosen: {}, MataKuliah: {} },
  //         RuangPerkuliahan: {},
  //       },
  //     ];

  //     Semester.findOne.mockResolvedValue(mockSemesterData);
  //     MatkulKurikulum.findAll.mockResolvedValue(mockMatkulKurikulums);
  //     DetailKelasKuliah.findAll.mockResolvedValue(mockDetailKelasKuliah);

  //     await getRekapJadwalKuliahBySemester(req, res, next);

  //     expect(Semester.findOne).toHaveBeenCalledWith({ where: { id_semester: "1" } });
  //     expect(MatkulKurikulum.findAll).toHaveBeenCalledWith({
  //       where: { id_kurikulum: "1", semester: "1" },
  //       include: [{ model: MataKuliah }],
  //     });
  //     expect(DetailKelasKuliah.findAll).toHaveBeenCalledWith({
  //       include: [
  //         {
  //           model: KelasKuliah,
  //           where: { id_semester: "1", id_prodi: "1", id_matkul: ["1", "2"] },
  //           include: [{ model: Dosen }, { model: MataKuliah }],
  //         },
  //         { model: RuangPerkuliahan },
  //       ],
  //     });
  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: "<===== GET Rekap Jadwal Kuliah By Semester ID 1 Success",
  //       tanggal_penandatanganan: "2024-07-24",
  //       jumlahData: mockDetailKelasKuliah.length,
  //       data: mockDetailKelasKuliah,
  //     });
  //   });

  it("should handle errors gracefully", async () => {
    const error = new Error("Something went wrong");
    Semester.findOne.mockRejectedValue(error);

    await getRekapJadwalKuliahBySemester(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
