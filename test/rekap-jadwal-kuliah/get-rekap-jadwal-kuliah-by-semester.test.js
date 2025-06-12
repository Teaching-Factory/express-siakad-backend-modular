const { getRekapJadwalKuliahBySemester } = require("../../src/modules/rekap-jadwal-kuliah/controller");
const { Mahasiswa, Semester, KRSMahasiswa, KelasKuliah, MataKuliah, DetailKelasKuliah, RuangPerkuliahan } = require("../../models");

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
      user: {
        username: "testUser",
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

  it("should return 400 if semesterId is missing", async () => {
    req.params.id_semester = undefined;

    await getRekapJadwalKuliahBySemester(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Semester ID is required" });
  });

  it("should return 404 if mahasiswa is not found", async () => {
    Mahasiswa.findOne.mockResolvedValue(null);

    await getRekapJadwalKuliahBySemester(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Mahasiswa not found" });
  });

  it("should handle errors gracefully", async () => {
    const error = new Error("Something went wrong");
    Mahasiswa.findOne.mockRejectedValue(error);

    await getRekapJadwalKuliahBySemester(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
