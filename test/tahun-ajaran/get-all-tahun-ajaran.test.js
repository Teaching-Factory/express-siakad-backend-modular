const httpMocks = require("node-mocks-http");
const { getAllTahunAjaran } = require("../../src/controllers/tahun-ajaran");
const { TahunAjaran } = require("../../models");

jest.mock("../../models");

describe("getAllTahunAjaran", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil semua tahun ajaran dengan status 200 jika berhasil
  it("should return all tahun ajaran with status 200", async () => {
    const mockTahunAjaran = [
      { id: 1, name: "Tahun Ajaran 1" },
      { id: 2, name: "Tahun Ajaran 2" },
    ];
    TahunAjaran.findAll.mockResolvedValue(mockTahunAjaran);

    await getAllTahunAjaran(req, res, next);

    expect(TahunAjaran.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Tahun Ajaran Success",
      jumlahData: mockTahunAjaran.length,
      data: mockTahunAjaran,
    });
  });

  // Kode uji 2 - Mengembalikan respons 200 dengan data kosong jika tidak ada tahun ajaran ditemukan
  it("should return 200 with empty data if no tahun ajaran found", async () => {
    TahunAjaran.findAll.mockResolvedValue([]);

    await getAllTahunAjaran(req, res, next);

    expect(TahunAjaran.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Tahun Ajaran Success",
      jumlahData: 0,
      data: [],
    });
  });

  // Kode uji 3 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    TahunAjaran.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllTahunAjaran(req, res, next);

    expect(TahunAjaran.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
