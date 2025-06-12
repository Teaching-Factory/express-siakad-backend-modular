const httpMocks = require("node-mocks-http");
const { getAllSemester } = require("../../src/modules/semester/controller");
const { Semester } = require("../../models");

jest.mock("../../models");

describe("getAllSemester", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan semua semester dengan status 200 jika berhasil
  it("should return all semesters with status 200 if successful", async () => {
    const mockSemesters = [
      { id: 1, name: "Semester 1" },
      { id: 2, name: "Semester 2" },
    ];
    Semester.findAll.mockResolvedValue(mockSemesters);

    await getAllSemester(req, res, next);

    expect(Semester.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Semester Success",
      jumlahData: mockSemesters.length,
      data: mockSemesters,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    Semester.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllSemester(req, res, next);

    expect(Semester.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
