const { getBiodataCamabaByActiveUser } = require("../../src/modules/biodata-camaba/controller");
const { BiodataCamaba, Camaba, Sekolah, Agama, Wilayah, JenisTinggal, Penghasilan, Pekerjaan, JenjangPendidikan, Role, UserRole } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getBiodataCamabaByActiveUser", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Membersihkan mock setelah setiap pengujian
  });

  it("should return 404 if biodata camaba is not found", async () => {
    const mockRoleCamaba = { id: 1 };
    const mockUserRole = { id_user: 1, id_role: 1 };

    Role.findOne = jest.fn().mockResolvedValue(mockRoleCamaba);
    UserRole.findOne = jest.fn().mockResolvedValue(mockUserRole);
    BiodataCamaba.findOne = jest.fn().mockResolvedValue(null);

    req.user = { id: 1, username: "user123" };

    await getBiodataCamabaByActiveUser(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Biodata Camaba not found"
    });
    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "camaba" } });
    expect(UserRole.findOne).toHaveBeenCalledWith({ where: { id_user: req.user.id, id_role: mockRoleCamaba.id } });
    expect(BiodataCamaba.findOne).toHaveBeenCalledWith({
      include: expect.anything() // Memastikan include dipanggil dengan benar
    });
  });

  it("should return 200 and the biodata camaba if found", async () => {
    const mockRoleCamaba = { id: 1 };
    const mockUserRole = { id_user: 1, id_role: 1 };
    const mockBiodataCamaba = {
      id: 1,
      Camaba: { id: 1, nomor_daftar: "user123" },
      Sekolah: { id: 1, sekolah: "SMA 1" },
      Agama: { id: 1, agama: "Islam" },
      Wilayah: { id: 1, wilayah: "Jakarta" },
      JenisTinggal: { id: 1, jenis_tinggal: "Dengan Orang Tua" },
      PenghasilanAyah: { id: 1, penghasilan: "1000000" },
      PenghasilanIbu: { id: 2, penghasilan: "2000000" },
      PenghasilanWali: { id: 3, penghasilan: "1500000" },
      PekerjaanAyah: { id: 1, pekerjaan: "PNS" },
      PekerjaanIbu: { id: 2, pekerjaan: "Ibu Rumah Tangga" },
      PekerjaanWali: { id: 3, pekerjaan: "Wiraswasta" },
      PendidikanAyah: { id: 1, pendidikan: "S1" },
      PendidikanIbu: { id: 2, pendidikan: "SMA" },
      PendidikanWali: { id: 3, pendidikan: "D3" }
    };

    Role.findOne = jest.fn().mockResolvedValue(mockRoleCamaba);
    UserRole.findOne = jest.fn().mockResolvedValue(mockUserRole);
    BiodataCamaba.findOne = jest.fn().mockResolvedValue(mockBiodataCamaba);

    req.user = { id: 1, username: "user123" };

    await getBiodataCamabaByActiveUser(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Biodata Camaba Active Success:`,
      data: mockBiodataCamaba
    });
    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "camaba" } });
    expect(UserRole.findOne).toHaveBeenCalledWith({ where: { id_user: req.user.id, id_role: mockRoleCamaba.id } });
    expect(BiodataCamaba.findOne).toHaveBeenCalledWith({
      include: expect.anything() // Memastikan include dipanggil dengan benar
    });
  });

  it("should handle errors and call next with error", async () => {
    const mockError = new Error("Database error");

    Role.findOne = jest.fn().mockRejectedValue(mockError);

    req.user = { id: 1, username: "user123" };

    await getBiodataCamabaByActiveUser(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
    expect(res._isEndCalled()).toBe(false); // Tidak ada respons yang dikirim karena ada error
  });
});
