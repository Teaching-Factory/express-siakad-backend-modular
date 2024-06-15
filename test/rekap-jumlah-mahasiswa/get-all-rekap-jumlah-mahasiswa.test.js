const httpMocks = require("node-mocks-http");
const { getAllRekapJumlahMahasiswa } = require("../../src/controllers/rekap-jumlah-mahasiswa");
const { RekapJumlahMahasiswa, Periode, Prodi } = require("../../models");

jest.mock("../../models");

describe("getAllRekapJumlahMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan semua data rekap jumlah mahasiswa
  it("should return all rekap jumlah mahasiswa with status 200 if found", async () => {
    const mockRekapJumlah = [
      { id: 1, jumlah_mahasiswa: 100, periodeId: 1, prodiId: 1 },
      { id: 2, jumlah_mahasiswa: 150, periodeId: 1, prodiId: 2 },
    ];

    RekapJumlahMahasiswa.findAll.mockResolvedValue(mockRekapJumlah);

    await getAllRekapJumlahMahasiswa(req, res, next);

    expect(RekapJumlahMahasiswa.findAll).toHaveBeenCalledWith({ include: [{ model: Periode }, { model: Prodi }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Rekap Jumlah Mahasiswa Success",
      jumlahData: mockRekapJumlah.length,
      data: mockRekapJumlah,
    });
  });

  // Kode uji 2 - menangani kasus ketika tidak ada data rekap jumlah mahasiswa
  it("should handle no rekap jumlah mahasiswa found", async () => {
    RekapJumlahMahasiswa.findAll.mockResolvedValue([]);

    await getAllRekapJumlahMahasiswa(req, res, next);

    expect(RekapJumlahMahasiswa.findAll).toHaveBeenCalledWith({ include: [{ model: Periode }, { model: Prodi }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Rekap Jumlah Mahasiswa Success",
      jumlahData: 0,
      data: [],
    });
  });

  // Kode uji 3 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should handle errors", async () => {
    const errorMessage = "Database error";

    RekapJumlahMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllRekapJumlahMahasiswa(req, res, next);

    expect(RekapJumlahMahasiswa.findAll).toHaveBeenCalledWith({ include: [{ model: Periode }, { model: Prodi }] });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
