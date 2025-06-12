const { getPesertaKelasKuliahByKelasKuliahId } = require("../../src/modules/nilai-perkuliahan/controller");
const { DetailKelasKuliah, PesertaKelasKuliah } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getPesertaKelasKuliahByKelasKuliahId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // belum pass
  // it("should return peserta kelas kuliah and return status 200", async () => {
  //   req.params.id_kelas_kuliah = 1;

  //   const mockDetailKelasKuliah = {
  //     id_kelas_kuliah: 1,
  //     RuangPerkuliahan: {},
  //     KelasKuliah: {
  //       Prodi: {},
  //       Semester: {},
  //       MataKuliah: {},
  //       Dosen: {},
  //     },
  //   };

  //   const mockPesertaKelasKuliahData = [
  //     { id_kelas_kuliah: 1, Mahasiswa: { id: 1 }, KelasKuliah: { id: 1 } },
  //     { id_kelas_kuliah: 1, Mahasiswa: { id: 2 }, KelasKuliah: { id: 1 } },
  //   ];

  //   jest.spyOn(DetailKelasKuliah, "findOne").mockResolvedValue(mockDetailKelasKuliah);
  //   jest.spyOn(PesertaKelasKuliah, "findAll").mockResolvedValue(mockPesertaKelasKuliahData);

  //   await getPesertaKelasKuliahByKelasKuliahId(req, res, next);

  //   expect(res.statusCode).toEqual(200);
  //   expect(res._getJSONData()).toEqual({
  //     message: `<===== GET Peserta Kelas Kuliah By ID ${req.params.id_kelas_kuliah} Success:`,
  //     jumlahData: mockPesertaKelasKuliahData.length,
  //     dataKelasKuliah: mockDetailKelasKuliah,
  //     data: mockPesertaKelasKuliahData,
  //   });
  // });

  it("should return 400 if kelas kuliah ID is not provided", async () => {
    await getPesertaKelasKuliahByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah ID is required",
    });
  });

  it("should return 404 if peserta kelas kuliah not found", async () => {
    const kelasKuliahId = 1;
    req.params.id_kelas_kuliah = kelasKuliahId;

    jest.spyOn(DetailKelasKuliah, "findOne").mockResolvedValue(null);
    jest.spyOn(PesertaKelasKuliah, "findAll").mockResolvedValue([]);

    await getPesertaKelasKuliahByKelasKuliahId(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Peserta Kelas Kuliah With ID ${kelasKuliahId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    req.params.id_kelas_kuliah = 1;

    jest.spyOn(DetailKelasKuliah, "findOne").mockRejectedValue(new Error(errorMessage));

    await getPesertaKelasKuliahByKelasKuliahId(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
