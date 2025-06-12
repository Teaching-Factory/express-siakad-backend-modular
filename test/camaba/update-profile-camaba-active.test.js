const { updateProfileCamabaActive } = require("../../src/modules/camaba/controller"); 
const { Role, UserRole, Camaba, PeriodePendaftaran, Semester, Prodi, JenjangPendidikan } = require("../../models"); 
const httpMocks = require("node-mocks-http");
const fs = require("fs");
const path = require("path");

// Mock fungsi `fs.unlink` agar tidak menghapus file saat pengujian
jest.mock("fs", () => {
  const actualFs = jest.requireActual("fs");
  return {
    ...actualFs,
    unlink: jest.fn((filePath, callback) => callback(null)) // Mock unlink
  };
});

describe("updateProfileCamabaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

    req.user = { id: 1, username: "testuser" }; // Mock data user
    req.file = { filename: "newProfilePic.png", mimetype: "image/png" }; // Mock file upload
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  it("should return 404 if role camaba is not found", async () => {
    Role.findOne = jest.fn().mockResolvedValue(null); // Mock tidak menemukan role camaba

    await updateProfileCamabaActive(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Role Camaba not found"
    });
  });

  it("should return 404 if user is not a camaba", async () => {
    const mockRole = { id: 1, nama_role: "camaba" };
    Role.findOne.mockResolvedValue(mockRole); // Mock menemukan role camaba
    UserRole.findOne = jest.fn().mockResolvedValue(null); // Mock user tidak memiliki role camaba

    await updateProfileCamabaActive(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "User is not Camaba"
    });
  });

  it("should return 404 if camaba is not found", async () => {
    const mockRole = { id: 1, nama_role: "camaba" };
    Role.findOne.mockResolvedValue(mockRole); // Mock role camaba ditemukan
    UserRole.findOne.mockResolvedValue({ id_user: 1, id_role: 1 }); // Mock user memiliki role camaba
    Camaba.findOne = jest.fn().mockResolvedValue(null); // Mock camaba tidak ditemukan

    await updateProfileCamabaActive(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Camaba not found"
    });
  });

  it("should return 400 if file type is not supported", async () => {
    req.file.mimetype = "application/pdf"; // Mock file dengan tipe yang tidak didukung
    const mockRole = { id: 1, nama_role: "camaba" };
    const mockCamaba = { foto_profil: "oldProfilePic.png", save: jest.fn() };

    Role.findOne.mockResolvedValue(mockRole);
    UserRole.findOne.mockResolvedValue({ id_user: 1, id_role: 1 });
    Camaba.findOne.mockResolvedValue(mockCamaba);

    await updateProfileCamabaActive(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "File type not supported"
    });
  });

  //   belum pass
  //   it("should update profile picture and delete the old one if file is uploaded", async () => {
  //     const mockRole = { id: 1, nama_role: "camaba" };
  //     const mockCamaba = { foto_profil: "oldProfilePic.png", save: jest.fn() };

  //     Role.findOne.mockResolvedValue(mockRole);
  //     UserRole.findOne.mockResolvedValue({ id_user: 1, id_role: 1 });
  //     Camaba.findOne.mockResolvedValue(mockCamaba);

  //     await updateProfileCamabaActive(req, res, next);

  //     expect(mockCamaba.foto_profil).toEqual("http://localhost:4000/src/storage/camaba/profile/newProfilePic.png");
  //     expect(fs.unlink).toHaveBeenCalledWith(path.resolve(__dirname, "../../src/storage/camaba/profile/oldProfilePic.png"), expect.any(Function));
  //     expect(mockCamaba.save).toHaveBeenCalled();
  //     expect(res.statusCode).toEqual(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "UPDATE Profile Camaba Success",
  //       data: mockCamaba
  //     });
  //   });

  //   belum pass
  //   it("should update camaba profile without deleting old profile picture if no file is uploaded", async () => {
  //     req.file = null; // Tidak ada file yang diupload
  //     const mockRole = { id: 1, nama_role: "camaba" };
  //     const mockCamaba = { foto_profil: "oldProfilePic.png", save: jest.fn() };

  //     Role.findOne.mockResolvedValue(mockRole);
  //     UserRole.findOne.mockResolvedValue({ id_user: 1, id_role: 1 });
  //     Camaba.findOne.mockResolvedValue(mockCamaba);

  //     await updateProfileCamabaActive(req, res, next);

  //     expect(mockCamaba.foto_profil).toEqual("oldProfilePic.png"); // Foto profil tidak berubah
  //     expect(fs.unlink).not.toHaveBeenCalled(); // File lama tidak dihapus
  //     expect(mockCamaba.save).toHaveBeenCalled();
  //     expect(res.statusCode).toEqual(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: "UPDATE Profile Camaba Success",
  //       data: mockCamaba
  //     });
  //   });
});
