const httpMocks = require("node-mocks-http");
const { getAllProdiCamabaActive } = require("../../src/controllers/prodi-camaba");
const { Role, UserRole, Camaba, ProdiCamaba, Prodi, JenjangPendidikan } = require("../../models");

jest.mock("../../models");

describe("getAllProdiCamabaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    req.user = { id: 1, username: "user123" }; // Mock user data
    jest.clearAllMocks();
  });

  it("should return 404 if Role Camaba not found", async () => {
    Role.findOne.mockResolvedValue(null);

    await getAllProdiCamabaActive(req, res, next);

    expect(Role.findOne).toHaveBeenCalledWith({
      where: { nama_role: "camaba" }
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Role Camaba not found"
    });
  });

  it("should return all Prodi Camaba active data when found", async () => {
    const mockCamaba = { id: 1, nomor_daftar: "user123" };
    const mockProdiCamaba = [
      {
        id: 1,
        id_camaba: 1,
        Prodi: {
          id: 1,
          nama_prodi: "Teknik Informatika",
          JenjangPendidikan: { id: 1, nama_jenjang: "S1" }
        }
      }
    ];

    Role.findOne.mockResolvedValue({ id: 1, nama_role: "camaba" });
    UserRole.findOne.mockResolvedValue({ id: 1, id_user: req.user.id, id_role: 1 });
    Camaba.findOne.mockResolvedValue(mockCamaba);
    ProdiCamaba.findAll.mockResolvedValue(mockProdiCamaba);

    await getAllProdiCamabaActive(req, res, next);

    expect(ProdiCamaba.findAll).toHaveBeenCalledWith({
      where: { id_camaba: mockCamaba.id },
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }]
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Prodi Periode Pendaftaran By Camaba Active Success",
      jumlahData: mockProdiCamaba.length,
      data: mockProdiCamaba
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    Role.findOne.mockRejectedValue(error);

    await getAllProdiCamabaActive(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
