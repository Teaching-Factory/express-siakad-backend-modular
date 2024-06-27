const httpMocks = require("node-mocks-http");
const { getAllKelasKuliahAvailableByProdiMahasiswa } = require("../../src/controllers/kelas-kuliah");
const { Mahasiswa, Periode, KelasKuliah, PesertaKelasKuliah, Prodi, Semester, MataKuliah, Dosen } = require("../../models");

jest.mock("../../models");

describe("getAllKelasKuliahAvailableByProdiMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      user: {
        username: "testuser",
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 404 if mahasiswa not found", async () => {
    Mahasiswa.findOne.mockResolvedValue(null);

    await getAllKelasKuliahAvailableByProdiMahasiswa(req, res, next);

    expect(Mahasiswa.findOne).toHaveBeenCalledWith({
      where: { nim: "testuser" },
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Mahasiswa not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if periode not found", async () => {
    const mockMahasiswa = { nim: "testuser", id_periode: 1 };
    Mahasiswa.findOne.mockResolvedValueOnce(mockMahasiswa);
    Periode.findOne.mockResolvedValueOnce(null);

    await getAllKelasKuliahAvailableByProdiMahasiswa(req, res, next);

    expect(Mahasiswa.findOne).toHaveBeenCalledWith({
      where: { nim: mockMahasiswa.nim },
    });

    expect(Periode.findOne).toHaveBeenCalledWith({
      where: { id_periode: mockMahasiswa.id_periode },
    });

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Periode not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if no kelas kuliah found", async () => {
    const mockMahasiswa = { id_periode: 1 };
    const mockPeriode = { id_prodi: 1 };
    Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);
    Periode.findOne.mockResolvedValue(mockPeriode);
    KelasKuliah.findAll.mockResolvedValue([]);

    await getAllKelasKuliahAvailableByProdiMahasiswa(req, res, next);

    expect(KelasKuliah.findAll).toHaveBeenCalledWith({
      where: { id_prodi: 1 },
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== No Kelas Kuliah Found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return available kelas kuliah if found", async () => {
    const mockMahasiswa = { id_periode: 1 };
    const mockPeriode = { id_prodi: 1 };
    const mockKelasKuliah = [
      { id_kelas_kuliah: 1, jumlah_mahasiswa: 30 },
      { id_kelas_kuliah: 2, jumlah_mahasiswa: 25 },
    ];
    const mockFilteredKelasKuliah = [{ id_kelas_kuliah: 1, jumlah_mahasiswa: 30 }];

    Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);
    Periode.findOne.mockResolvedValue(mockPeriode);
    KelasKuliah.findAll.mockResolvedValue(mockKelasKuliah);
    PesertaKelasKuliah.count.mockResolvedValueOnce(20).mockResolvedValueOnce(30);

    await getAllKelasKuliahAvailableByProdiMahasiswa(req, res, next);

    expect(KelasKuliah.findAll).toHaveBeenCalledWith({
      where: { id_prodi: 1 },
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });
    expect(PesertaKelasKuliah.count).toHaveBeenCalledWith({
      where: { id_kelas_kuliah: 1 },
    });
    expect(PesertaKelasKuliah.count).toHaveBeenCalledWith({
      where: { id_kelas_kuliah: 2 },
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Kelas Kuliah By Prodi Mahasiswa Success",
      jumlahData: 1,
      data: [mockKelasKuliah[0]],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
