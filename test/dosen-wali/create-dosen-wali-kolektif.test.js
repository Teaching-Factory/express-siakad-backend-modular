const httpMocks = require("node-mocks-http");
const { createDosenWaliKolektif } = require("../../src/modules/dosen-wali/controller");
const { DosenWali, TahunAjaran } = require("../../models");

jest.mock("../../models");

describe("createDosenWaliKolektif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create dosen wali kolektif and return 201", async () => {
    const mockDosenId = 1;
    const mockMahasiswas = [{ id_registrasi_mahasiswa: 1 }, { id_registrasi_mahasiswa: 2 }, { id_registrasi_mahasiswa: 3 }];
    const mockTahunAjaran = { id_tahun_ajaran: 1 };

    req.params.id_dosen = mockDosenId;
    req.body = { mahasiswas: mockMahasiswas };

    TahunAjaran.findOne.mockResolvedValue(mockTahunAjaran);
    DosenWali.create.mockImplementation(async (data) => ({
      ...data,
      id_dosen_wali: 1, // Example id_dosen_wali for mock
    }));

    await createDosenWaliKolektif(req, res, next);

    expect(TahunAjaran.findOne).toHaveBeenCalledWith({
      where: { a_periode: 1 },
    });

    expect(DosenWali.create).toHaveBeenCalledTimes(mockMahasiswas.length);
    for (const mahasiswa of mockMahasiswas) {
      expect(DosenWali.create).toHaveBeenCalledWith({
        id_dosen: mockDosenId,
        id_registrasi_mahasiswa: mahasiswa.id_registrasi_mahasiswa,
        id_tahun_ajaran: mockTahunAjaran.id_tahun_ajaran,
      });
    }

    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Dosen Wali Kolektif Success =====>",
      data: expect.any(Array),
    });
  });

  it("should return 400 if dosen ID is missing", async () => {
    req.body = { mahasiswas: [{ id_registrasi_mahasiswa: 1 }] };

    await createDosenWaliKolektif(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Dosen ID is required",
    });
    expect(TahunAjaran.findOne).not.toHaveBeenCalled();
    expect(DosenWali.create).not.toHaveBeenCalled();
  });

  it("should return 404 if active academic year is not found", async () => {
    const mockDosenId = 1;
    req.params.id_dosen = mockDosenId;
    req.body = { mahasiswas: [{ id_registrasi_mahasiswa: 1 }] };

    TahunAjaran.findOne.mockResolvedValue(null);

    await createDosenWaliKolektif(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Tahun ajaran tidak ditemukan",
    });
    expect(DosenWali.create).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockDosenId = 1;
    req.params.id_dosen = mockDosenId;
    req.body = { mahasiswas: [{ id_registrasi_mahasiswa: 1 }] };

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    TahunAjaran.findOne.mockRejectedValue(error);

    await createDosenWaliKolektif(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(DosenWali.create).not.toHaveBeenCalled();
  });
});
