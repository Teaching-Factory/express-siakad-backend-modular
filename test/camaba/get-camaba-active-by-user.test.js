const httpMocks = require("node-mocks-http");
const { getCamabaActiveByUser } = require("../../src/controllers/camaba");
const { Role, UserRole, Camaba, ProdiCamaba, Prodi, PeriodePendaftaran, Semester, JenjangPendidikan } = require("../../models");

jest.mock("../../models");

describe("getCamabaActiveByUser", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      user: { id: 1, username: "camaba123" } // mock user
    });
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return camaba data with status 200 if user is Camaba", async () => {
    const mockRole = { id: 1, nama_role: "camaba" };
    const mockUserRole = { id_user: 1, id_role: 1 };
    const mockCamaba = {
      id: 1,
      nomor_daftar: "camaba123",
      PeriodePendaftaran: { id: 1, Semester: { id: 1, nama: "Semester 1" } },
      Prodi: { id: 1, JenjangPendidikan: { nama: "S1" } }
    };
    const mockProdiCamaba = [{ id_prodi: 1, Prodi: { id_prodi: 1, JenjangPendidikan: { nama: "S1" } } }];

    Role.findOne.mockResolvedValue(mockRole);
    UserRole.findOne.mockResolvedValue(mockUserRole);
    Camaba.findOne.mockResolvedValue(mockCamaba);
    ProdiCamaba.findAll.mockResolvedValue(mockProdiCamaba);

    await getCamabaActiveByUser(req, res, next);

    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "camaba" } });
    expect(UserRole.findOne).toHaveBeenCalledWith({ where: { id_user: 1, id_role: 1 } });
    expect(Camaba.findOne).toHaveBeenCalledWith({
      where: { nomor_daftar: "camaba123" },
      include: [
        { model: PeriodePendaftaran, include: [{ model: Semester }] },
        { model: Prodi, include: [{ model: JenjangPendidikan }] }
      ]
    });
    expect(ProdiCamaba.findAll).toHaveBeenCalledWith({
      where: { id_camaba: 1 },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Camaba Active Success:",
      data: mockCamaba,
      prodiCamaba: mockProdiCamaba
    });
  });

  it("should return 404 if user role camaba is not found", async () => {
    Role.findOne.mockResolvedValue(null);

    await getCamabaActiveByUser(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Role Camaba not found"
    });
  });

  it("should return 404 if Prodi Camaba data is not found", async () => {
    const mockRole = { id: 1, nama_role: "camaba" };
    const mockUserRole = { id_user: 1, id_role: 1 };
    const mockCamaba = {
      id: 1,
      nomor_daftar: "camaba123",
      PeriodePendaftaran: { id: 1, Semester: { id: 1, nama: "Semester 1" } },
      Prodi: { id: 1, JenjangPendidikan: { nama: "S1" } }
    };

    Role.findOne.mockResolvedValue(mockRole);
    UserRole.findOne.mockResolvedValue(mockUserRole);
    Camaba.findOne.mockResolvedValue(mockCamaba);
    ProdiCamaba.findAll.mockResolvedValue(null);

    await getCamabaActiveByUser(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Prodi Camaba Not Found:"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Role.findOne.mockRejectedValue(error);

    await getCamabaActiveByUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
