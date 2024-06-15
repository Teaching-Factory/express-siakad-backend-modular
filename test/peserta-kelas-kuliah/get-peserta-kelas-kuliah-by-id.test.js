const { getPesertaKelasKuliahById } = require("../../src/controllers/peserta-kelas-kuliah");
const { PesertaKelasKuliah } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getPesertaKelasKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return peserta kelas kuliah by ID with status 200", async () => {
    const mockPesertaKelasKuliahData = {
      id: 1,
      KelasKuliah: { id: 1, nama_kelas: "Kelas A" },
      Mahasiswa: { id: 1, nama: "John Doe" },
    };

    req.params.id = 1;
    jest.spyOn(PesertaKelasKuliah, "findByPk").mockResolvedValue(mockPesertaKelasKuliahData);

    await getPesertaKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Peserta Kelas Kuliah By ID 1 Success:`,
      data: mockPesertaKelasKuliahData,
    });
  });

  it("should return 400 if ID is not provided", async () => {
    req.params.id = undefined;

    await getPesertaKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Peserta Kelas Kuliah ID is required",
    });
  });

  it("should return 404 if peserta kelas kuliah not found", async () => {
    pesertaKelasKuliahId = "s";
    req.params.id = pesertaKelasKuliahId;
    jest.spyOn(PesertaKelasKuliah, "findByPk").mockResolvedValue(null);

    await getPesertaKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Peserta Kelas Kuliah With ID ${pesertaKelasKuliahId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    req.params.id = 1;
    jest.spyOn(PesertaKelasKuliah, "findByPk").mockRejectedValue(new Error(errorMessage));

    await getPesertaKelasKuliahById(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
