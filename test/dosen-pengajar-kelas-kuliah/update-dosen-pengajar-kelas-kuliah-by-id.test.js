const httpMocks = require("node-mocks-http");
const { updateDosenPengajarKelasKuliahById } = require("../../src/controllers/dosen-pengajar-kelas-kuliah");
const { DosenPengajarKelasKuliah, PenugasanDosen } = require("../../models");

jest.mock("../../models");

describe("updateDosenPengajarKelasKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update a dosen pengajar kelas kuliah and return 201", async () => {
    const mockDosenPengajarKelasKuliahId = 1;
    const mockSks = 3;
    const mockRencanaPertemuan = 14;
    const mockIdRegistrasiDosen = 2;

    req.params.id = mockDosenPengajarKelasKuliahId;
    req.body = {
      sks: mockSks,
      rencana_pertemuan: mockRencanaPertemuan,
      id_registrasi_dosen: mockIdRegistrasiDosen,
    };

    const mockPenugasanDosen = {
      id_dosen: 3,
      id_prodi: 4,
    };

    const mockDosenPengajarKelasKuliah = {
      id: mockDosenPengajarKelasKuliahId,
      sks_substansi_total: 2,
      rencana_minggu_pertemuan: 10,
      realisasi_minggu_pertemuan: 10,
      id_registrasi_dosen: 1,
      id_dosen: 2,
      id_prodi: 3,
      save: jest.fn().mockResolvedValue(true),
    };

    PenugasanDosen.findOne.mockResolvedValue(mockPenugasanDosen);
    DosenPengajarKelasKuliah.findByPk.mockResolvedValue(mockDosenPengajarKelasKuliah);

    await updateDosenPengajarKelasKuliahById(req, res, next);

    expect(PenugasanDosen.findOne).toHaveBeenCalledWith({ where: { id_registrasi_dosen: mockIdRegistrasiDosen } });
    expect(DosenPengajarKelasKuliah.findByPk).toHaveBeenCalledWith(mockDosenPengajarKelasKuliahId);

    expect(mockDosenPengajarKelasKuliah.sks_substansi_total).toBe(mockSks);
    expect(mockDosenPengajarKelasKuliah.rencana_minggu_pertemuan).toBe(mockRencanaPertemuan);
    expect(mockDosenPengajarKelasKuliah.realisasi_minggu_pertemuan).toBe(mockRencanaPertemuan);
    expect(mockDosenPengajarKelasKuliah.id_registrasi_dosen).toBe(mockIdRegistrasiDosen);
    expect(mockDosenPengajarKelasKuliah.id_dosen).toBe(mockPenugasanDosen.id_dosen);
    expect(mockDosenPengajarKelasKuliah.id_prodi).toBe(mockPenugasanDosen.id_prodi);

    expect(mockDosenPengajarKelasKuliah.save).toHaveBeenCalled();

    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Dosen Pengajar Kelas Kuliah With ID ${mockDosenPengajarKelasKuliahId} Success:`,
      data: {
        id: mockDosenPengajarKelasKuliahId,
        sks_substansi_total: mockDosenPengajarKelasKuliah.sks_substansi_total,
        rencana_minggu_pertemuan: mockDosenPengajarKelasKuliah.rencana_minggu_pertemuan,
        realisasi_minggu_pertemuan: mockDosenPengajarKelasKuliah.realisasi_minggu_pertemuan,
        id_registrasi_dosen: mockDosenPengajarKelasKuliah.id_registrasi_dosen,
        id_dosen: mockDosenPengajarKelasKuliah.id_dosen,
        id_prodi: mockDosenPengajarKelasKuliah.id_prodi,
      },
    });
  });

  it("should return 400 if sks is missing", async () => {
    req.body = {
      rencana_pertemuan: 14,
      id_registrasi_dosen: 2,
    };

    await updateDosenPengajarKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "sks is required" });
  });

  it("should return 400 if rencana_pertemuan is missing", async () => {
    req.body = {
      sks: 3,
      id_registrasi_dosen: 2,
    };

    await updateDosenPengajarKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "rencana_pertemuan is required" });
  });

  it("should return 400 if id_registrasi_dosen is missing", async () => {
    req.body = {
      sks: 3,
      rencana_pertemuan: 14,
    };

    await updateDosenPengajarKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_registrasi_dosen is required" });
  });

  it("should return 400 if dosen pengajar kelas kuliah ID is missing", async () => {
    req.body = {
      sks: 3,
      rencana_pertemuan: 14,
      id_registrasi_dosen: 2,
    };

    await updateDosenPengajarKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Dosen Pengajar Kelas Kuliah ID is required" });
  });

  it("should return 404 if dosen pengajar kelas kuliah is not found", async () => {
    const mockDosenPengajarKelasKuliahId = 1;
    req.params.id = mockDosenPengajarKelasKuliahId;
    req.body = {
      sks: 3,
      rencana_pertemuan: 14,
      id_registrasi_dosen: 2,
    };

    DosenPengajarKelasKuliah.findByPk.mockResolvedValue(null);

    await updateDosenPengajarKelasKuliahById(req, res, next);

    expect(DosenPengajarKelasKuliah.findByPk).toHaveBeenCalledWith(mockDosenPengajarKelasKuliahId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Dosen Pengajar Kelas Kuliah With ID ${mockDosenPengajarKelasKuliahId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    req.params.id = 1;
    req.body = {
      sks: 3,
      rencana_pertemuan: 14,
      id_registrasi_dosen: 2,
    };

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    DosenPengajarKelasKuliah.findByPk.mockRejectedValue(error);

    await updateDosenPengajarKelasKuliahById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
