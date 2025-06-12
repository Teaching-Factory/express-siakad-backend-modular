const httpMocks = require("node-mocks-http");
const { getAllAspekPenilaianDosenBySemesterId } = require("../../src/modules/aspek-penilaian-dosen/controller");
const { AspekPenilaianDosen, Semester } = require("../../models");

jest.mock("../../models");

describe("getAllAspekPenilaianDosenBySemesterId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all aspek_penilaian_dosens for a given semester with status 200", async () => {
    // Setup mock data
    const mockAspekPenilaianDosens = [
      {
        id: 1,
        nama_aspek: "Aspek 1",
        id_semester: 1,
        Semester: { id: 1, nama_semester: "Semester 1" },
        nomor_urut_aspek: 1
      },
      {
        id: 2,
        nama_aspek: "Aspek 2",
        id_semester: 1,
        Semester: { id: 1, nama_semester: "Semester 1" },
        nomor_urut_aspek: 2
      }
    ];

    // Set up mock implementation
    AspekPenilaianDosen.findAll.mockResolvedValue(mockAspekPenilaianDosens);

    // Set request parameters
    req.params.id_semester = 1;

    // Call the controller function
    await getAllAspekPenilaianDosenBySemesterId(req, res, next);

    // Assertions
    expect(AspekPenilaianDosen.findAll).toHaveBeenCalledWith({
      where: {
        id_semester: 1
      },
      include: [{ model: Semester }],
      order: [["nomor_urut_aspek", "ASC"]]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET All Aspek Penilaian Dosen By Semester ID 1 Success`,
      jumlahData: mockAspekPenilaianDosens.length,
      data: mockAspekPenilaianDosens
    });
  });

  it("should return 400 if semesterId is missing", async () => {
    // Call the controller function without setting id_semester
    await getAllAspekPenilaianDosenBySemesterId(req, res, next);

    // Assertions
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Semester ID is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    AspekPenilaianDosen.findAll.mockRejectedValue(error);

    // Set request parameters
    req.params.id_semester = 1;

    // Call the controller function
    await getAllAspekPenilaianDosenBySemesterId(req, res, next);

    // Assertions
    expect(AspekPenilaianDosen.findAll).toHaveBeenCalledWith({
      where: {
        id_semester: 1
      },
      include: [{ model: Semester }],
      order: [["nomor_urut_aspek", "ASC"]]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
