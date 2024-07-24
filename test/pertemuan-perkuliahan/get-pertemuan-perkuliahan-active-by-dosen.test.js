const { getAllPertemuanPerkuliahanActiveByDosen } = require("../../src/controllers/pertemuan-perkuliahan");
const { Dosen, KelasKuliah, PertemuanPerkuliahan, RuangPerkuliahan, MataKuliah, Prodi, Semester } = require("../../models");

// Mock dependencies
jest.mock("../../models");

describe("getAllPertemuanPerkuliahanActiveByDosen", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        username: "123456789", // NIDN dosen
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

  it("should return 404 if dosen is not found", async () => {
    Dosen.findOne.mockResolvedValue(null);

    await getAllPertemuanPerkuliahanActiveByDosen(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Dosen not found" });
  });

  it("should return all active pertemuan perkuliahan if dosen is found", async () => {
    const dosenMockData = { id_dosen: "1" };
    const kelasKuliahMockData = [{ id_kelas_kuliah: "1" }, { id_kelas_kuliah: "2" }];
    const pertemuanPerkuliahanAktifMockData = [{ id_kelas_kuliah: "1" }, { id_kelas_kuliah: "2" }];

    Dosen.findOne.mockResolvedValue(dosenMockData);
    KelasKuliah.findAll.mockResolvedValue(kelasKuliahMockData);
    PertemuanPerkuliahan.findAll.mockResolvedValue(pertemuanPerkuliahanAktifMockData);

    await getAllPertemuanPerkuliahanActiveByDosen(req, res, next);

    expect(Dosen.findOne).toHaveBeenCalledWith({
      where: {
        nidn: req.user.username,
      },
    });
    expect(KelasKuliah.findAll).toHaveBeenCalledWith({
      where: {
        id_dosen: dosenMockData.id_dosen,
      },
    });
    expect(PertemuanPerkuliahan.findAll).toHaveBeenCalledWith({
      where: {
        buka_presensi: true,
        kunci_pertemuan: false,
        id_kelas_kuliah: kelasKuliahMockData.map((kelas) => kelas.id_kelas_kuliah),
      },
      include: [
        { model: RuangPerkuliahan },
        {
          model: KelasKuliah,
          include: [{ model: MataKuliah }, { model: Prodi }, { model: Semester }, { model: Dosen }],
        },
      ],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "<===== GET All Pertemuan Perkuliahan Aktif By Dosen Success",
      jumlahData: pertemuanPerkuliahanAktifMockData.length,
      data: pertemuanPerkuliahanAktifMockData,
    });
  });

  it("should handle errors gracefully", async () => {
    const error = new Error("Something went wrong");
    Dosen.findOne.mockRejectedValue(error);

    await getAllPertemuanPerkuliahanActiveByDosen(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
