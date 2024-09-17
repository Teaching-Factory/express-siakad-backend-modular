const { cetakFormPendaftaranByCamabaActive } = require("../../src/controllers/camaba"); // Pastikan path ke controller sudah benar
const { Role, UserRole, Camaba, User, ProdiCamaba, Prodi, JenjangPendidikan } = require("../../models");
const httpMocks = require("node-mocks-http");
const mockResponse = () => httpMocks.createResponse();

jest.mock("../../models"); // Mock semua model yang diperlukan

describe("cetakFormPendaftaranByCamabaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: "GET",
      url: "/camaba/cetak-form",
      user: { id: 1, username: "user123" } // Mock user
    });
    res = mockResponse();
    next = jest.fn();
  });

  it("should return 404 if Role Camaba not found", async () => {
    Role.findOne.mockResolvedValue(null); // Role Camaba not found

    await cetakFormPendaftaranByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Role Camaba not found" });
  });

  it("should return 404 if Prodi Camaba not found", async () => {
    const mockCamaba = { id: 1, nomor_daftar: "user123" };
    const mockUserCamaba = { username: "user123", hints: "some hints" };

    Role.findOne.mockResolvedValue({ id: 1, nama_role: "camaba" });
    UserRole.findOne.mockResolvedValue({ id: 1, id_user: 1, id_role: 1 });
    Camaba.findOne.mockResolvedValue(mockCamaba); // Camaba found
    User.findOne.mockResolvedValue(mockUserCamaba); // User Camaba found
    ProdiCamaba.findAll.mockResolvedValue(null); // Prodi Camaba not found

    await cetakFormPendaftaranByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: `<===== Prodi Camaba Not Found:` });
  });

  it("should return 200 and cetak data when successful", async () => {
    // Mock data yang sesuai dengan format yang dikembalikan oleh fungsi
    const mockCamaba = {
      username: "user123",
      hints: "some hints"
    };
    const mockUserCamaba = { username: "user123", hints: "some hints" };
    const mockProdiCamaba = [{ id_camaba: 1, Prodi: { JenjangPendidikan: {} } }];

    // Mock implementasi model
    Role.findOne.mockResolvedValue({ id: 1, nama_role: "camaba" });
    UserRole.findOne.mockResolvedValue({ id: 1, id_user: 1, id_role: 1 });
    Camaba.findOne.mockResolvedValue(mockCamaba); // Camaba found
    User.findOne.mockResolvedValue(mockUserCamaba); // User Camaba found
    ProdiCamaba.findAll.mockResolvedValue(mockProdiCamaba); // Prodi Camaba found

    // Panggil fungsi
    await cetakFormPendaftaranByCamabaActive(req, res, next);

    // Periksa hasil respons
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== Cetak Form Pendaftaran Camaba Active Success:`,
      dataCamaba: mockCamaba,
      dataProdiCamaba: mockProdiCamaba,
      dataUserCamaba: mockUserCamaba
    });
  });
});
