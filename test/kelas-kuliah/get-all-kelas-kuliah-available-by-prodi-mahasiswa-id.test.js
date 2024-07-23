const httpMocks = require("node-mocks-http");
const { getAllKelasKuliahAvailableByProdiMahasiswaId } = require("../../src/controllers/kelas-kuliah");
const { Mahasiswa, KelasKuliah, PesertaKelasKuliah, Prodi, Semester, MataKuliah, Dosen, SemesterAktif } = require("../../models");

jest.mock("../../models");

describe("getAllKelasKuliahAvailableByProdiMahasiswaId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      params: {
        id_registrasi_mahasiswa: 1,
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 404 if mahasiswa not found", async () => {
    Mahasiswa.findByPk.mockResolvedValue(null);

    await getAllKelasKuliahAvailableByProdiMahasiswaId(req, res, next);

    expect(Mahasiswa.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Mahasiswa not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if semester aktif not found", async () => {
    const mockMahasiswa = { id_prodi: 1 };
    Mahasiswa.findByPk.mockResolvedValue(mockMahasiswa);
    SemesterAktif.findOne.mockResolvedValue(null);

    await getAllKelasKuliahAvailableByProdiMahasiswaId(req, res, next);

    expect(Mahasiswa.findByPk).toHaveBeenCalledWith(1);
    expect(SemesterAktif.findOne).toHaveBeenCalledWith({
      where: { status: true },
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Semester Aktif not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if no kelas kuliah found", async () => {
    const mockMahasiswa = { id_prodi: 1 };
    const mockSemesterAktif = { id_semester: 1 };
    Mahasiswa.findByPk.mockResolvedValue(mockMahasiswa);
    SemesterAktif.findOne.mockResolvedValue(mockSemesterAktif);
    KelasKuliah.findAll.mockResolvedValue([]);

    await getAllKelasKuliahAvailableByProdiMahasiswaId(req, res, next);

    expect(Mahasiswa.findByPk).toHaveBeenCalledWith(1);
    expect(SemesterAktif.findOne).toHaveBeenCalledWith({
      where: { status: true },
    });
    expect(KelasKuliah.findAll).toHaveBeenCalledWith({
      where: { id_prodi: mockMahasiswa.id_prodi, id_semester: mockSemesterAktif.id_semester },
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== No Kelas Kuliah Found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return available kelas kuliah if found", async () => {
    const mockMahasiswa = { id_prodi: 1 };
    const mockSemesterAktif = { id_semester: 1 };
    const mockKelasKuliah = [
      { id_kelas_kuliah: 1, jumlah_mahasiswa: 30 },
      { id_kelas_kuliah: 2, jumlah_mahasiswa: 25 },
    ];
    const mockFilteredKelasKuliah = [{ id_kelas_kuliah: 1, jumlah_mahasiswa: 30 }];

    Mahasiswa.findByPk.mockResolvedValue(mockMahasiswa);
    SemesterAktif.findOne.mockResolvedValue(mockSemesterAktif);
    KelasKuliah.findAll.mockResolvedValue(mockKelasKuliah);
    PesertaKelasKuliah.count
      .mockResolvedValueOnce(20) // untuk id_kelas_kuliah: 1
      .mockResolvedValueOnce(30); // untuk id_kelas_kuliah: 2

    await getAllKelasKuliahAvailableByProdiMahasiswaId(req, res, next);

    expect(Mahasiswa.findByPk).toHaveBeenCalledWith(1);
    expect(SemesterAktif.findOne).toHaveBeenCalledWith({
      where: { status: true },
    });
    expect(KelasKuliah.findAll).toHaveBeenCalledWith({
      where: { id_prodi: mockMahasiswa.id_prodi, id_semester: mockSemesterAktif.id_semester },
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
      data: [mockFilteredKelasKuliah[0]],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
