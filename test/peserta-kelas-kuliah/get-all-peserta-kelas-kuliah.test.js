const { getAllPesertaKelasKuliah } = require("../../src/controllers/peserta-kelas-kuliah");
const { PesertaKelasKuliah } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllPesertaKelasKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all peserta kelas kuliah with status 200", async () => {
    const mockPesertaKelasKuliahData = [
      {
        id: 1,
        KelasKuliah: { id: 1, nama_kelas: "Kelas A" },
        Mahasiswa: { id: 1, nama: "John Doe" },
      },
      {
        id: 2,
        KelasKuliah: { id: 2, nama_kelas: "Kelas B" },
        Mahasiswa: { id: 2, nama: "Jane Doe" },
      },
    ];

    jest.spyOn(PesertaKelasKuliah, "findAll").mockResolvedValue(mockPesertaKelasKuliahData);
    await getAllPesertaKelasKuliah(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Peserta Kelas Kuliah Success",
      jumlahData: mockPesertaKelasKuliahData.length,
      data: mockPesertaKelasKuliahData,
    });
  });

  it("should return 404 when no peserta kelas kuliah found", async () => {
    jest.spyOn(PesertaKelasKuliah, "findAll").mockResolvedValue([]);

    await getAllPesertaKelasKuliah(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Peserta Kelas Kuliah Not Found",
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    jest.spyOn(PesertaKelasKuliah, "findAll").mockRejectedValue(new Error(errorMessage));

    await getAllPesertaKelasKuliah(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
