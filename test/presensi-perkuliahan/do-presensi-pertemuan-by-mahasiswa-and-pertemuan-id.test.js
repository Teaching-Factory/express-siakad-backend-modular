const { doPresensiPertemuanByMahasiswaAndPertemuanId } = require("../../src/controllers/presensi-perkuliahan");
const { UserRole, User, Mahasiswa, PresensiMahasiswa, PertemuanPerkuliahan } = require("../../models");
const moment = require("moment-timezone");

// Mock dependencies
jest.mock("../../models");
jest.mock("moment-timezone");

describe("doPresensiPertemuanByMahasiswaAndPertemuanId", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id_pertemuan_perkuliahan: "1",
      },
      user: {
        id: "123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 403 if user is not a student", async () => {
    UserRole.findOne.mockResolvedValue(null);

    await doPresensiPertemuanByMahasiswaAndPertemuanId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Anda tidak memiliki akses untuk melakukan presensi." });
  });

  it("should return 404 if user is not found", async () => {
    UserRole.findOne.mockResolvedValue({ id_user: "123" });
    User.findByPk.mockResolvedValue(null);

    await doPresensiPertemuanByMahasiswaAndPertemuanId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User tidak ditemukan." });
  });

  //   it("should return 404 if mahasiswa is not found", async () => {
  //     UserRole.findOne.mockResolvedValue({ id_user: "123" });
  //     User.findByPk.mockResolvedValue({ username: "123456" });
  //     Mahasiswa.findOne.mockResolvedValue(null);

  //     await doPresensiPertemuanByMahasiswaAndPertemuanId(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith({ message: "Mahasiswa tidak ditemukan." });
  //   });

  it("should return 400 if presensi already exists", async () => {
    UserRole.findOne.mockResolvedValue({ id_user: "123" });
    User.findByPk.mockResolvedValue({ username: "123456" });
    Mahasiswa.findOne.mockResolvedValue({ id_registrasi_mahasiswa: "1" });
    PresensiMahasiswa.findOne.mockResolvedValue({ id_pertemuan_perkuliahan: "1" });

    await doPresensiPertemuanByMahasiswaAndPertemuanId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Presensi sudah dilakukan untuk pertemuan ini." });
  });

  //   it("should return 400 if current time is not within meeting time", async () => {
  //     UserRole.findOne.mockResolvedValue({ id_user: "123" });
  //     User.findByPk.mockResolvedValue({ username: "123456" });
  //     Mahasiswa.findOne.mockResolvedValue({ id_registrasi_mahasiswa: "1" });
  //     PresensiMahasiswa.findOne.mockResolvedValue(null);
  //     PertemuanPerkuliahan.findByPk.mockResolvedValue({
  //       tanggal_pertemuan: "2024-07-24",
  //       waktu_mulai: "09:00:00",
  //       waktu_selesai: "10:00:00",
  //       kunci_pertemuan: false,
  //       buka_presensi: true,
  //     });

  //     moment.tz.mockReturnValue(moment("2024-07-24 08:00:00").tz("Asia/Jakarta")); // Set current time outside of meeting time

  //     await doPresensiPertemuanByMahasiswaAndPertemuanId(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(400);
  //     expect(res.json).toHaveBeenCalledWith({ message: "Anda hanya dapat melakukan presensi pada waktu pertemuan yang ditentukan." });
  //   });

  //   it("should return 400 if pertemuan has ended", async () => {
  //     UserRole.findOne.mockResolvedValue({ id_user: "123" });
  //     User.findByPk.mockResolvedValue({ username: "123456" });
  //     Mahasiswa.findOne.mockResolvedValue({ id_registrasi_mahasiswa: "1" });
  //     PresensiMahasiswa.findOne.mockResolvedValue(null);
  //     PertemuanPerkuliahan.findByPk.mockResolvedValue({
  //       tanggal_pertemuan: "2024-07-24",
  //       waktu_mulai: "09:00:00",
  //       waktu_selesai: "10:00:00",
  //       kunci_pertemuan: true,
  //       buka_presensi: true,
  //     });

  //     moment.tz.mockReturnValue(moment("2024-07-24 10:01:00").tz("Asia/Jakarta")); // Set current time after meeting end

  //     await doPresensiPertemuanByMahasiswaAndPertemuanId(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(400);
  //     expect(res.json).toHaveBeenCalledWith({ message: "Pertemuan telah berakhir, Anda tidak dapat melakukan presensi" });
  //   });

  //   it("should return 400 if presensi is not open", async () => {
  //     UserRole.findOne.mockResolvedValue({ id_user: "123" });
  //     User.findByPk.mockResolvedValue({ username: "123456" });
  //     Mahasiswa.findOne.mockResolvedValue({ id_registrasi_mahasiswa: "1" });
  //     PresensiMahasiswa.findOne.mockResolvedValue(null);
  //     PertemuanPerkuliahan.findByPk.mockResolvedValue({
  //       tanggal_pertemuan: "2024-07-24",
  //       waktu_mulai: "09:00:00",
  //       waktu_selesai: "10:00:00",
  //       kunci_pertemuan: false,
  //       buka_presensi: false,
  //     });

  //     moment.tz.mockReturnValue(moment("2024-07-24 09:00:00").tz("Asia/Jakarta")); // Set current time within meeting time

  //     await doPresensiPertemuanByMahasiswaAndPertemuanId(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(400);
  //     expect(res.json).toHaveBeenCalledWith({ message: "Pertemuan belum dibuka, Anda tidak dapat melakukan presensi" });
  //   });

  //   it("should successfully create presensi if all conditions are met", async () => {
  //     UserRole.findOne.mockResolvedValue({ id_user: "123" });
  //     User.findByPk.mockResolvedValue({ username: "123456" });
  //     Mahasiswa.findOne.mockResolvedValue({ id_registrasi_mahasiswa: "1" });
  //     PresensiMahasiswa.findOne.mockResolvedValue(null);
  //     PertemuanPerkuliahan.findByPk.mockResolvedValue({
  //       tanggal_pertemuan: "2024-07-24",
  //       waktu_mulai: "09:00:00",
  //       waktu_selesai: "10:00:00",
  //       kunci_pertemuan: false,
  //       buka_presensi: true,
  //     });

  //     moment.tz.mockReturnValue(moment("2024-07-24 09:30:00").tz("Asia/Jakarta")); // Set current time within meeting time

  //     PresensiMahasiswa.create.mockResolvedValue({
  //       presensi_hadir: true,
  //       status_presensi: "Hadir",
  //       id_pertemuan_perkuliahan: "1",
  //       id_registrasi_mahasiswa: "1",
  //     });

  //     await doPresensiPertemuanByMahasiswaAndPertemuanId(req, res, next);

  //     expect(PertemuanPerkuliahan.findByPk).toHaveBeenCalledWith("1");
  //     expect(PertemuanPerkuliahan.increment).toHaveBeenCalledWith("jumlah_mahasiswa_hadir");
  //     expect(PresensiMahasiswa.create).toHaveBeenCalledWith({
  //       presensi_hadir: true,
  //       status_presensi: "Hadir",
  //       id_pertemuan_perkuliahan: "1",
  //       id_registrasi_mahasiswa: "1",
  //     });

  //     expect(res.status).toHaveBeenCalledWith(201);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: "<===== Absensi Pertemuan Perkuliahan Success =====>",
  //       data: {
  //         presensi_hadir: true,
  //         status_presensi: "Hadir",
  //         id_pertemuan_perkuliahan: "1",
  //         id_registrasi_mahasiswa: "1",
  //       },
  //     });
  //   });

  it("should handle errors gracefully", async () => {
    const error = new Error("Something went wrong");
    UserRole.findOne.mockRejectedValue(error);

    await doPresensiPertemuanByMahasiswaAndPertemuanId(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
