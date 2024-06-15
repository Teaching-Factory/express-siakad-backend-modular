const { getDetailKelasKuliahByProdiAndSemesterId } = require("../../src/controllers/detail-kelas-kuliah");
const { DetailKelasKuliah, KelasKuliah, Semester, MataKuliah, Dosen, RuangPerkuliahan } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  DetailKelasKuliah: {
    findAll: jest.fn(),
  },
}));

describe("getDetailKelasKuliahByProdiAndSemesterId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return detail kelas kuliah by prodi and semester ID successfully", async () => {
    const prodiId = "7ea94a65-efc0-44ff-a0cb-00421a1e56bf";
    const semesterId = "20151";

    req.params.id_prodi = prodiId;
    req.params.id_semester = semesterId;

    const mockDetailKelasKuliah = [{ id: 1, prodiId, semesterId /* mock other data */ }];

    DetailKelasKuliah.findAll.mockResolvedValue(mockDetailKelasKuliah);

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getDetailKelasKuliahByProdiAndSemesterId(req, res, next);

    expect(DetailKelasKuliah.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: KelasKuliah,
          where: {
            id_prodi: prodiId,
            id_semester: semesterId,
          },
          include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }],
        },
        { model: RuangPerkuliahan },
      ],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Detail Kelas Kuliah By ID Prodi ${prodiId} And ID Semester ${semesterId} Success:`,
      jumlahData: mockDetailKelasKuliah.length,
      data: mockDetailKelasKuliah,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if detail kelas kuliah not found", async () => {
    const prodiId = "7ea94a65b-00421a1e56bf";
    const semesterId = "151";

    req.params.id_prodi = prodiId;
    req.params.id_semester = semesterId;

    DetailKelasKuliah.findAll.mockResolvedValue([]);

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getDetailKelasKuliahByProdiAndSemesterId(req, res, next);

    expect(DetailKelasKuliah.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: KelasKuliah,
          where: {
            id_prodi: prodiId,
            id_semester: semesterId,
          },
          include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }],
        },
        { model: RuangPerkuliahan },
      ],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Detail Kelas Kuliah With ID Prodi ${prodiId} And ID Semester ${semesterId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if prodi ID or semester ID is not provided", async () => {
    req.params.id_prodi = null;
    req.params.id_semester = null;

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getDetailKelasKuliahByProdiAndSemesterId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
