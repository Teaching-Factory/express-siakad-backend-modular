const httpMocks = require("node-mocks-http");
const { getAllSemesterAktif } = require("../../src/controllers/semester-aktif");
const { SemesterAktif, Semester } = require("../../models");

jest.mock("../../models");

describe("getAllSemesterAktif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all semester_aktifs with status 200", async () => {
    const mockSemesterAktifs = [
      {
        id: 1,
        nama: "Semester 1",
        Semester: {
          id: 1,
          nama: "2023/2024",
        },
      },
      {
        id: 2,
        nama: "Semester 2",
        Semester: {
          id: 2,
          nama: "2024/2025",
        },
      },
    ];

    SemesterAktif.findAll.mockResolvedValue(mockSemesterAktifs);

    await getAllSemesterAktif(req, res, next);

    expect(SemesterAktif.findAll).toHaveBeenCalledWith({
      include: [{ model: Semester }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Semester Aktif Success",
      jumlahData: mockSemesterAktifs.length,
      data: mockSemesterAktifs,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SemesterAktif.findAll.mockRejectedValue(error);

    await getAllSemesterAktif(req, res, next);

    expect(SemesterAktif.findAll).toHaveBeenCalledWith({
      include: [{ model: Semester }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
