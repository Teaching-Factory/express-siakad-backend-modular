const httpMocks = require("node-mocks-http");
const { getAllSkalaPenilaianDosenBySemesterId } = require("../../src/controllers/skala-penilaian-dosen");
const { SkalaPenilaianDosen, Semester } = require("../../models");

jest.mock("../../models");

describe("getAllSkalaPenilaianDosenBySemesterId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if semester ID is not provided", async () => {
    req.params.id_semester = undefined;

    await getAllSkalaPenilaianDosenBySemesterId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Semester ID is required"
    });
    expect(SkalaPenilaianDosen.findAll).not.toHaveBeenCalled();
  });

  it("should return all skala_penilaian_dosen for given semester ID with 200 status", async () => {
    const semesterId = 1;
    req.params.id_semester = semesterId;

    const mockSkalaPenilaianDosen = [
      { id: 1, nama: "Skala 1", id_semester: semesterId, Semester: { id: semesterId, nama: "Semester 1" } },
      { id: 2, nama: "Skala 2", id_semester: semesterId, Semester: { id: semesterId, nama: "Semester 1" } }
    ];

    SkalaPenilaianDosen.findAll.mockResolvedValue(mockSkalaPenilaianDosen);

    await getAllSkalaPenilaianDosenBySemesterId(req, res, next);

    expect(SkalaPenilaianDosen.findAll).toHaveBeenCalledWith({
      where: { id_semester: semesterId },
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET All Skala Penilaian Dosen By Semester ID ${semesterId} Success`,
      jumlahData: mockSkalaPenilaianDosen.length,
      data: mockSkalaPenilaianDosen
    });
  });

  it("should return empty array if no skala_penilaian_dosen found for given semester ID", async () => {
    const semesterId = 2;
    req.params.id_semester = semesterId;

    SkalaPenilaianDosen.findAll.mockResolvedValue([]);

    await getAllSkalaPenilaianDosenBySemesterId(req, res, next);

    expect(SkalaPenilaianDosen.findAll).toHaveBeenCalledWith({
      where: { id_semester: semesterId },
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET All Skala Penilaian Dosen By Semester ID ${semesterId} Success`,
      jumlahData: 0,
      data: []
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const semesterId = 1;
    req.params.id_semester = semesterId;

    SkalaPenilaianDosen.findAll.mockRejectedValue(error);

    await getAllSkalaPenilaianDosenBySemesterId(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
