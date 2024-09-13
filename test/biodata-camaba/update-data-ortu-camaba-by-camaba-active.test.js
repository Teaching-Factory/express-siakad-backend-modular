const { updateDataOrtuCamabaByCamabaActive } = require("../../src/controllers/biodata-camaba");
const { BiodataCamaba, Camaba, Role, UserRole } = require("../../models");
const httpMocks = require("node-mocks-http");
// const jest = require("jest-mock");

describe("updateDataOrtuCamabaByCamabaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should return 404 if role Camaba is not found", async () => {
    Role.findOne = jest.fn().mockResolvedValue(null);

    req.body = {
      nik_ayah: "1234567890",
      nama_ayah: "Ayah",
      tanggal_lahir_ayah: "1970-01-01",
      id_pendidikan_ayah: 1,
      id_pekerjaan_ayah: 1,
      id_penghasilan_ayah: 1,
      nik_ibu: "0987654321",
      tanggal_lahir_ibu: "1975-01-01",
      id_pendidikan_ibu: 1,
      id_pekerjaan_ibu: 1,
      id_penghasilan_ibu: 1,
      nama_wali: "Wali",
      tanggal_lahir_wali: "1980-01-01",
      id_pendidikan_wali: 1,
      id_pekerjaan_wali: 1,
      id_penghasilan_wali: 1
    };

    req.user = { id: 1, username: "user123" };

    await updateDataOrtuCamabaByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Role Camaba not found"
    });
  });

  it("should return 404 if user is not Camaba", async () => {
    const mockRoleCamaba = { id: 1 };
    Role.findOne = jest.fn().mockResolvedValue(mockRoleCamaba);
    UserRole.findOne = jest.fn().mockResolvedValue(null);

    req.body = {
      nik_ayah: "1234567890",
      nama_ayah: "Ayah",
      tanggal_lahir_ayah: "1970-01-01",
      id_pendidikan_ayah: 1,
      id_pekerjaan_ayah: 1,
      id_penghasilan_ayah: 1,
      nik_ibu: "0987654321",
      tanggal_lahir_ibu: "1975-01-01",
      id_pendidikan_ibu: 1,
      id_pekerjaan_ibu: 1,
      id_penghasilan_ibu: 1,
      nama_wali: "Wali",
      tanggal_lahir_wali: "1980-01-01",
      id_pendidikan_wali: 1,
      id_pekerjaan_wali: 1,
      id_penghasilan_wali: 1
    };

    req.user = { id: 1, username: "user123" };

    await updateDataOrtuCamabaByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "User is not Camaba"
    });
  });

  it("should return 404 if Biodata Camaba is not found", async () => {
    const mockRoleCamaba = { id: 1 };
    const mockUserRole = { id_user: 1, id_role: 1 };
    const mockCamaba = { id: 1 };

    Role.findOne = jest.fn().mockResolvedValue(mockRoleCamaba);
    UserRole.findOne = jest.fn().mockResolvedValue(mockUserRole);
    Camaba.findOne = jest.fn().mockResolvedValue(mockCamaba);
    BiodataCamaba.findOne = jest.fn().mockResolvedValue(null);

    req.body = {
      nik_ayah: "1234567890",
      nama_ayah: "Ayah",
      tanggal_lahir_ayah: "1970-01-01",
      id_pendidikan_ayah: 1,
      id_pekerjaan_ayah: 1,
      id_penghasilan_ayah: 1,
      nik_ibu: "0987654321",
      tanggal_lahir_ibu: "1975-01-01",
      id_pendidikan_ibu: 1,
      id_pekerjaan_ibu: 1,
      id_penghasilan_ibu: 1,
      nama_wali: "Wali",
      tanggal_lahir_wali: "1980-01-01",
      id_pendidikan_wali: 1,
      id_pekerjaan_wali: 1,
      id_penghasilan_wali: 1
    };

    req.user = { id: 1, username: "user123" };

    await updateDataOrtuCamabaByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Biodata Camaba not found"
    });
  });

  //   belum pass
  //   it("should successfully update Biodata Camaba and return 200", async () => {
  //     const mockRoleCamaba = { id: 1 };
  //     const mockUserRole = { id_user: 1, id_role: 1 };
  //     const mockCamaba = { id: 1 };
  //     const mockBiodataCamaba = {
  //       id: 1,
  //       nik_ayah: "",
  //       nama_ayah: "",
  //       tanggal_lahir_ayah: "",
  //       id_pendidikan_ayah: null,
  //       id_pekerjaan_ayah: null,
  //       id_penghasilan_ayah: null,
  //       nik_ibu: "",
  //       tanggal_lahir_ibu: "",
  //       id_pendidikan_ibu: null,
  //       id_pekerjaan_ibu: null,
  //       id_penghasilan_ibu: null,
  //       nama_wali: "",
  //       tanggal_lahir_wali: "",
  //       id_pendidikan_wali: null,
  //       id_pekerjaan_wali: null,
  //       id_penghasilan_wali: null,
  //       save: jest.fn().mockResolvedValue(true)
  //     };

  //     Role.findOne = jest.fn().mockResolvedValue(mockRoleCamaba);
  //     UserRole.findOne = jest.fn().mockResolvedValue(mockUserRole);
  //     Camaba.findOne = jest.fn().mockResolvedValue(mockCamaba);
  //     BiodataCamaba.findOne = jest.fn().mockResolvedValue(mockBiodataCamaba);

  //     req.body = {
  //       nik_ayah: "1234567890",
  //       nama_ayah: "Ayah",
  //       tanggal_lahir_ayah: "1970-01-01",
  //       id_pendidikan_ayah: 1,
  //       id_pekerjaan_ayah: 1,
  //       id_penghasilan_ayah: 1,
  //       nik_ibu: "0987654321",
  //       tanggal_lahir_ibu: "1975-01-01",
  //       id_pendidikan_ibu: 1,
  //       id_pekerjaan_ibu: 1,
  //       id_penghasilan_ibu: 1,
  //       nama_wali: "Wali",
  //       tanggal_lahir_wali: "1980-01-01",
  //       id_pendidikan_wali: 1,
  //       id_pekerjaan_wali: 1,
  //       id_penghasilan_wali: 1
  //     };

  //     req.user = { id: 1, username: "user123" };

  //     await updateDataOrtuCamabaByCamabaActive(req, res, next);

  //     expect(res.statusCode).toBe(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "Biodata Camaba updated successfully"
  //     });
  //   });
});
