const httpMocks = require("node-mocks-http");
const { getSkalaPenilaianDosenById } = require("../../src/controllers/skala-penilaian-dosen");
const { SkalaPenilaianDosen, Semester } = require("../../models");

jest.mock("../../models");

describe("getSkalaPenilaianDosenById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if Skala Penilaian Dosen ID is not provided", async () => {
    req.params.id = undefined;

    await getSkalaPenilaianDosenById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Skala Penilaian Dosen ID is required"
    });
    expect(SkalaPenilaianDosen.findByPk).not.toHaveBeenCalled();
  });

  it("should return 200 and the skala_penilaian_dosen if found", async () => {
    const skalaPenilaianDosenId = 1;
    req.params.id = skalaPenilaianDosenId;

    const mockSkalaPenilaianDosen = {
      id: skalaPenilaianDosenId,
      nama: "Skala 1",
      id_semester: 1,
      Semester: { id: 1, nama: "Semester 1" }
    };

    SkalaPenilaianDosen.findByPk.mockResolvedValue(mockSkalaPenilaianDosen);

    await getSkalaPenilaianDosenById(req, res, next);

    expect(SkalaPenilaianDosen.findByPk).toHaveBeenCalledWith(skalaPenilaianDosenId, {
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Skala Penilaian Dosen By ID ${skalaPenilaianDosenId} Success:`,
      data: mockSkalaPenilaianDosen
    });
  });

  it("should return 404 if skala_penilaian_dosen is not found", async () => {
    const skalaPenilaianDosenId = 999;
    req.params.id = skalaPenilaianDosenId;

    SkalaPenilaianDosen.findByPk.mockResolvedValue(null);

    await getSkalaPenilaianDosenById(req, res, next);

    expect(SkalaPenilaianDosen.findByPk).toHaveBeenCalledWith(skalaPenilaianDosenId, {
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Skala Penilaian Dosen With ID ${skalaPenilaianDosenId} Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const skalaPenilaianDosenId = 1;
    req.params.id = skalaPenilaianDosenId;

    SkalaPenilaianDosen.findByPk.mockRejectedValue(error);

    await getSkalaPenilaianDosenById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
