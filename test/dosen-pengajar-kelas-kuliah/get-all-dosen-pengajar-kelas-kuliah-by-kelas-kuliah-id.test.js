const httpMocks = require("node-mocks-http");
const { getAllDosenPengajarKelasKuliahByIdKelasKuliah } = require("../../src/controllers/dosen-pengajar-kelas-kuliah");
const { DosenPengajarKelasKuliah, PenugasanDosen, Dosen, KelasKuliah, MataKuliah, Substansi, JenisEvaluasi, Prodi, Semester } = require("../../models");

jest.mock("../../models");

describe("getAllDosenPengajarKelasKuliahByIdKelasKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all dosen pengajar kelas kuliah by kelas kuliah ID and return 200", async () => {
    const mockKelasKuliahId = 1;

    req.params.id_kelas_kuliah = mockKelasKuliahId;

    const mockDosenPengajarKelasKuliah = [
      {
        id: 1,
        id_kelas_kuliah: mockKelasKuliahId,
        PenugasanDosen: { id: 1, tugas: "Mengajar" },
        Dosen: { id: 1, nama: "Dosen A" },
        KelasKuliah: { id_kelas_kuliah: mockKelasKuliahId, MataKuliah: { id: 1, nama: "Matematika" } },
        Substansi: { id: 1, nama: "Substansi 1" },
        JenisEvaluasi: { id: 1, nama: "Evaluasi 1" },
        Prodi: { id: 1, nama: "Prodi 1" },
        Semester: { id: 1, nama: "Semester 1" },
      },
    ];

    DosenPengajarKelasKuliah.findOne.mockResolvedValue(mockDosenPengajarKelasKuliah);

    await getAllDosenPengajarKelasKuliahByIdKelasKuliah(req, res, next);

    expect(DosenPengajarKelasKuliah.findOne).toHaveBeenCalledWith({
      where: { id_kelas_kuliah: mockKelasKuliahId },
      include: [{ model: PenugasanDosen }, { model: Dosen }, { model: KelasKuliah, include: [{ model: MataKuliah }] }, { model: Substansi }, { model: JenisEvaluasi }, { model: Prodi }, { model: Semester }],
    });

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET All Pengajar Kelas Kuliah By Id Kelas Kuliah ${mockKelasKuliahId} Success`,
      jumlahData: mockDosenPengajarKelasKuliah.length,
      data: mockDosenPengajarKelasKuliah,
    });
  });

  it("should return 400 if kelas kuliah ID is missing", async () => {
    req.params.id_kelas_kuliah = undefined;

    await getAllDosenPengajarKelasKuliahByIdKelasKuliah(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah ID is required",
    });
    expect(DosenPengajarKelasKuliah.findOne).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockKelasKuliahId = 1;
    req.params.id_kelas_kuliah = mockKelasKuliahId;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    DosenPengajarKelasKuliah.findOne.mockRejectedValue(error);

    await getAllDosenPengajarKelasKuliahByIdKelasKuliah(req, res, next);

    expect(DosenPengajarKelasKuliah.findOne).toHaveBeenCalledWith({
      where: { id_kelas_kuliah: mockKelasKuliahId },
      include: [{ model: PenugasanDosen }, { model: Dosen }, { model: KelasKuliah, include: [{ model: MataKuliah }] }, { model: Substansi }, { model: JenisEvaluasi }, { model: Prodi }, { model: Semester }],
    });

    expect(next).toHaveBeenCalledWith(error);
  });
});
