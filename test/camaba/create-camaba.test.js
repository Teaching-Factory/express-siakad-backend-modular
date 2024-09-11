const httpMocks = require("node-mocks-http");
const bcrypt = require("bcrypt");
const { createCamaba } = require("../../src/controllers/camaba");
const { Camaba, PeriodePendaftaran, SettingWSFeeder, Role, User, UserRole, Prodi, ProdiCamaba } = require("../../models");

jest.mock("../../models");
jest.mock("bcrypt");

describe("createCamaba", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  //   belum pass
  //   it("should create a new camaba and return status 201", async () => {
  //     req.body = {
  //       nama_lengkap: "Camaba 1",
  //       tempat_lahir: "Tempat 1",
  //       tanggal_lahir: "2000-01-01",
  //       jenis_kelamin: "L",
  //       nomor_hp: "08123456789",
  //       email: "camaba1@example.com",
  //       prodi: [{ id_prodi: 1 }]
  //     };
  //     req.params.id_periode_pendaftaran = 1;

  //     const mockPeriodePendaftaran = { id: 1, id_semester: 123 };
  //     const mockSettingWSFeeder = { username_feeder: "USER123" };
  //     const mockRole = { id: 1 };
  //     const mockCamaba = { id: 1, nomor_daftar: "USER1231230001" };
  //     const mockUser = { id: 1 };
  //     const mockProdi = { id_prodi: 1 };
  //     const mockProdiCamaba = { id: 1, id_prodi: 1, id_camaba: 1 };

  //     PeriodePendaftaran.findOne.mockResolvedValue(mockPeriodePendaftaran);
  //     SettingWSFeeder.findOne.mockResolvedValue(mockSettingWSFeeder);
  //     Role.findOne.mockResolvedValue(mockRole);
  //     Camaba.create.mockResolvedValue(mockCamaba);
  //     User.create.mockResolvedValue(mockUser);
  //     UserRole.create.mockResolvedValue();
  //     Prodi.findOne.mockResolvedValue(mockProdi);
  //     ProdiCamaba.create.mockResolvedValue(mockProdiCamaba);
  //     bcrypt.hash.mockResolvedValue("hashedPassword");

  //     await createCamaba(req, res, next);

  //     expect(PeriodePendaftaran.findOne).toHaveBeenCalledWith({
  //       where: { id: req.params.id_periode_pendaftaran }
  //     });
  //     expect(SettingWSFeeder.findOne).toHaveBeenCalledWith({
  //       where: { status: true }
  //     });
  //     expect(Role.findOne).toHaveBeenCalledWith({
  //       where: { nama_role: "camaba" }
  //     });
  //     expect(Camaba.create).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         nama_lengkap: req.body.nama_lengkap,
  //         tempat_lahir: req.body.tempat_lahir,
  //         tanggal_lahir: req.body.tanggal_lahir,
  //         jenis_kelamin: req.body.jenis_kelamin,
  //         nomor_hp: req.body.nomor_hp,
  //         email: req.body.email,
  //         tanggal_pendaftaran: expect.any(Date),
  //         nomor_daftar: expect.any(String),
  //         hints: expect.any(String),
  //         id_periode_pendaftaran: req.params.id_periode_pendaftaran
  //       })
  //     );
  //     expect(User.create).toHaveBeenCalledWith({
  //       nama: req.body.nama_lengkap,
  //       username: mockCamaba.nomor_daftar,
  //       password: "hashedPassword",
  //       hints: expect.any(String),
  //       email: null,
  //       status: true
  //     });
  //     expect(UserRole.create).toHaveBeenCalledWith({
  //       id_role: mockRole.id,
  //       id_user: mockUser.id
  //     });
  //     expect(ProdiCamaba.create).toHaveBeenCalledWith({
  //       id_prodi: mockProdi.id_prodi,
  //       id_camaba: mockCamaba.id
  //     });

  //     expect(res.statusCode).toEqual(201);
  //     expect(res._getJSONData()).toEqual({
  //       message: "<===== CREATE Camaba Success",
  //       dataCamaba: mockCamaba,
  //       dataProdiCamaba: [mockProdiCamaba]
  //     });
  //   });

  it("should return 400 if required fields are missing", async () => {
    req.body = {}; // Empty body
    req.params.id_periode_pendaftaran = 1;

    await createCamaba(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "nama_lengkap is required" });
  });

  it("should return 404 if Periode Pendaftaran not found", async () => {
    req.body = {
      nama_lengkap: "Camaba 1",
      tempat_lahir: "Tempat 1",
      tanggal_lahir: "2000-01-01",
      jenis_kelamin: "L",
      nomor_hp: "08123456789",
      email: "camaba1@example.com",
      prodi: [{ id_prodi: 1 }]
    };
    req.params.id_periode_pendaftaran = 1;

    PeriodePendaftaran.findOne.mockResolvedValue(null);

    await createCamaba(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Periode Pendaftaran With ID ${req.params.id_periode_pendaftaran} Not Found:`
    });
  });

  //   belum pass
  //   it("should return 404 if Setting WS Feeder not found", async () => {
  //     req.body = {
  //       nama_lengkap: "Camaba 1",
  //       tempat_lahir: "Tempat 1",
  //       tanggal_lahir: "2000-01-01",
  //       jenis_kelamin: "L",
  //       nomor_hp: "08123456789",
  //       email: "camaba1@example.com",
  //       prodi: [{ id_prodi: 1 }]
  //     };
  //     req.params.id_periode_pendaftaran = 1;

  //     const mockPeriodePendaftaran = { id: 1, id_semester: 123 };
  //     PeriodePendaftaran.findOne.mockResolvedValue(mockPeriodePendaftaran);
  //     SettingWSFeeder.findOne.mockResolvedValue(null);

  //     await createCamaba(req, res, next);

  //     expect(res.statusCode).toEqual(404);
  //     expect(res._getJSONData()).toEqual({
  //       message: `<===== Setting WS Feeder Aktif Not Found:`
  //     });
  //   });

  it("should handle errors", async () => {
    req.body = {
      nama_lengkap: "Camaba 1",
      tempat_lahir: "Tempat 1",
      tanggal_lahir: "2000-01-01",
      jenis_kelamin: "L",
      nomor_hp: "08123456789",
      email: "camaba1@example.com",
      prodi: [{ id_prodi: 1 }]
    };
    req.params.id_periode_pendaftaran = 1;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PeriodePendaftaran.findOne.mockRejectedValue(error);

    await createCamaba(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
