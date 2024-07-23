const { getRekapJadwalKuliahByFilter } = require("../../src/controllers/rekap-jadwal-kuliah");
const { MatkulKurikulum, DetailKelasKuliah, KelasKuliah, Dosen, MataKuliah, RuangPerkuliahan } = require("../../models");

jest.mock("../../models", () => ({
  MatkulKurikulum: { findAll: jest.fn() },
  DetailKelasKuliah: { findAll: jest.fn() },
  KelasKuliah: { findAll: jest.fn() },
  Dosen: { findAll: jest.fn() },
  MataKuliah: { findAll: jest.fn() },
  RuangPerkuliahan: { findAll: jest.fn() },
}));

describe("getRekapJadwalKuliahByFilter", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {
        id_prodi: "1",
        id_kurikulum: "1",
        id_semester: "1",
        semester: "1",
        tanggal_penandatanganan: "2023-07-21",
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

  it("should return 400 if id_prodi is not provided", async () => {
    req.query.id_prodi = undefined;

    await getRekapJadwalKuliahByFilter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_prodi is required" });
  });

  it("should return 400 if id_kurikulum is not provided", async () => {
    req.query.id_kurikulum = undefined;

    await getRekapJadwalKuliahByFilter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_kurikulum is required" });
  });

  it("should return 400 if id_semester is not provided", async () => {
    req.query.id_semester = undefined;

    await getRekapJadwalKuliahByFilter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_semester is required" });
  });

  it("should return 400 if semester is not provided", async () => {
    req.query.semester = undefined;

    await getRekapJadwalKuliahByFilter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "semester is required" });
  });

  it("should return 400 if tanggal_penandatanganan is not provided", async () => {
    req.query.tanggal_penandatanganan = undefined;

    await getRekapJadwalKuliahByFilter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "tanggal_penandatanganan is required" });
  });

  it("should return 200 and rekap jadwal kuliah data if found", async () => {
    const mockMatkulKurikulums = [{ MataKuliah: { id_matkul: "1" } }, { MataKuliah: { id_matkul: "2" } }];

    const mockDetailKelasKuliahs = [
      { id: "1", name: "class1" },
      { id: "2", name: "class2" },
    ];

    MatkulKurikulum.findAll.mockResolvedValue(mockMatkulKurikulums);
    DetailKelasKuliah.findAll.mockResolvedValue(mockDetailKelasKuliahs);

    await getRekapJadwalKuliahByFilter(req, res, next);

    expect(MatkulKurikulum.findAll).toHaveBeenCalledWith({
      where: { id_kurikulum: req.query.id_kurikulum, semester: req.query.semester },
      include: [{ model: MataKuliah }],
    });

    expect(DetailKelasKuliah.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: KelasKuliah,
          where: { id_semester: req.query.id_semester, id_prodi: req.query.id_prodi, id_matkul: ["1", "2"] },
          include: [{ model: Dosen }, { model: MataKuliah }],
        },
        { model: RuangPerkuliahan },
      ],
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "<===== GET Rekap Jadwal Kuliah By Filter Success",
      tanggal_penandatanganan: req.query.tanggal_penandatanganan,
      jumlahData: mockDetailKelasKuliahs.length,
      data: mockDetailKelasKuliahs,
    });
  });

  it("should handle errors and call next with error", async () => {
    const error = new Error("Something went wrong");
    MatkulKurikulum.findAll.mockRejectedValue(error);

    await getRekapJadwalKuliahByFilter(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
