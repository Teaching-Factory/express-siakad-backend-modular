const { cetakBiodataByCamabaActive } = require("../../src/controllers/biodata-camaba");
const { Role, UserRole, Camaba, BiodataCamaba, ProdiCamaba, Prodi, JenjangPendidikan } = require("../../models");
const httpMocks = require("node-mocks-http");
const mockResponse = () => httpMocks.createResponse();

jest.mock("../../models"); // Mock semua model yang diperlukan

describe("cetakBiodataByCamabaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: "GET",
      url: "/camaba/cetak",
      user: { id: 1, username: "user123" } // Mock user
    });
    res = mockResponse();
    next = jest.fn();
  });

  it("should return 404 if Role Camaba not found", async () => {
    Role.findOne.mockResolvedValue(null); // Role Camaba not found

    await cetakBiodataByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Role Camaba not found" });
  });

  it("should return 404 if Prodi Camaba not found", async () => {
    const mockCamaba = { id: 1, nomor_daftar: "user123" };
    const mockBiodataCamaba = { id_camaba: 1 };

    Role.findOne.mockResolvedValue({ id: 1, nama_role: "camaba" });
    UserRole.findOne.mockResolvedValue({ id: 1, id_user: 1, id_role: 1 });
    Camaba.findOne.mockResolvedValue(mockCamaba); // Camaba found
    BiodataCamaba.findOne.mockResolvedValue(mockBiodataCamaba); // Biodata Camaba found
    ProdiCamaba.findAll.mockResolvedValue(null); // Prodi Camaba not found

    await cetakBiodataByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: `<===== Prodi Camaba Not Found:` });
  });

  it("should return 200 and cetak data when successful", async () => {
    const mockCamaba = { id_camaba: 1 }; // Disesuaikan dengan output aktual
    const mockBiodataCamaba = { id_camaba: 1 };
    const mockProdiCamaba = [{ id_camaba: 1, Prodi: { JenjangPendidikan: {} } }];

    Role.findOne.mockResolvedValue({ id: 1, nama_role: "camaba" });
    UserRole.findOne.mockResolvedValue({ id: 1, id_user: 1, id_role: 1 });
    Camaba.findOne.mockResolvedValue(mockCamaba); // Camaba found
    BiodataCamaba.findOne.mockResolvedValue(mockBiodataCamaba); // Biodata Camaba found
    ProdiCamaba.findAll.mockResolvedValue(mockProdiCamaba); // Prodi Camaba found

    await cetakBiodataByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== Cetak Camaba Active Success:`,
      dataCamaba: mockCamaba,
      dataBiodataCamaba: mockBiodataCamaba,
      dataProdiCamaba: mockProdiCamaba
    });
  });
});
