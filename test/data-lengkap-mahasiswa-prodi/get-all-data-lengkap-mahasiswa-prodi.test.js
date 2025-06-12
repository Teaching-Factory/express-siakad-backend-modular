const httpMocks = require("node-mocks-http");
const { getAllDataLengkapMahasiswaProdi } = require("../../src/modules/data-lengkap-mahasiswa-prodi/controller");
const { DataLengkapMahasiswaProdi } = require("../../models");

jest.mock("../../models");

describe("getAllDataLengkapMahasiswaProdi", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan semua data lengkap mahasiswa prodi
  it("should return all data lengkap mahasiswa prodi with status 200 if found", async () => {
    const mockDataLengkap = [
      {
        id: 1,
        nama: "John Doe",
        prodiId: 1,
        semesterId: 1,
        mahasiswaId: 1,
        agamaId: 1,
        wilayahId: 1,
        jenisTinggalId: 1,
        alatTransportasiId: 1,
        jenjangPendidikanId: 1,
        pekerjaanId: 1,
        penghasilanId: 1,
        kebutuhanKhususId: 1,
        perguruanTinggiId: 1,
      },
      {
        id: 2,
        nama: "Jane Doe",
        prodiId: 2,
        semesterId: 1,
        mahasiswaId: 2,
        agamaId: 2,
        wilayahId: 2,
        jenisTinggalId: 2,
        alatTransportasiId: 2,
        jenjangPendidikanId: 2,
        pekerjaanId: 2,
        penghasilanId: 2,
        kebutuhanKhususId: 2,
        perguruanTinggiId: 2,
      },
    ];

    DataLengkapMahasiswaProdi.findAll.mockResolvedValue(mockDataLengkap);

    await getAllDataLengkapMahasiswaProdi(req, res);

    expect(DataLengkapMahasiswaProdi.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Data Lengkap Mahasiswa Prodi Success",
      jumlahData: mockDataLengkap.length,
      data: mockDataLengkap,
    });
  });

  // Kode uji 2 - menangani kesalahan saat terjadi kesalahan database
  it("should handle errors", async () => {
    const errorMessage = "Database error";

    DataLengkapMahasiswaProdi.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllDataLengkapMahasiswaProdi(req, res, next);

    expect(DataLengkapMahasiswaProdi.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
