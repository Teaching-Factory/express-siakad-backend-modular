const httpMocks = require("node-mocks-http");
const { getAllDetailKelasKuliahBySemesterAndDosenActive } = require("../../src/modules/detail-kelas-kuliah/controller");
const { Dosen, DetailKelasKuliah, KelasKuliah, Semester, Prodi, RuangPerkuliahan, MataKuliah } = require("../../models");

jest.mock("../../models");

describe("getAllDetailKelasKuliahBySemesterAndDosenActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all detail kelas kuliah by semester and dosen active with status 200 if successful", async () => {
    const mockSemesterId = 1;
    const mockUser = { username: "dosen123" };
    const mockDosen = { id_dosen: 1, nidn: "dosen123" };
    const mockDetailKelasKuliahs = [{ id: 1 }, { id: 2 }];

    Dosen.findOne.mockResolvedValue(mockDosen);
    DetailKelasKuliah.findAll.mockResolvedValue(mockDetailKelasKuliahs);

    req.params.id_semester = mockSemesterId;
    req.user = mockUser;

    await getAllDetailKelasKuliahBySemesterAndDosenActive(req, res, next);

    expect(Dosen.findOne).toHaveBeenCalledWith({
      where: { nidn: mockUser.username },
    });

    expect(DetailKelasKuliah.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: KelasKuliah,
          where: {
            id_semester: mockSemesterId,
            id_dosen: mockDosen.id_dosen,
          },
          include: [{ model: Semester }, { model: Prodi }, { model: MataKuliah }],
        },
        { model: RuangPerkuliahan },
      ],
    });

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Detail Kelas Kuliah By Semester And Dosen Active Success",
      jumlahData: mockDetailKelasKuliahs.length,
      data: mockDetailKelasKuliahs,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if dosen is not found", async () => {
    const mockSemesterId = 1;
    const mockUser = { username: "dosen123" };

    Dosen.findOne.mockResolvedValue(null);

    req.params.id_semester = mockSemesterId;
    req.user = mockUser;

    await getAllDetailKelasKuliahBySemesterAndDosenActive(req, res, next);

    expect(Dosen.findOne).toHaveBeenCalledWith({
      where: { nidn: mockUser.username },
    });

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Dosen not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if there is an error on the server", async () => {
    const mockSemesterId = 1;
    const mockUser = { username: "dosen123" };
    const errorMessage = "Database error";

    Dosen.findOne.mockRejectedValue(new Error(errorMessage));

    req.params.id_semester = mockSemesterId;
    req.user = mockUser;

    await getAllDetailKelasKuliahBySemesterAndDosenActive(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
