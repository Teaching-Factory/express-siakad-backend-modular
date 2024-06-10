const httpMocks = require("node-mocks-http");
const { getPenugasanDosenById } = require("../../src/controllers/penugasan-dosen");
const { PenugasanDosen, Dosen, TahunAjaran, PerguruanTinggi, Prodi } = require("../../models");

jest.mock("../../models");

describe("getPenugasanDosenById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan data penugasan dosen berdasarkan ID jika berhasil
  it("should return the assignment of lecturer based on ID if successful", async () => {
    const mockPenugasanDosen = { id: 1, nama: "Penugasan Dosen 1" };
    const PenugasanDosenId = 1;
    req.params.id = PenugasanDosenId;
    PenugasanDosen.findByPk.mockResolvedValue(mockPenugasanDosen);

    await getPenugasanDosenById(req, res, next);

    expect(PenugasanDosen.findByPk).toHaveBeenCalledWith(PenugasanDosenId, {
      include: [{ model: Dosen }, { model: TahunAjaran }, { model: PerguruanTinggi }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Penugasan Dosen By ID ${PenugasanDosenId} Success:`,
      data: mockPenugasanDosen,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 404 jika data penugasan dosen tidak ditemukan
  it("should return 404 if assignment of lecturer is not found", async () => {
    const PenugasanDosenId = 999;
    req.params.id = PenugasanDosenId;
    PenugasanDosen.findByPk.mockResolvedValue(null);

    await getPenugasanDosenById(req, res, next);

    expect(PenugasanDosen.findByPk).toHaveBeenCalledWith(PenugasanDosenId, {
      include: [{ model: Dosen }, { model: TahunAjaran }, { model: PerguruanTinggi }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Penugasan Dosen With ID ${PenugasanDosenId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - Mengembalikan respons 400 jika ID penugasan dosen tidak disediakan
  it("should return 400 if assignment of lecturer ID is not provided", async () => {
    req.params.id = null;

    await getPenugasanDosenById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Penugasan Dosen ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 4 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const PenugasanDosenId = 1;
    req.params.id = PenugasanDosenId;
    const errorMessage = "Database error";
    PenugasanDosen.findByPk.mockRejectedValue(new Error(errorMessage));

    await getPenugasanDosenById(req, res, next);

    expect(PenugasanDosen.findByPk).toHaveBeenCalledWith(PenugasanDosenId, {
      include: [{ model: Dosen }, { model: TahunAjaran }, { model: PerguruanTinggi }, { model: Prodi }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
