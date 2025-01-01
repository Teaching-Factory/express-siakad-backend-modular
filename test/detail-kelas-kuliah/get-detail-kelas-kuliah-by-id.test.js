const { getDetailKelasKuliahById } = require("../../src/controllers/detail-kelas-kuliah");
const { DetailKelasKuliah, KelasKuliah, Semester, MataKuliah, Dosen, RuangPerkuliahan, Prodi } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  DetailKelasKuliah: {
    findByPk: jest.fn(),
  },
}));

describe("getDetailKelasKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return detail kelas kuliah by ID successfully", async () => {
    const detailKelasKuliahId = 1;
    req.params.id = detailKelasKuliahId;

    const mockDetailKelasKuliah = {
      id: detailKelasKuliahId,
      nama_kelas_kuliah: "Test Class",
      KelasKuliah: {
        id: 1,
        Semester: { id: "20151" },
        MataKuliah: { id: "7ea94a65-efc0-44ff-a0cb-00421a1e56bf" },
        Dosen: { id: "dosen1" },
        RuangPerkuliahan: { id: "ruang1" },
      },
    };

    DetailKelasKuliah.findByPk.mockResolvedValue(mockDetailKelasKuliah);

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getDetailKelasKuliahById(req, res, next);

    expect(DetailKelasKuliah.findByPk).toHaveBeenCalledWith(detailKelasKuliahId, {
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah, include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }, { model: Prodi }] }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Detail Kelas Kuliah By ID ${detailKelasKuliahId} Success:`,
      data: mockDetailKelasKuliah,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if detail kelas kuliah not found", async () => {
    const detailKelasKuliahId = 1;
    req.params.id = detailKelasKuliahId;

    DetailKelasKuliah.findByPk.mockResolvedValue(null);

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getDetailKelasKuliahById(req, res, next);

    expect(DetailKelasKuliah.findByPk).toHaveBeenCalledWith(detailKelasKuliahId, {
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah, include: [{ model: Semester }, { model: MataKuliah }, { model: Dosen }, { model: Prodi }] }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Detail Kelas Kuliah With ID ${detailKelasKuliahId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if detail kelas kuliah ID is not provided", async () => {
    req.params.id = null;

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await getDetailKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Detail Kelas Kuliah ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
