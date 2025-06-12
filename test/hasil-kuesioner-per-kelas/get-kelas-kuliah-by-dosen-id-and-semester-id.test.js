const { KelasKuliah, MataKuliah, DetailKelasKuliah, RuangPerkuliahan } = require("../../models");
const httpMocks = require("node-mocks-http");
const { getKelasKuliahByDosenIdAndSemesterId } = require("../../src/modules/hasil-kuesioner-per-kelas/controller");

describe("getKelasKuliahByDosenIdAndSemesterId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kasus uji 1 - Berhasil mendapatkan data kelas kuliah
  it("should return 200 and the kelas kuliah data when successful", async () => {
    req.query.id_semester = 1;
    req.query.id_dosen = 2;

    const mockKelasKuliah = [
      {
        id: 1,
        id_dosen: 2,
        id_semester: 1,
        MataKuliah: { id: 101, nama: "Matematika" },
        DetailKelasKuliah: [{ id: 201, RuangPerkuliahan: { nama_ruang: "Ruang 101" } }],
      },
    ];

    jest.spyOn(KelasKuliah, "findAll").mockResolvedValue(mockKelasKuliah);

    await getKelasKuliahByDosenIdAndSemesterId(req, res, next);

    expect(KelasKuliah.findAll).toHaveBeenCalledWith({
      where: { id_dosen: 2, id_semester: 1 },
      include: [{ model: MataKuliah }, { model: DetailKelasKuliah, include: [{ model: RuangPerkuliahan }] }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Kelas Kuliah By Dosen ID 2 And Semester ID 1 Success:",
      jumlahData: mockKelasKuliah.length,
      dataKelasKuliah: mockKelasKuliah,
    });
  });

  // Kasus uji 2 - id_semester tidak diberikan
  it("should return 400 if id_semester is not provided", async () => {
    req.query.id_semester = undefined;
    req.query.id_dosen = 2;

    await getKelasKuliahByDosenIdAndSemesterId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_semester is required",
    });
  });

  // Kasus uji 3 - id_dosen tidak diberikan
  it("should return 400 if id_dosen is not provided", async () => {
    req.query.id_semester = 1;
    req.query.id_dosen = undefined;

    await getKelasKuliahByDosenIdAndSemesterId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_dosen is required",
    });
  });

  // Kasus uji 4 - Tidak ada data kelas kuliah ditemukan
  it("should return 404 if no kelas kuliah data found", async () => {
    req.query.id_semester = 1;
    req.query.id_dosen = 2;

    jest.spyOn(KelasKuliah, "findAll").mockResolvedValue([]);

    await getKelasKuliahByDosenIdAndSemesterId(req, res, next);

    expect(KelasKuliah.findAll).toHaveBeenCalledWith({
      where: { id_dosen: 2, id_semester: 1 },
      include: [{ model: MataKuliah }, { model: DetailKelasKuliah, include: [{ model: RuangPerkuliahan }] }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Kelas Kuliah With Dosen ID 2 And Semester ID 1 Not Found:",
    });
  });

  // Kasus uji 5 - Penanganan error
  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Something went wrong");
    jest.spyOn(KelasKuliah, "findAll").mockRejectedValue(mockError);

    req.query.id_semester = 1;
    req.query.id_dosen = 2;

    await getKelasKuliahByDosenIdAndSemesterId(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
