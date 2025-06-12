const httpMocks = require("node-mocks-http");
const { getAllPemberkasanCamabaByCamabaActive } = require("../../src/modules/pemberkasan-camaba/controller");
const { Role, UserRole, Camaba, PemberkasanCamaba, BerkasPeriodePendaftaran, JenisBerkas } = require("../../models");

jest.mock("../../models");

describe("getAllPemberkasanCamabaByCamabaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all pemberkasan_camaba for active camaba with status 200", async () => {
    const mockCamaba = { id: 1, nomor_daftar: "camaba123" };
    const mockPemberkasanCamaba = [
      { id: 1, file_berkas: "file1.pdf" },
      { id: 2, file_berkas: "file2.jpg" }
    ];

    req.user = { id: 1, username: "camaba123" };

    Role.findOne.mockResolvedValue({ id: 1, nama_role: "camaba" });
    UserRole.findOne.mockResolvedValue({ id_user: 1, id_role: 1 });
    Camaba.findOne.mockResolvedValue(mockCamaba);
    PemberkasanCamaba.findAll.mockResolvedValue(mockPemberkasanCamaba);

    await getAllPemberkasanCamabaByCamabaActive(req, res, next);

    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "camaba" } });
    expect(UserRole.findOne).toHaveBeenCalledWith({ where: { id_user: req.user.id, id_role: 1 } });
    expect(Camaba.findOne).toHaveBeenCalledWith({ where: { nomor_daftar: req.user.username } });
    expect(PemberkasanCamaba.findAll).toHaveBeenCalledWith({
      where: { id_camaba: mockCamaba.id },
      include: [
        {
          model: BerkasPeriodePendaftaran,
          include: [{ model: JenisBerkas, as: "JenisBerkas" }]
        },
        { model: Camaba }
      ]
    });

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Pemberkasan Camaba By Camaba Active Success:`,
      jumlahData: mockPemberkasanCamaba.length,
      data: mockPemberkasanCamaba
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.user = { id: 1, username: "camaba123" };

    Role.findOne.mockRejectedValue(error);

    await getAllPemberkasanCamabaByCamabaActive(req, res, next);

    expect(Role.findOne).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
