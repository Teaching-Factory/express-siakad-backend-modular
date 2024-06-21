const httpMocks = require("node-mocks-http");
const { createDosenPengajarKelasKuliah } = require("../../src/controllers/dosen-pengajar-kelas-kuliah");
const { DosenPengajarKelasKuliah, PenugasanDosen, KelasKuliah } = require("../../models");

jest.mock("../../models");

describe("createDosenPengajarKelasKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a new dosen pengajar kelas kuliah and return 201", async () => {
    const mockKelasKuliahId = 1;
    const mockSks = 3;
    const mockRencanaPertemuan = 14;
    const mockIdRegistrasiDosen = 2;

    req.params.id_kelas_kuliah = mockKelasKuliahId;
    req.body = {
      sks: mockSks,
      rencana_pertemuan: mockRencanaPertemuan,
      id_registrasi_dosen: mockIdRegistrasiDosen,
    };

    const mockPenugasanDosen = {
      id_dosen: 3,
      id_prodi: 4,
    };

    const mockKelasKuliah = {
      id_semester: 5,
    };

    const mockDosenPengajarKelasKuliah = {
      id: 1,
      sks_substansi_total: mockSks,
      rencana_minggu_pertemuan: mockRencanaPertemuan,
      realisasi_minggu_pertemuan: mockRencanaPertemuan,
      id_registrasi_dosen: mockIdRegistrasiDosen,
      id_dosen: mockPenugasanDosen.id_dosen,
      id_kelas_kuliah: mockKelasKuliahId,
      id_substansi: null,
      id_jenis_evaluasi: 1,
      id_prodi: mockPenugasanDosen.id_prodi,
      id_semester: mockKelasKuliah.id_semester,
    };

    PenugasanDosen.findOne.mockResolvedValue(mockPenugasanDosen);
    KelasKuliah.findByPk.mockResolvedValue(mockKelasKuliah);
    DosenPengajarKelasKuliah.create.mockResolvedValue(mockDosenPengajarKelasKuliah);

    await createDosenPengajarKelasKuliah(req, res, next);

    expect(PenugasanDosen.findOne).toHaveBeenCalledWith({ where: { id_registrasi_dosen: mockIdRegistrasiDosen } });
    expect(KelasKuliah.findByPk).toHaveBeenCalledWith(mockKelasKuliahId);
    expect(DosenPengajarKelasKuliah.create).toHaveBeenCalledWith({
      sks_substansi_total: mockSks,
      rencana_minggu_pertemuan: mockRencanaPertemuan,
      realisasi_minggu_pertemuan: mockRencanaPertemuan,
      id_registrasi_dosen: mockIdRegistrasiDosen,
      id_dosen: mockPenugasanDosen.id_dosen,
      id_kelas_kuliah: mockKelasKuliahId,
      id_substansi: null,
      id_jenis_evaluasi: 1,
      id_prodi: mockPenugasanDosen.id_prodi,
      id_semester: mockKelasKuliah.id_semester,
    });

    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Dosen Pengajar Kelas Kuliah Success",
      data: mockDosenPengajarKelasKuliah,
    });
  });

  it("should return 400 if sks is missing", async () => {
    req.body = {
      rencana_pertemuan: 14,
      id_registrasi_dosen: 2,
    };

    await createDosenPengajarKelasKuliah(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "sks is required" });
  });

  it("should return 400 if rencana_pertemuan is missing", async () => {
    req.body = {
      sks: 3,
      id_registrasi_dosen: 2,
    };

    await createDosenPengajarKelasKuliah(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "rencana_pertemuan is required" });
  });

  it("should return 400 if id_registrasi_dosen is missing", async () => {
    req.body = {
      sks: 3,
      rencana_pertemuan: 14,
    };

    await createDosenPengajarKelasKuliah(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_registrasi_dosen is required" });
  });

  it("should return 400 if kelas kuliah ID is missing", async () => {
    req.body = {
      sks: 3,
      rencana_pertemuan: 14,
      id_registrasi_dosen: 2,
    };

    await createDosenPengajarKelasKuliah(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Kelas Kuliah ID is required" });
  });

  it("should handle errors", async () => {
    req.params.id_kelas_kuliah = 1;
    req.body = {
      sks: 3,
      rencana_pertemuan: 14,
      id_registrasi_dosen: 2,
    };

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    DosenPengajarKelasKuliah.create.mockRejectedValue(error);

    await createDosenPengajarKelasKuliah(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
