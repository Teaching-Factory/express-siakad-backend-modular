const httpMocks = require("node-mocks-http");
const { getAllAspekPenilaianDosen } = require("../../src/controllers/aspek-penilaian-dosen");
const { AspekPenilaianDosen, Semester } = require("../../models");

jest.mock("../../models");

describe("getAllAspekPenilaianDosen", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all aspek_penilaian_dosens with status 200", async () => {
    // Setup mock data
    const mockAspekPenilaianDosens = [
      {
        id: 1,
        nama_aspek: "Aspek 1",
        Semester: { id: 1, nama_semester: "Semester 1" }
      },
      {
        id: 2,
        nama_aspek: "Aspek 2",
        Semester: { id: 2, nama_semester: "Semester 2" }
      }
    ];

    // Set up mock implementation
    AspekPenilaianDosen.findAll.mockResolvedValue(mockAspekPenilaianDosens);

    // Call the controller function
    await getAllAspekPenilaianDosen(req, res, next);

    // Assertions
    expect(AspekPenilaianDosen.findAll).toHaveBeenCalledWith({
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Aspek Penilaian Dosen Success",
      jumlahData: mockAspekPenilaianDosens.length,
      data: mockAspekPenilaianDosens
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    AspekPenilaianDosen.findAll.mockRejectedValue(error);

    // Call the controller function
    await getAllAspekPenilaianDosen(req, res, next);

    // Assertions
    expect(AspekPenilaianDosen.findAll).toHaveBeenCalledWith({
      include: [{ model: Semester }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
