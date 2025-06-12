const httpMocks = require("node-mocks-http");
const { createPelimpahanMataKuliah } = require("../../src/modules/pelimpahan-mata-kuliah/controller");
const { PelimpahanMataKuliah, Dosen, KelasKuliah } = require("../../models");

jest.mock("../../models");

describe("createPelimpahanMataKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create pelimpahan mata kuliah and return 200", async () => {
    const mockDosenId = 1;
    const mockKelasKuliahId = 1;

    const mockDosen = { id_dosen: mockDosenId };
    const mockKelasKuliah = { id_matkul: mockKelasKuliahId };

    const mockNewPelimpahanMataKuliah = {
      id: 1,
      id_dosen: mockDosen.id_dosen,
      id_matkul: mockKelasKuliah.id_matkul,
    };

    req.params.id_dosen = mockDosenId;
    req.params.id_kelas_kuliah = mockKelasKuliahId;

    // Mock untuk Dosen.findByPk
    Dosen.findByPk.mockResolvedValue(mockDosen);

    // Mock untuk KelasKuliah.findByPk
    KelasKuliah.findByPk.mockResolvedValue(mockKelasKuliah);

    // Mock untuk PelimpahanMataKuliah.create
    PelimpahanMataKuliah.create.mockResolvedValue(mockNewPelimpahanMataKuliah);

    await createPelimpahanMataKuliah(req, res, next);

    // Memastikan bahwa findByPk dipanggil dengan nilai yang benar
    expect(Dosen.findByPk).toHaveBeenCalledWith(mockDosenId);
    expect(KelasKuliah.findByPk).toHaveBeenCalledWith(mockKelasKuliahId);

    // Memastikan respons sesuai dengan yang diharapkan
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Pelimpahan Mata Kuliah Success",
      data: {
        id: mockNewPelimpahanMataKuliah.id,
        id_dosen: mockNewPelimpahanMataKuliah.id_dosen,
        id_matkul: mockNewPelimpahanMataKuliah.id_matkul,
      },
    });
  });

  it("should return 400 if dosen ID is not provided", async () => {
    req.params.id_kelas_kuliah = 1;

    await createPelimpahanMataKuliah(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Dosen ID is required",
    });
    expect(Dosen.findByPk).not.toHaveBeenCalled();
    expect(KelasKuliah.findByPk).not.toHaveBeenCalled();
    expect(PelimpahanMataKuliah.create).not.toHaveBeenCalled();
  });

  it("should return 400 if kelas kuliah ID is not provided", async () => {
    req.params.id_dosen = 1;

    await createPelimpahanMataKuliah(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah ID is required",
    });
    expect(Dosen.findByPk).not.toHaveBeenCalled();
    expect(KelasKuliah.findByPk).not.toHaveBeenCalled();
    expect(PelimpahanMataKuliah.create).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id_dosen = 1;
    req.params.id_kelas_kuliah = 1;

    Dosen.findByPk.mockRejectedValue(error);

    await createPelimpahanMataKuliah(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
