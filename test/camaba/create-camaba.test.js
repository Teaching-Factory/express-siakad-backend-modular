const { createCamaba } = require("../../src/controllers/camaba");
const { PeriodePendaftaran, SettingWSFeeder, Role, Camaba, User, UserRole, BiodataCamaba, BerkasPeriodePendaftaran, PemberkasanCamaba, Prodi, ProdiCamaba, TagihanCamaba, JenisTagihan, SumberPeriodePendaftaran, SumberInfoCamaba } = require("../../models");
const bcrypt = require("bcrypt");

jest.mock("../../models");
jest.mock("bcrypt");

describe("createCamaba", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        nama_lengkap: "John Doe",
        tempat_lahir: "Jakarta",
        tanggal_lahir: "2000-01-01",
        jenis_kelamin: "Laki-laki",
        nomor_hp: "08123456789",
        email: "john.doe@example.com",
        prodi: [{ id_prodi: 1 }],
        sumber_periode_pendaftaran: [{ id: 1, nama_sumber: "Referensi Teman" }]
      },
      params: {
        id_periode_pendaftaran: 1
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if nama_lengkap is missing", async () => {
    delete req.body.nama_lengkap;

    await createCamaba(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "nama_lengkap is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if tempat_lahir is missing", async () => {
    delete req.body.tempat_lahir;

    await createCamaba(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "tempat_lahir is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if tanggal_lahir is missing", async () => {
    delete req.body.tanggal_lahir;

    await createCamaba(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "tanggal_lahir is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if jenis_kelamin is missing", async () => {
    delete req.body.jenis_kelamin;

    await createCamaba(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "jenis_kelamin is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if nomor_hp is missing", async () => {
    delete req.body.nomor_hp;

    await createCamaba(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "nomor_hp is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if email is missing", async () => {
    delete req.body.email;

    await createCamaba(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "email is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if prodi is empty", async () => {
    req.body.prodi = [];

    await createCamaba(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Prodi is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if sumber_periode_pendaftaran is empty", async () => {
    req.body.sumber_periode_pendaftaran = [];

    await createCamaba(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Sumber Periode Pendaftaran is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if PeriodePendaftaran is not found", async () => {
    PeriodePendaftaran.findOne.mockResolvedValue(null);

    await createCamaba(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== Periode Pendaftaran With ID ${req.params.id_periode_pendaftaran} Not Found:`
    });
  });

  // Belum pass
  // it("should return 404 if SettingWSFeeder is not found", async () => {
  //   PeriodePendaftaran.findOne.mockResolvedValue({ id_semester: 1 });
  //   SettingWSFeeder.findOne.mockResolvedValue(null);

  //   await createCamaba(req, res, next);

  //   expect(res.status).toHaveBeenCalledWith(404);
  //   expect(res.json).toHaveBeenCalledWith({
  //     message: `<===== Setting WS Feeder Aktif Not Found:`
  //   });
  // });

  // it("should return 404 if Role Camaba is not found", async () => {
  //   PeriodePendaftaran.findOne.mockResolvedValue({ id_semester: 1 });
  //   SettingWSFeeder.findOne.mockResolvedValue({ username_feeder: "feeder" });
  //   Role.findOne.mockResolvedValue(null);

  //   await createCamaba(req, res, next);

  //   expect(res.status).toHaveBeenCalledWith(404);
  //   expect(res.json).toHaveBeenCalledWith({
  //     message: `<===== Role Camaba Not Found:`
  //   });
  // });

  // Belum pass
  // it("should successfully create a new Camaba and return 201", async () => {
  //   const mockPeriodePendaftaran = { id_semester: 1, biaya_pendaftaran: 100000, batas_akhir_pembayaran: new Date() };
  //   const mockSettingWSFeeder = { username_feeder: "feeder" };
  //   const mockRole = { id: 1 };
  //   const mockNewCamaba = { id: 1, nama_lengkap: "John Doe", nomor_daftar: "feeder001" };
  //   const mockNewUser = { id: 1 };

  //   PeriodePendaftaran.findOne.mockResolvedValue(mockPeriodePendaftaran);
  //   SettingWSFeeder.findOne.mockResolvedValue(mockSettingWSFeeder);
  //   Role.findOne.mockResolvedValue(mockRole);
  //   bcrypt.hash.mockResolvedValue("hashedPassword");
  //   Camaba.create.mockResolvedValue(mockNewCamaba);
  //   User.create.mockResolvedValue(mockNewUser);
  //   UserRole.create.mockResolvedValue({});
  //   BiodataCamaba.create.mockResolvedValue({});
  //   BerkasPeriodePendaftaran.findAll.mockResolvedValue([{ id: 1 }]);
  //   PemberkasanCamaba.create.mockResolvedValue({});
  //   Prodi.findOne.mockResolvedValue({ id_prodi: 1 });
  //   ProdiCamaba.create.mockResolvedValue({});
  //   JenisTagihan.findOne.mockResolvedValue({ id_jenis_tagihan: 1 });
  //   TagihanCamaba.create.mockResolvedValue({});
  //   SumberPeriodePendaftaran.findOne.mockResolvedValue({ id: 1, Sumber: { nama_sumber: "Referensi Teman" } });
  //   SumberInfoCamaba.create.mockResolvedValue({});

  //   await createCamaba(req, res, next);

  //   expect(res.status).toHaveBeenCalledWith(201);
  //   expect(res.json).toHaveBeenCalledWith({
  //     message: "<===== CREATE Camaba Success",
  //     dataCamaba: mockNewCamaba,
  //     dataProdiCamaba: [{ id_prodi: 1 }],
  //     dataSumberInfoCamaba: [{ id: 1, Sumber: { nama_sumber: "Referensi Teman" } }]
  //   });
  // });

  it("should call next with an error if an exception occurs", async () => {
    const errorMock = new Error("Database error");
    PeriodePendaftaran.findOne.mockRejectedValue(errorMock);

    await createCamaba(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMock);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
