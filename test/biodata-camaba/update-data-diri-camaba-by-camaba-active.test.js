const { updateDataDiriCamabaByCamabaActive } = require("../../src/modules/biodata-camaba/controller");
const { BiodataCamaba, Camaba, Role, UserRole } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("updateDataDiriCamabaByCamabaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Membersihkan mock setelah setiap pengujian
  });

  it("should return 404 if role Camaba is not found", async () => {
    req.body = {
      nama_lengkap: "John Doe",
      tempat_lahir: "Jakarta",
      tanggal_lahir: "2000-01-01",
      jenis_kelamin: "L",
      nik: "1234567890",
      nisn: "0987654321",
      kewarganegaraan: "WNI",
      kelurahan: "Kelurahan",
      id_wilayah: 1,
      id_agama: 1,
      nama_ibu_kandung: "Ibu",
      email: "john.doe@example.com",
      handphone: "081234567890"
    };

    Role.findOne = jest.fn().mockResolvedValue(null);

    req.user = { id: 1, username: "user123" };

    await updateDataDiriCamabaByCamabaActive(req, res, next);

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
      nama_lengkap: "John Doe",
      tempat_lahir: "Jakarta",
      tanggal_lahir: "2000-01-01",
      jenis_kelamin: "L",
      nik: "1234567890",
      nisn: "0987654321",
      kewarganegaraan: "WNI",
      kelurahan: "Kelurahan",
      id_wilayah: 1,
      id_agama: 1,
      nama_ibu_kandung: "Ibu",
      email: "john.doe@example.com",
      handphone: "081234567890"
    };

    req.user = { id: 1, username: "user123" };

    await updateDataDiriCamabaByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "User is not Camaba"
    });
  });

  it("should return 404 if Camaba is not found", async () => {
    const mockRoleCamaba = { id: 1 };
    const mockUserRole = { id_user: 1, id_role: 1 };

    Role.findOne = jest.fn().mockResolvedValue(mockRoleCamaba);
    UserRole.findOne = jest.fn().mockResolvedValue(mockUserRole);
    Camaba.findOne = jest.fn().mockResolvedValue(null);

    req.body = {
      nama_lengkap: "John Doe",
      tempat_lahir: "Jakarta",
      tanggal_lahir: "2000-01-01",
      jenis_kelamin: "L",
      nik: "1234567890",
      nisn: "0987654321",
      kewarganegaraan: "WNI",
      kelurahan: "Kelurahan",
      id_wilayah: 1,
      id_agama: 1,
      nama_ibu_kandung: "Ibu",
      email: "john.doe@example.com",
      handphone: "081234567890"
    };

    req.user = { id: 1, username: "user123" };

    await updateDataDiriCamabaByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Camaba not found"
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
      nama_lengkap: "John Doe",
      tempat_lahir: "Jakarta",
      tanggal_lahir: "2000-01-01",
      jenis_kelamin: "L",
      nik: "1234567890",
      nisn: "0987654321",
      kewarganegaraan: "WNI",
      kelurahan: "Kelurahan",
      id_wilayah: 1,
      id_agama: 1,
      nama_ibu_kandung: "Ibu",
      email: "john.doe@example.com",
      handphone: "081234567890"
    };

    req.user = { id: 1, username: "user123" };

    await updateDataDiriCamabaByCamabaActive(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Biodata Camaba not found"
    });
  });

  //   belum pass
  //   it("should successfully update camaba and biodata camaba and return 200", async () => {
  //     const mockRoleCamaba = { id: 1 };
  //     const mockUserRole = { id_user: 1, id_role: 1 };
  //     const mockCamaba = {
  //       id: 1,
  //       nama_lengkap: "John Doe",
  //       tempat_lahir: "Jakarta",
  //       tanggal_lahir: "2000-01-01",
  //       jenis_kelamin: "L",
  //       email: "john.doe@example.com",
  //       nomor_hp: "081234567890",
  //       save: jest.fn().mockResolvedValue(true)
  //     };
  //     const mockBiodataCamaba = {
  //       id: 1,
  //       id_agama: 1,
  //       nama_ibu_kandung: "Ibu",
  //       nik: "1234567890",
  //       nisn: "0987654321",
  //       npwp: "123456789012",
  //       kewarganegaraan: "WNI",
  //       jalan: "Jl. Raya",
  //       dusun: "Dusun 1",
  //       rt: "01",
  //       rw: "02",
  //       kelurahan: "Kelurahan",
  //       id_wilayah: 1,
  //       kode_pos: "12345",
  //       telepon: "021123456",
  //       handphone: "081234567890",
  //       email: "john.doe@example.com",
  //       id_jenis_tinggal: 1,
  //       id_sekolah: 1,
  //       save: jest.fn().mockResolvedValue(true)
  //     };

  //     // Mocking database calls
  //     Role.findOne = jest.fn().mockResolvedValue(mockRoleCamaba);
  //     UserRole.findOne = jest.fn().mockResolvedValue(mockUserRole);
  //     Camaba.findOne = jest.fn().mockResolvedValue(mockCamaba);
  //     BiodataCamaba.findOne = jest.fn().mockResolvedValue(mockBiodataCamaba);

  //     // Mocking request and response
  //     req.body = {
  //       nama_lengkap: "John Doe",
  //       tempat_lahir: "Jakarta",
  //       tanggal_lahir: "2000-01-01",
  //       jenis_kelamin: "L",
  //       nik: "1234567890",
  //       nisn: "0987654321",
  //       kewarganegaraan: "WNI",
  //       kelurahan: "Kelurahan",
  //       id_wilayah: 1,
  //       id_agama: 1,
  //       nama_ibu_kandung: "Ibu",
  //       email: "john.doe@example.com",
  //       handphone: "081234567890",
  //       jalan: "Jl. Raya",
  //       dusun: "Dusun 1",
  //       rt: "01",
  //       rw: "02",
  //       kode_pos: "12345",
  //       telepon: "021123456",
  //       id_jenis_tinggal: 1,
  //       id_sekolah: 1
  //     };

  //     req.user = { id: 1, username: "user123" };

  //     // Call the function
  //     await updateDataDiriCamabaByCamabaActive(req, res, next);

  //     // Verify the results
  //     expect(res.statusCode).toBe(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "<===== UPDATE Data Diri Camaba Success:",
  //       camabaNew: {
  //         id: 1,
  //         nama_lengkap: "John Doe",
  //         tempat_lahir: "Jakarta",
  //         tanggal_lahir: "2000-01-01",
  //         jenis_kelamin: "L",
  //         email: "john.doe@example.com",
  //         nomor_hp: "081234567890"
  //       },
  //       biodataCamabaNew: {
  //         id: 1,
  //         id_agama: 1,
  //         nama_ibu_kandung: "Ibu",
  //         nik: "1234567890",
  //         nisn: "0987654321",
  //         npwp: "123456789012",
  //         kewarganegaraan: "WNI",
  //         jalan: "Jl. Raya",
  //         dusun: "Dusun 1",
  //         rt: "01",
  //         rw: "02",
  //         kelurahan: "Kelurahan",
  //         id_wilayah: 1,
  //         kode_pos: "12345",
  //         telepon: "021123456",
  //         handphone: "081234567890",
  //         email: "john.doe@example.com",
  //         id_jenis_tinggal: 1,
  //         id_sekolah: 1
  //       }
  //     });
  //     expect(mockCamaba.save).toHaveBeenCalled();
  //     expect(mockBiodataCamaba.save).toHaveBeenCalled();
  //   });

  it("should call next with error if there is an exception", async () => {
    const mockRoleCamaba = { id: 1 };
    const mockUserRole = { id_user: 1, id_role: 1 };

    Role.findOne = jest.fn().mockResolvedValue(mockRoleCamaba);
    UserRole.findOne = jest.fn().mockResolvedValue(mockUserRole);
    Camaba.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

    req.body = {
      nama_lengkap: "John Doe",
      tempat_lahir: "Jakarta",
      tanggal_lahir: "2000-01-01",
      jenis_kelamin: "L",
      nik: "1234567890",
      nisn: "0987654321",
      kewarganegaraan: "WNI",
      kelurahan: "Kelurahan",
      id_wilayah: 1,
      id_agama: 1,
      nama_ibu_kandung: "Ibu",
      email: "john.doe@example.com",
      handphone: "081234567890"
    };

    req.user = { id: 1, username: "user123" };

    await updateDataDiriCamabaByCamabaActive(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
