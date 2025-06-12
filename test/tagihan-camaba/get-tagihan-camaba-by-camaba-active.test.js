const httpMocks = require("node-mocks-http");
const { getTagihanCamabaByCamabaActive } = require("../../src/modules/tagihan-camaba/controller");
const { Role, UserRole, Camaba, TagihanCamaba, Semester, JenisTagihan } = require("../../models"); 

jest.mock("../../models");

describe("getTagihanCamabaByCamabaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 404 if Role Camaba not found", async () => {
    req.user = { id: 1, username: "camaba123" };

    Role.findOne.mockResolvedValue(null);

    await getTagihanCamabaByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Role Camaba not found" });
  });

  it("should return 200 and the tagihan_camaba if found", async () => {
    req.user = { id: 1, username: "camaba123" };

    const mockRoleCamaba = { id: 2, nama_role: "camaba" };
    const mockUserRole = { id_user: 1, id_role: 2 };
    const mockCamaba = { id: 1, nomor_daftar: "camaba123" };
    const mockTagihanCamaba = [{ id: 1, id_camaba: 1 }]; // Ubah ini menjadi array

    Role.findOne.mockResolvedValue(mockRoleCamaba);
    UserRole.findOne.mockResolvedValue(mockUserRole);
    Camaba.findOne.mockResolvedValue(mockCamaba);
    TagihanCamaba.findOne.mockResolvedValue(mockTagihanCamaba[0]); // Kembali objek pertama

    await getTagihanCamabaByCamabaActive(req, res, next);

    expect(TagihanCamaba.findOne).toHaveBeenCalledWith({
      where: { id_camaba: mockCamaba.id },
      include: [{ model: Semester }, { model: JenisTagihan }]
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Tagihan Camaba Active Success",
      data: mockTagihanCamaba[0] // Kembalikan objek pertama
    });
  });

  it("should handle errors", async () => {
    req.user = { id: 1, username: "camaba123" };
    const mockRoleCamaba = { id: 2, nama_role: "camaba" };

    Role.findOne.mockResolvedValue(mockRoleCamaba);
    UserRole.findOne.mockResolvedValue({ id_user: 1, id_role: 2 });
    Camaba.findOne.mockResolvedValue({ nomor_daftar: "camaba123" });
    TagihanCamaba.findOne.mockImplementation(() => {
      throw new Error("Database error");
    });

    await getTagihanCamabaByCamabaActive(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
