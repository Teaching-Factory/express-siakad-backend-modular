const httpMocks = require("node-mocks-http");
const { getSemesterById } = require("../../src/modules/semester/controller");
const { Semester, TahunAjaran } = require("../../models");

jest.mock("../../models");

describe("getSemesterById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menguji dengan memasukkan data id semester yang valid
  it("should return semester data with status 200 if found", async () => {
    const semesterId = "19801";
    const mockSemester = {
      id: semesterId,
      nama_semester: "Semester 1",
      TahunAjaran: { nama: "Tahun Ajaran 1" },
    };

    Semester.findByPk.mockResolvedValue(mockSemester);

    req.params.id = semesterId;

    await getSemesterById(req, res, next);

    expect(Semester.findByPk).toHaveBeenCalledWith(semesterId, {
      include: [{ model: TahunAjaran }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Semester By ID ${semesterId} Success:`,
      data: mockSemester,
    });
  });

  // Kode uji 2 - menguji dengan memasukkan data id semester yang tidak valid
  it("should return 404 if semester is not found", async () => {
    const semesterId = "s"; // ID yang tidak ada
    const errorMessage = `<===== Semester With ID ${semesterId} Not Found:`;

    Semester.findByPk.mockResolvedValue(null);

    req.params.id = semesterId;

    await getSemesterById(req, res, next);

    expect(Semester.findByPk).toHaveBeenCalledWith(semesterId, {
      include: [{ model: TahunAjaran }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: errorMessage });
  });

  // Kode uji 3 - tidak memasukkan id semester pada parameter
  it("should return error response when id semester is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID semester dalam parameter

    await getSemesterById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Semester ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const semesterId = 1;
    const errorMessage = "Database error";

    Semester.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = semesterId;

    await getSemesterById(req, res, next);

    expect(Semester.findByPk).toHaveBeenCalledWith(semesterId, {
      include: [{ model: TahunAjaran }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
