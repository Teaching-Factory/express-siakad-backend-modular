const httpMocks = require("node-mocks-http");
const { getAllSkalaPenilaianDosen } = require("../../src/modules/skala-penilaian-dosen/controller");
const { SkalaPenilaianDosen, Semester } = require("../../models");

jest.mock("../../models");

describe("getAllSkalaPenilaianDosen", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all skala_penilaian_dosen with 200 status", async () => {
    const mockSkalaPenilaianDosen = [
      { id: 1, nama: "Skala 1", Semester: { id: 1, nama: "Semester 1" } },
      { id: 2, nama: "Skala 2", Semester: { id: 2, nama: "Semester 2" } }
    ];

    SkalaPenilaianDosen.findAll.mockResolvedValue(mockSkalaPenilaianDosen);

    await getAllSkalaPenilaianDosen(req, res, next);

    expect(SkalaPenilaianDosen.findAll).toHaveBeenCalledWith({
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Skala Penilaian Dosen Success",
      jumlahData: mockSkalaPenilaianDosen.length,
      data: mockSkalaPenilaianDosen
    });
  });

  it("should return empty array if no skala_penilaian_dosen found", async () => {
    SkalaPenilaianDosen.findAll.mockResolvedValue([]);

    await getAllSkalaPenilaianDosen(req, res, next);

    expect(SkalaPenilaianDosen.findAll).toHaveBeenCalledWith({
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Skala Penilaian Dosen Success",
      jumlahData: 0,
      data: []
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SkalaPenilaianDosen.findAll.mockRejectedValue(error);

    await getAllSkalaPenilaianDosen(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
